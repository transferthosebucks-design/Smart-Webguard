// ThreatGuard Chrome Extension - Background Script

class ThreatGuardExtension {

  constructor() {
    this.threatThreshold = 70;
    this.blockedURLs = new Set();
    this.init();
  }

  init() {

    this.setupTabMonitoring();
    console.log("ThreatGuard Extension Initialized");

  }

  setupTabMonitoring() {

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

      if (changeInfo.status === "complete" && tab.url) {

        console.log("Checking URL:", tab.url);
        this.checkURL(tabId, tab.url);

      }

    });

  }

  async checkURL(tabId, url) {

    if (
      url.startsWith("chrome://") ||
      url.startsWith("chrome-extension://") ||
      url.startsWith("about:")
    ) {
      return;
    }

    const analysis = this.analyzeURL(url);

    if (analysis.score >= this.threatThreshold) {

      this.handleThreatDetected(tabId, url, analysis);

    }

  }

  analyzeURL(url) {

    let score = 0;

    const suspiciousPatterns = [
      /verify.*account/i,
      /login.*secure/i,
      /bitcoin.*profit/i,
      /free.*download/i,
      /password.*reset/i,
      /bank.*update/i
    ];

    const suspiciousTLDs = [
      ".xyz",
      ".top",
      ".click",
      ".loan",
      ".tk"
    ];

    suspiciousPatterns.forEach(pattern => {

      if (pattern.test(url)) score += 25;

    });

    suspiciousTLDs.forEach(tld => {

      if (url.includes(tld)) score += 15;

    });

    if (url.startsWith("http://")) score += 10;

    let riskLevel = "low";

    if (score >= 70) riskLevel = "high";
    else if (score >= 40) riskLevel = "medium";

    return {
      score: Math.min(score, 100),
      riskLevel: riskLevel
    };

  }

  async handleThreatDetected(tabId, url, analysis) {
    console.log("Malicious site detected:", url);

    // Send threat alert to content script (for visual popup on localhost:5173)
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: "threatAlert",
        url: url,
        analysis: analysis,
        timestamp: Date.now()
      });
      console.log("Threat alert message sent to content script");
    } catch (error) {
      console.log("Could not send message to content script (tab may be closed or not ready):", error);
    }

    // Also send message to localhost:5173 if it's open
    await this.sendAlertToLocalhost(url, analysis);

    // Chrome notification (existing functionality)
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: " ThreatGuard Security Alert",
      message: `Malicious website detected: ${analysis.riskLevel} (Risk Score: ${analysis.score}/100)`,
      priority: 2,
      requireInteraction: true
    });

    // Block the URL after 3 seconds
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
        console.log("Redirected to warning page");
      } catch (error) {
        console.error("Error redirecting to warning page:", error);
      }
    }, 3000);
  }

  // Send alert to localhost:5173 web application
  async sendAlertToLocalhost(url, analysis) {
    try {
      // Get all tabs to find localhost:5173
      const tabs = await chrome.tabs.query({});
      
      for (const tab of tabs) {
        if (tab.url && tab.url.includes('localhost:5173')) {
          try {
            await chrome.tabs.sendMessage(tab.id, {
              action: "threatAlert",
              url: url,
              analysis: analysis,
              timestamp: Date.now(),
              source: 'background'
            });
            console.log("Threat alert sent to localhost:5173 tab:", tab.id);
          } catch (error) {
            console.log("Could not send to localhost tab:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error sending alert to localhost:", error);
    }
  }

}

new ThreatGuardExtension();