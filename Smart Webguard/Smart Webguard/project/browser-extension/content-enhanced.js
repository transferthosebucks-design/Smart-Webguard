// Enhanced Content Script - ThreatGuard with Content Scanner
console.log("🛡️ Enhanced ThreatGuard Content Script Loading...");

// Voice alert functionality
function playVoiceAlert(analysis) {
    try {
        const utterance = new SpeechSynthesisUtterance();
        const riskLevel = analysis?.riskLevel?.toLowerCase() || 'high';
        
        if (riskLevel === 'critical') {
            utterance.text = "Critical threat! Malicious website detected! Immediate action required!";
            utterance.rate = 1.1;
            utterance.pitch = 1.2;
            utterance.volume = 1.0;
        } else if (riskLevel === 'high') {
            utterance.text = "Warning! High risk malicious website detected! Please be careful!";
            utterance.rate = 1.0;
            utterance.pitch = 1.1;
            utterance.volume = 0.9;
        } else {
            utterance.text = "Suspicious website detected! Exercise caution!";
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;
        }
        
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') || 
            voice.name.includes('Karen') ||
            voice.name.includes('Google US English Female')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        window.speechSynthesis.speak(utterance);
        console.log("🔊 Voice alert played for:", riskLevel);
        
    } catch (error) {
        console.error("❌ Voice error:", error);
        // Fallback beep
        try {
            const audio = new AudioContext();
            const osc = audio.createOscillator();
            const gain = audio.createGain();
            osc.connect(gain);
            gain.connect(audio.destination);
            osc.frequency.value = 800;
            osc.start();
            osc.stop(audio.currentTime + 0.1);
        } catch (e) {
            console.error("❌ Beep error:", e);
        }
    }
}

// Content Scanner - Scan webpage for phishing keywords
function scanWebpageContent() {
    console.log("🔍 Scanning webpage content for phishing keywords...");
    
    const phishingKeywords = [
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
        'update payment',
        'crypto investment',
        'free bitcoin',
        'download now',
        'install update',
        'system infected'
    ];

    let foundKeywords = [];
    let contentScore = 0;

    // Scan page text content
    const pageText = document.body.innerText.toLowerCase();
    
    phishingKeywords.forEach(keyword => {
        if (pageText.includes(keyword.toLowerCase())) {
            foundKeywords.push(keyword);
            contentScore += 15; // Add 15 points per keyword found
            console.log("⚠️ Phishing keyword found:", keyword);
        }
    });

    // Scan page title
    const pageTitle = document.title.toLowerCase();
    phishingKeywords.forEach(keyword => {
        if (pageTitle.includes(keyword.toLowerCase())) {
            foundKeywords.push(keyword);
            contentScore += 20; // Extra weight for title keywords
            console.log("⚠️ Phishing keyword in title:", keyword);
        }
    });

    // Scan meta tags
    const metaTags = document.querySelectorAll('meta[name="description"], meta[name="keywords"]');
    metaTags.forEach(meta => {
        const content = meta.getAttribute('content')?.toLowerCase() || '';
        phishingKeywords.forEach(keyword => {
            if (content.includes(keyword.toLowerCase())) {
                foundKeywords.push(keyword);
                contentScore += 10; // Weight for meta tags
                console.log("⚠️ Phishing keyword in meta:", keyword);
            }
        });
    });

    // Scan links and buttons
    const links = document.querySelectorAll('a, button');
    links.forEach(element => {
        const text = element.innerText.toLowerCase();
        phishingKeywords.forEach(keyword => {
            if (text.includes(keyword.toLowerCase())) {
                foundKeywords.push(keyword);
                contentScore += 10; // Weight for links/buttons
                console.log("⚠️ Phishing keyword in link/button:", keyword);
            }
        });
    });

    // Scan form inputs
    const inputs = document.querySelectorAll('input[type="password"], input[type="email"], input[type="text"]');
    if (inputs.length > 2) {
        contentScore += 5; // Extra points for multiple input fields
        console.log("⚠️ Multiple form inputs detected");
    }

    // Check for hidden elements (common in phishing)
    const hiddenElements = document.querySelectorAll('[style*="display:none"], [style*="visibility:hidden"]');
    if (hiddenElements.length > 5) {
        contentScore += 10;
        console.log("⚠️ Many hidden elements detected");
    }

    // Check for external scripts (common in malicious sites)
    const externalScripts = document.querySelectorAll('script[src]');
    const suspiciousDomains = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl'];
    externalScripts.forEach(script => {
        const src = script.getAttribute('src') || '';
        suspiciousDomains.forEach(domain => {
            if (src.includes(domain)) {
                contentScore += 15;
                foundKeywords.push(`Suspicious script: ${domain}`);
                console.log("⚠️ Suspicious script domain:", domain);
            }
        });
    });

    console.log("📊 Content scan results:");
    console.log("  - Found keywords:", foundKeywords);
    console.log("  - Content score:", contentScore);

    return {
        foundKeywords: [...new Set(foundKeywords)], // Remove duplicates
        contentScore: Math.min(contentScore, 100),
        totalElements: {
            links: links.length,
            inputs: inputs.length,
            hiddenElements: hiddenElements.length,
            externalScripts: externalScripts.length
        }
    };
}

