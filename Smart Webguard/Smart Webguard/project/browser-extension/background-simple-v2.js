// Simple Enhanced Background Script - Step by Step Implementation
console.log("🛡️ Simple Enhanced Background Loading...");

class SimpleThreatGuard {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log("🚀 Initializing Simple Enhanced ThreatGuard");
    this.setupTabMonitoring();
  }

  setupTabMonitoring() {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.analyzeURL(tabId, tab.url);
      }
    });
  }

  async analyzeURL(tabId, url) {
    console.log("🔍 Analyzing URL:", url);
    
    // Skip internal URLs
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      return;
    }

    const analysis = this.performSimpleAnalysis(url);
    console.log("📊 Analysis result:", analysis);

    // Update icon based on risk
    await this.updateIcon(analysis.riskLevel);

    // Handle threats
    if (analysis.score >= 70) {
      await this.handleThreat(tabId, url, analysis);
    }

    // Send content scanner
    await this.sendContentScanner(tabId, url, analysis);
  }

  performSimpleAnalysis(url) {
    let score = 0;
    
    // Simple patterns
    const patterns = [
      /verify.*account/i,
      /login.*secure/i,
      /bitcoin.*profit/i,
      /password.*reset/i,
      /bank.*update/i
    ];

    patterns.forEach(pattern => {
      if (pattern.test(url)) {
        score += 30;
      }
    });

    // Check suspicious TLDs
    const suspiciousTLDs = ['.xyz', '.top', '.info', '.click'];
    suspiciousTLDs.forEach(tld => {
      if (url.includes(tld)) score += 20;
    });

    // HTTP check
    if (url.startsWith('http://')) score += 15;

    // Test sites
    if (url.includes('test-phishing') || url.includes('malicious-test')) {
      score = 90;
    }

    score = Math.min(score, 100);

    return {
      score: score,
      riskLevel: score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low',
      category: score >= 70 ? 'Malicious' : 'Suspicious'
    };
  }

  async updateIcon(riskLevel) {
    console.log("🎨 Updating icon for:", riskLevel);
    
    try {
      // Use default Chrome icons (no custom icons needed)
      if (riskLevel === 'high') {
        await chrome.action.setIcon({ 
          path: {
            '16': 'icons/icon16.png',
            '48': 'icons/icon48.png', 
            '128': 'icons/icon128.png'
          }
        });
        await chrome.action.setBadgeText({ text: '!' });
        await chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
      } else if (riskLevel === 'medium') {
        await chrome.action.setIcon({ 
          path: {
            '16': 'icons/icon16.png',
            '48': 'icons/icon48.png',
            '128': 'icons/icon128.png'
          }
        });
        await chrome.action.setBadgeText({ text: '?' });
        await chrome.action.setBadgeBackgroundColor({ color: '#f59e0b' });
      } else {
        await chrome.action.setIcon({ 
          path: {
            '16': 'icons/icon16.png',
            '48': 'icons/icon48.png',
            '128': 'icons/icon128.png'
          }
        });
        await chrome.action.setBadgeText({ text: '' });
      }
      
      console.log("✅ Icon updated successfully");
    } catch (error) {
      console.error("❌ Icon update failed:", error);
    }
  }

  async handleThreat(tabId, url, analysis) {
    console.log("🚨 Handling threat:", url);

    // Save to history
    await this.saveToHistory(url, analysis);

    // Send alert to content script
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: "threatAlert",
        url: url,
        analysis: analysis,
        timestamp: Date.now()
      });
    } catch (error) {
      console.log("❌ Could not send to content script");
    }

    // Chrome notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "🚨 ThreatGuard Alert",
      message: `Threat detected: ${analysis.riskLevel} (${analysis.score}/100)`,
      priority: 2
    });

    // Block after 3 seconds
    setTimeout(async () => {
      try {
        const warningData = {
          blockedUrl: url,
          threatScore: analysis.score,
          riskLevel: analysis.riskLevel,
          timestamp: new Date().toISOString()
        };

        const warningURL = chrome.runtime.getURL("warning.html") + 
                          "?data=" + encodeURIComponent(JSON.stringify(warningData));

        await chrome.tabs.update(tabId, { url: warningURL });
        console.log("✅ Website blocked");
      } catch (error) {
        console.error("❌ Error blocking website:", error);
      }
    }, 3000);
  }

  async sendContentScanner(tabId, url, analysis) {
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: "scanContent",
        url: url,
        urlAnalysis: analysis
      });
    } catch (error) {
      console.log("❌ Could not send content scanner");
    }
  }

  async saveToHistory(url, analysis) {
    try {
      const threatData = {
        url: url,
        threatScore: analysis.score,
        riskLevel: analysis.riskLevel,
        timestamp: new Date().toISOString(),
        category: analysis.category
      };

      const result = await chrome.storage.local.get(['threatHistory']);
      let threats = result.threatHistory || [];

      threats.unshift(threatData);
      threats = threats.slice(0, 10); // Keep only last 10

      await chrome.storage.local.set({ threatHistory: threats });
      console.log("💾 Threat saved to history");
    } catch (error) {
      console.error("❌ Failed to save threat:", error);
    }
  }
}

// Initialize
const threatGuard = new SimpleThreatGuard();

// Handle messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📨 Message received:", request);

  if (request.action === "contentScanResult") {
    console.log("🔍 Content scan result:", request);
    
    if (request.contentScore > 0) {
      const updatedScore = Math.min(100, request.urlAnalysis.score + request.contentScore);
      const updatedAnalysis = {
        ...request.urlAnalysis,
        score: updatedScore,
        riskLevel: updatedScore >= 70 ? 'high' : updatedScore >= 40 ? 'medium' : 'low'
      };

      if (updatedScore >= 70) {
        threatGuard.handleThreat(sender.tab.id, request.url, updatedAnalysis);
      }

      threatGuard.updateIcon(updatedAnalysis.riskLevel);
    }
    
    sendResponse({ status: "processed" });
  }

  if (request.action === "getThreatHistory") {
    chrome.storage.local.get(['threatHistory']).then(result => {
      sendResponse({ history: result.threatHistory || [] });
    });
    return true;
  }

  if (request.action === "clearThreatHistory") {
    chrome.storage.local.set({ threatHistory: [] }).then(() => {
      sendResponse({ status: "cleared" });
    });
    return true;
  }

  return true;
});

console.log("✅ Simple Enhanced Background Script Loaded");
