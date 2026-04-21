// Enhanced Background Script - ThreatGuard with History, Risk Indicator, and Content Scanner
class ThreatGuardBackground {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log("🛡️ Enhanced ThreatGuard Background Script Loading...");
    this.setupTabMonitoring();
    this.setupStorageCleanup();
  }

  setupTabMonitoring() {
    // Monitor tab updates for URL changes
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.analyzeURL(tabId, tab.url);
      }
    });

    // Monitor new tabs
    chrome.tabs.onCreated.addListener((tab) => {
      if (tab.url && tab.url !== 'chrome://newtab/') {
        this.analyzeURL(tab.id, tab.url);
      }
    });
  }

  setupStorageCleanup() {
    // Clean up old threat history periodically (keep only last 10)
    setInterval(async () => {
      await this.cleanupThreatHistory();
    }, 24 * 60 * 60 * 1000); // Daily cleanup
  }

  async analyzeURL(tabId, url) {
    console.log("🔍 Analyzing URL:", url);
    
    try {
      // Skip chrome:// and other internal URLs
      if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
        return;
      }

      const analysis = await this.performThreatAnalysis(url);
      console.log("📊 Analysis result:", analysis);

      // Update extension icon based on risk level
      await this.updateExtensionIcon(analysis.riskLevel);

      // Handle high/critical threats
      if (analysis.score >= 70) {
        await this.handleThreatDetected(tabId, url, analysis);
      }

      // Send content scanner to page
      await this.sendContentScanner(tabId, url, analysis);

    } catch (error) {
      console.error("❌ URL analysis failed:", error);
    }
  }

  async performThreatAnalysis(url) {
    let score = 0;
    
    // Suspicious patterns
    const suspiciousPatterns = [
      /verify.*account/i,
      /login.*secure/i,
      /bitcoin.*profit/i,
      /free.*download/i,
      /password.*reset/i,
      /bank.*update/i,
      /suspended/i,
      /urgent/i,
      /click.*here/i,
      /malware/i,
      /virus/i,
      /security.*breach/i,
      /test.*phishing/i,
      /fake.*site/i
    ];

    const suspiciousTLDs = ['.xyz', '.top', '.info', '.click', '.loan', '.tk', '.ml', '.ga', '.cf'];

    // Check patterns
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(url)) {
        score += 30;
        console.log("⚠️ Suspicious pattern found:", pattern.source);
      }
    });

    // Check TLDs
    suspiciousTLDs.forEach(tld => {
      if (url.includes(tld)) {
        score += 20;
        console.log("⚠️ Suspicious TLD found:", tld);
      }
    });

    // Check HTTP
    if (url.startsWith('http://')) {
      score += 15;
      console.log("⚠️ HTTP protocol detected");
    }

    // Check IP addresses
    if (/\d+\.\d+\.\d+\.\d+/.test(url)) {
      score += 25;
      console.log("⚠️ IP address detected");
    }

    // Check for test sites
    if (url.includes('test-phishing') || url.includes('malicious-test') || url.includes('fake-site')) {
      score = 90;
      console.log("🧪 Test malicious site detected - setting score to 90");
    }

    // Check for long URLs
    if (url.length > 100) {
      score += 10;
      console.log("⚠️ Long URL detected");
    }

    const finalScore = Math.min(score, 100);
    console.log("📊 Final score:", finalScore);

    return {
      score: finalScore,
      riskLevel: finalScore >= 70 ? 'high' : finalScore >= 40 ? 'medium' : 'low',
      category: finalScore >= 70 ? 'Malicious' : 'Suspicious'
    };
  }

  async updateExtensionIcon(riskLevel) {
    const iconPath = {
      'high': {
        '16': 'icons/icon16-red.png',
        '48': 'icons/icon48-red.png',
        '128': 'icons/icon128-red.png'
      },
      'medium': {
        '16': 'icons/icon16-yellow.png',
        '48': 'icons/icon48-yellow.png',
        '128': 'icons/icon128-yellow.png'
      },
      'low': {
        '16': 'icons/icon16-green.png',
        '48': 'icons/icon48-green.png',
        '128': 'icons/icon128-green.png'
      }
    };

    const icons = iconPath[riskLevel] || iconPath['low'];
    
    try {
      await chrome.action.setIcon({
        path: icons
      });
      
      // Update badge
      await chrome.action.setBadgeText({
        text: riskLevel === 'high' ? '!' : riskLevel === 'medium' ? '?' : ''
      });
      
      await chrome.action.setBadgeBackgroundColor({
        color: riskLevel === 'high' ? '#dc2626' : riskLevel === 'medium' ? '#f59e0b' : '#10b981'
      });
      
      console.log("🎨 Extension icon updated to:", riskLevel);
    } catch (error) {
      console.error("❌ Failed to update extension icon:", error);
    }
  }

  async handleThreatDetected(tabId, url, analysis) {
    console.log("🚨 Handling threat detection for:", url);

    // Save to threat history
    await this.saveThreatToHistory(url, analysis);

    // Send to content script
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: "threatAlert",
        url: url,
        analysis: analysis,
        timestamp: Date.now()
      });
      console.log("✅ Message sent to content script");
    } catch (error) {
      console.log("❌ Could not send to content script:", error);
    }

    // Send to localhost:5173 if open
    await this.sendAlertToLocalhost(url, analysis);

    // Chrome notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "🚨 ThreatGuard Alert",
      message: `Threat detected: ${analysis.riskLevel} (${analysis.score}/100)`,
      priority: 2
    });

    // BLOCK THE WEBSITE after 3 seconds
    console.log("⏰ Will block website in 3 seconds...");
    setTimeout(async () => {
      try {
        console.log("🚫 BLOCKING malicious website:", url);
        
        // Create warning page data
        const warningData = {
          blockedUrl: url,
          threatScore: analysis.score,
          riskLevel: analysis.riskLevel,
          category: analysis.category,
          timestamp: new Date().toISOString()
        };

        // Redirect to warning page
        const warningURL = chrome.runtime.getURL("warning.html") + 
                          "?data=" + encodeURIComponent(JSON.stringify(warningData));

        await chrome.tabs.update(tabId, { url: warningURL });
        console.log("✅ Redirected to warning page");
        
      } catch (error) {
        console.error("❌ Error blocking website:", error);
      }
    }, 3000); // 3 second delay
  }

  async sendContentScanner(tabId, url, urlAnalysis) {
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: "scanContent",
        url: url,
        urlAnalysis: urlAnalysis
      });
      console.log("🔍 Content scanner sent to page");
    } catch (error) {
      console.log("❌ Could not send content scanner:", error);
    }
  }

  async sendAlertToLocalhost(url, analysis) {
    try {
      const tabs = await chrome.tabs.query({ url: "http://localhost:5173/*" });
      
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: "threatAlert",
            url: url,
            analysis: analysis,
            timestamp: Date.now()
          });
          console.log("✅ Alert sent to localhost tab:", tab.id);
        } catch (error) {
          console.log("❌ Could not send to localhost tab:", error);
        }
      }
    } catch (error) {
      console.error("❌ Error querying localhost tabs:", error);
    }
  }

  async saveThreatToHistory(url, analysis) {
    try {
      const threatData = {
        url: url,
        threatScore: analysis.score,
        riskLevel: analysis.riskLevel,
        timestamp: new Date().toISOString(),
        category: analysis.category
      };

      // Get existing threats
      const result = await chrome.storage.local.get(['threatHistory']);
      let threats = result.threatHistory || [];

      // Add new threat to beginning
      threats.unshift(threatData);

      // Keep only last 10 threats
      threats = threats.slice(0, 10);

      // Save updated history
      await chrome.storage.local.set({ threatHistory: threats });
      
      console.log("💾 Threat saved to history:", threatData);
      console.log("📊 Total threats in history:", threats.length);

    } catch (error) {
      console.error("❌ Failed to save threat to history:", error);
    }
  }

  async cleanupThreatHistory() {
    try {
      const result = await chrome.storage.local.get(['threatHistory']);
      let threats = result.threatHistory || [];
      
      // Keep only last 10
      if (threats.length > 10) {
        threats = threats.slice(0, 10);
        await chrome.storage.local.set({ threatHistory: threats });
        console.log("🧹 Cleaned up threat history, kept last", threats.length, "threats");
      }
    } catch (error) {
      console.error("❌ Failed to cleanup threat history:", error);
    }
  }

  // API to get threat history
  async getThreatHistory() {
    try {
      const result = await chrome.storage.local.get(['threatHistory']);
      return result.threatHistory || [];
    } catch (error) {
      console.error("❌ Failed to get threat history:", error);
      return [];
    }
  }

  // API to clear threat history
  async clearThreatHistory() {
    try {
      await chrome.storage.local.set({ threatHistory: [] });
      console.log("🗑️ Threat history cleared");
    } catch (error) {
      console.error("❌ Failed to clear threat history:", error);
    }
  }
}

