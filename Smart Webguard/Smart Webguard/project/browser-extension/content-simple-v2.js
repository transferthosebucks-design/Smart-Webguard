// Simple Enhanced Content Script - Step by Step Implementation
console.log("🛡️ Simple Enhanced Content Script Loading...");

// Content Scanner
function scanContent() {
    console.log("🔍 Scanning page content...");
    
    const keywords = [
        'verify account',
        'bank login', 
        'reset password',
        'crypto profit',
        'bitcoin profit',
        'suspended account',
        'urgent action',
        'click here',
        'security breach',
        'malware detected',
        'virus warning',
        'fake site',
        'phishing attempt',
        'account locked',
        'verify identity',
        'update payment'
    ];

    let foundKeywords = [];
    let score = 0;

    // Scan page text
    const pageText = document.body.innerText.toLowerCase();
    keywords.forEach(keyword => {
        if (pageText.includes(keyword.toLowerCase())) {
            foundKeywords.push(keyword);
            score += 10;
            console.log("⚠️ Found keyword:", keyword);
        }
    });

    // Scan title
    const title = document.title.toLowerCase();
    keywords.forEach(keyword => {
        if (title.includes(keyword.toLowerCase())) {
            foundKeywords.push(keyword);
            score += 15;
            console.log("⚠️ Found keyword in title:", keyword);
        }
    });

    console.log("📊 Content scan results:");
    console.log("  Keywords found:", foundKeywords);
    console.log("  Content score:", score);

    return {
        foundKeywords: foundKeywords,
        contentScore: Math.min(score, 100)
    };
}

// Create popup
function createPopup(url, analysis) {
    console.log("🎨 Creating popup for:", url);
    
    // Remove existing popups
    const existing = document.querySelectorAll('[id^="threatguard-"]');
    existing.forEach(el => el.remove());
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'threatguard-popup-' + Date.now();
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        z-index: 999999;
        font-family: system-ui;
        box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
        border: 2px solid #b91c1c;
    `;
    
    popup.innerHTML = `
        <div>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">⚠️</div>
                <div style="flex: 1;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700;">🚨 ThreatGuard Alert</h3>
                    <p style="margin: 2px 0 0 0; font-size: 12px; opacity: 0.9;">Malicious Website Detected</p>
                </div>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
            </div>
            
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <div style="margin-bottom: 10px;">
                    <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px;">URL:</div>
                    <div style="font-size: 13px; font-weight: 600; word-break: break-all;">${url.length > 40 ? url.substring(0, 40) + '...' : url}</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px;">Score:</div>
                        <div style="font-size: 16px; font-weight: 700;">${analysis.score}/100</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px;">Risk:</div>
                        <div style="font-size: 14px; font-weight: 700; text-transform: uppercase;">${analysis.riskLevel}</div>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 10px;">
                <button onclick="this.parentElement.parentElement.remove()" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Acknowledge</button>
                <button onclick="navigator.clipboard.writeText('${url}'); this.textContent='Copied!'" style="flex: 1; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Copy URL</button>
            </div>

            <div style="text-align: center; margin-top: 10px; font-size: 10px; opacity: 0.7;">
                ⏰ This page will be blocked in 3 seconds
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    console.log("✅ Popup created");
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
            console.log("🗑️ Popup removed");
        }
    }, 5000);
    
    return popup;
}

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("📨 Message received:", request);
    
    if (request.action === "threatAlert") {
        console.log("🚨 Threat alert detected!");
        createPopup(request.url, request.analysis || {});
        sendResponse({ status: "popup_created" });
    }
    
    if (request.action === "scanContent") {
        console.log("🔍 Starting content scan...");
        
        setTimeout(() => {
            const scanResult = scanContent();
            
            // Send results back
            chrome.runtime.sendMessage({
                action: "contentScanResult",
                url: request.url,
                urlAnalysis: request.urlAnalysis,
                contentScore: scanResult.contentScore,
                foundKeywords: scanResult.foundKeywords
            });
            
            console.log("📤 Content scan results sent");
            sendResponse({ status: "scanned", result: scanResult });
        }, 2000);
    }
    
    return true;
});

// Initialize
console.log("✅ Simple Enhanced Content Script Loaded");
