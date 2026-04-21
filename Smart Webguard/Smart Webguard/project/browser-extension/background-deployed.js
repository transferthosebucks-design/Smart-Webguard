// Background Script - Deployed Version
console.log("🛡️ ThreatGuard Background Script - Deployed Version Loading...");

class ThreatGuardBackground {
  constructor() {
    this.initialize();
  }

  initialize() {
    console.log("🚀 Initializing ThreatGuard Background - Deployed Version");
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
    
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      return;
    }

    const analysis = this.performThreatAnalysis(url);
    console.log("📊 Analysis result:", analysis);

    if (analysis.score >= 70) {
      await this.handleThreatDetected(tabId, url, analysis);
    }

    await this.sendAlertToWebApp(tabId, url, analysis);
  }

  performThreatAnalysis(url) {
    let score = 0;
    
    const suspiciousPatterns = [
      /verify.*account/i,
      /login.*secure/i,
      /bitcoin.*profit/i,
      /password.*reset/i,
      /bank.*update/i
    ];

    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(url)) {
        score += 30;
      }
    });

    const suspiciousTLDs = ['.xyz', '.top', '.info', '.click'];
    suspiciousTLDs.forEach(tld => {
      if (url.includes(tld)) score += 20;
    });

    if (url.startsWith('http://')) score += 15;
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

  async handleThreatDetected(tabId, url, analysis) {
    console.log("🚨 Handling threat detection for:", url);

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

    await this.sendAlertToWebApp(tabId, url, analysis);

    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "🚨 ThreatGuard Alert",
      message: `Threat detected: ${analysis.riskLevel} (${analysis.score}/100)`,
      priority: 2
    });

    setTimeout(async () => {
      try {
        const warningData = {
          blockedUrl: url,
          threatScore: analysis.score,
          riskLevel: analysis.riskLevel,
          category: analysis.category,
          timestamp: new Date().toISOString()
        };

        const warningURL = chrome.runtime.getURL("warning.html") + 
                          "?data=" + encodeURIComponent(JSON.stringify(warningData));

        await chrome.tabs.update(tabId, { url: warningURL });
        console.log("✅ Redirected to warning page");
        
      } catch (error) {
        console.error("❌ Error blocking website:", error);
      }
    }, 3000);
  }

  async sendAlertToWebApp(tabId, url, analysis) {
    try {
      // IMPORTANT: Updated to deployed URL
      const tabs = await chrome.tabs.query({ 
        url: "https://igma-11.vercel.app/*" 
      });
      
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: "threatAlert",
            url: url,
            analysis: analysis,
            timestamp: Date.now()
          });
          console.log("✅ Alert sent to deployed web app:", tab.id);
        } catch (error) {
          console.log("❌ Could not send to web app tab:", error);
        }
      }
    } catch (error) {
      console.error("❌ Error querying web app tabs:", error);
    }
  }
}

const threatGuard = new ThreatGuardBackground();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📨 Message received in background:", request);

  if (request.action === "getThreatHistory") {
    chrome.storage.local.get(['threatHistory']).then(result => {
      sendResponse({ history: result.threatHistory || [] });
    });
    return true;
  }

  if (request.action === "clearThreatHistory") {
    chrome.storage.local.set({ threatHistory: [] }).then(() => {
      sendResponse({ status: "historyCleared" });
    });
    return true;
  }

  return true;
});

console.log("🚀 ThreatGuard Background Script - Deployed Version Fully Initialized");
console.log("🌐 Web App URL: https://igma-11.vercel.app");