// Initialize the enhanced background script
const threatGuard = new ThreatGuardBackground();

// Handle messages from content scripts with content scan results
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📨 Message received in background:", request);

  if (request.action === "contentScanResult") {
    console.log("🔍 Content scan result received:", request);
    
    // If content scan found threats, update analysis
    if (request.contentScore > 0) {
      console.log("⚠️ Content threats detected, updating analysis");
      
      // Update threat score based on content
      const updatedScore = Math.min(100, request.urlAnalysis.score + request.contentScore);
      const updatedAnalysis = {
        ...request.urlAnalysis,
        score: updatedScore,
        riskLevel: updatedScore >= 70 ? 'high' : updatedScore >= 40 ? 'medium' : 'low',
        contentThreats: request.foundKeywords
      };

      // If new score is high enough, handle as threat
      if (updatedScore >= 70) {
        threatGuard.handleThreatDetected(sender.tab.id, request.url, updatedAnalysis);
      }

      // Update extension icon
      threatGuard.updateExtensionIcon(updatedAnalysis.riskLevel);
    }
    
    sendResponse({ status: "contentScanProcessed" });
  }

  // Handle requests for threat history
  if (request.action === "getThreatHistory") {
    threatGuard.getThreatHistory().then(history => {
      sendResponse({ history: history });
    });
    return true; // Keep message channel open
  }

  // Handle requests to clear threat history
  if (request.action === "clearThreatHistory") {
    threatGuard.clearThreatHistory().then(() => {
      sendResponse({ status: "historyCleared" });
    });
    return true; // Keep message channel open
  }

  return true;
});

console.log("🚀 Enhanced ThreatGuard Background Script Fully Initialized");
