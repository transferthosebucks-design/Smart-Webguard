// Simple Background Script for Testing
console.log("🛡️ ThreatGuard Simple Background Script Starting...");

class SimpleThreatGuard {
  constructor() {
    this.init();
  }

  init() {
    console.log("🚀 Simple ThreatGuard Initialized");
    this.setupTabMonitoring();
    this.setupMessageHandling();
  }

  setupTabMonitoring() {
    console.log("👁️ Setting up tab monitoring...");
    
    // Monitor tab updates
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.url && tab.url) {
        console.log("🔄 URL changed:", tab.url);
        await this.checkURL(tabId, tab.url);
      }
    });

    // Monitor tab activation
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
      try {
        const tab = await chrome.tabs.get(activeInfo.tabId);
        if (tab.url) {
          console.log("👆 Tab activated:", tab.url);
          await this.checkURL(activeInfo.tabId, tab.url);
        }
      } catch (error) {
        console.error("Error checking activated tab:", error);
      }
    });
  }

  async checkURL(tabId, url) {
    // Skip chrome:// pages
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      return;
    }

    console.log("🔍 Checking URL:", url);

    // Simple threat detection
    const analysis = this.analyzeURL(url);
    
    if (analysis.score >= 70) {
      console.log("🚨 THREAT DETECTED:", url, "Score:", analysis.score);
      await this.handleThreatDetected(tabId, url, analysis);
    }
  }

  analyzeURL(url) {
    let score = 0;
    console.log("🔍 Analyzing URL:", url);
    
    // More aggressive patterns for testing
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

    // Check for test sites (always block for testing)
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

  async handleThreatDetected(tabId, url, analysis) {
    console.log("🚨 Handling threat detection for:", url);

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
    await this.sendToLocalhost(url, analysis);

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

  async sendToLocalhost(url, analysis) {
    try {
      const tabs = await chrome.tabs.query({});
      
      for (const tab of tabs) {
        if (tab.url && (tab.url.includes('localhost:5173') || tab.url.includes('127.0.0.1:5173'))) {
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
      }
    } catch (error) {
      console.error("Error finding localhost tabs:", error);
    }
  }

  setupMessageHandling() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("📨 Background received message:", request);
      
      if (request.action === "testAlert") {
        console.log("🧪 Test alert requested");
        this.handleThreatDetected(sender.tab?.id || 1, "http://test-malicious-site.com", {
          score: 85,
          riskLevel: "high",
          category: "Test"
        });
        sendResponse({ status: "test_sent" });
      }
      
      return true;
    });
  }
}

// Initialize
console.log("🚀 Starting Simple ThreatGuard...");
new SimpleThreatGuard();
console.log("✅ Simple ThreatGuard Loaded");