// Create threat popup
function createThreatPopup(url, analysis) {
    console.log("🎨 Creating threat popup for:", url);
    
    // Play voice alert
    playVoiceAlert(analysis);
    
    // Remove existing popups
    const existing = document.querySelectorAll('[id^="threatguard-"]');
    existing.forEach(el => el.remove());
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'threatguard-alert-' + Date.now();
    popup.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 380px;
        background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        color: white;
        padding: 20px;
        border-radius: 12px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
        border: 2px solid #b91c1c;
        animation: slideIn 0.5s ease-out;
    `;
    
    // Add animation
    if (!document.getElementById('threatguard-animations')) {
        const style = document.createElement('style');
        style.id = 'threatguard-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Popup content
    popup.innerHTML = `
        <div>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; animation: pulse 2s infinite;">⚠️</div>
                <div style="flex: 1;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700;">🚨 ThreatGuard Security Alert</h3>
                    <p style="margin: 2px 0 0 0; font-size: 12px; opacity: 0.9;">Malicious Website Detected</p>
                    <p style="margin: 2px 0 0 0; font-size: 10px; opacity: 0.7;">🔊 Voice alert played</p>
                </div>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
            </div>
            
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <div style="margin-bottom: 10px;">
                    <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px;">Malicious URL:</div>
                    <div style="font-size: 13px; font-weight: 600; word-break: break-all;">${url.length > 45 ? url.substring(0, 45) + '...' : url}</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px;">Threat Score:</div>
                        <div style="font-size: 16px; font-weight: 700;">${analysis.score || 0}/100</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px;">Risk Level:</div>
                        <div style="font-size: 14px; font-weight: 700; text-transform: uppercase;">${analysis.riskLevel || 'HIGH'}</div>
                    </div>
                </div>

                <div style="margin-top: 10px;">
                    <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px;">Category:</div>
                    <div style="font-size: 13px; font-weight: 600;">${analysis.category || 'Malicious Website'}</div>
                </div>

                ${analysis.contentThreats ? `
                <div style="margin-top: 10px;">
                    <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px;">Suspicious Content:</div>
                    <div style="font-size: 11px; font-weight: 600; color: #fbbf24;">
                        ${analysis.contentThreats.slice(0, 3).join(', ')}
                        ${analysis.contentThreats.length > 3 ? ` (+${analysis.contentThreats.length - 3} more)` : ''}
                    </div>
                </div>
                ` : ''}
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
    console.log("✅ Popup added successfully");
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.style.animation = 'slideIn 0.5s ease-out reverse';
            setTimeout(() => {
                if (popup.parentElement) {
                    popup.remove();
                    console.log("🗑️ Popup removed");
                }
            }, 500);
        }
    }, 5000);
    
    return popup;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("📨 Message received in content script:", request);
    
    if (request.action === "threatAlert") {
        console.log("🚨 REAL THREAT ALERT DETECTED!");
        console.log("🔗 URL:", request.url);
        console.log("📊 Analysis:", request.analysis);
        
        try {
            const popup = createThreatPopup(request.url, request.analysis || {});
            sendResponse({ status: "popup_created", popupId: popup.id });
        } catch (error) {
            console.error("❌ Error creating popup:", error);
            sendResponse({ status: "error", error: error.message });
        }
    }
    
    if (request.action === "scanContent") {
        console.log("🔍 Starting content scan...");
        
        // Wait a bit for page to load
        setTimeout(() => {
            try {
                const scanResult = scanWebpageContent();
                
                // Send results back to background script
                chrome.runtime.sendMessage({
                    action: "contentScanResult",
                    url: request.url,
                    urlAnalysis: request.urlAnalysis,
                    contentScore: scanResult.contentScore,
                    foundKeywords: scanResult.foundKeywords,
                    scanDetails: scanResult.totalElements
                });
                
                console.log("📤 Content scan results sent to background");
                sendResponse({ status: "contentScanned", result: scanResult });
                
            } catch (error) {
                console.error("❌ Error scanning content:", error);
                sendResponse({ status: "scanError", error: error.message });
            }
        }, 2000); // Wait 2 seconds for page to fully load
    }
    
    return true;
});

// Initialize when page is ready
function initializeEnhancedScript() {
    console.log("🚀 Initializing Enhanced ThreatGuard Content Script");
    console.log("📍 Page URL:", window.location.href);
    console.log("📄 Page ready state:", document.readyState);
    
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log("✅ DOM Content Loaded - Enhanced script ready");
        });
    } else {
        console.log("✅ Enhanced ThreatGuard Content Script Fully Initialized");
    }
}

// Start initialization
initializeEnhancedScript();

console.log("✅ Enhanced ThreatGuard Content Script Loaded - Ready for real threats and content scanning");
