// Enhanced Content Script for ThreatGuard Notifications
// Focus: Reliable popup display on localhost:5173

console.log("🛡️ ThreatGuard Popup Script Loading...");

// Global function to test popup immediately
window.testThreatGuardPopup = function() {
    console.log("🧪 Manual popup test triggered");
    createThreatPopup("http://test-malicious-site.com", {
        score: 85,
        riskLevel: "high", 
        category: "Test Threat"
    });
};

// Create threat popup function
function createThreatPopup(url, analysis) {
    console.log("🎨 Creating threat popup for:", url);
    console.log("📊 Analysis data:", analysis);
    
    // Play voice alert immediately
    playVoiceAlert(analysis);
    
    // Remove any existing popups
    const existing = document.querySelectorAll('[id^="threatguard-"]');
    existing.forEach(el => el.remove());
    
    // Create main popup container
    const popup = document.createElement('div');
    popup.id = 'threatguard-notification-' + Date.now();
    popup.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        width: 350px !important;
        background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%) !important;
        color: white !important;
        padding: 0 !important;
        border-radius: 12px !important;
        z-index: 999999 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        box-shadow: 0 10px 30px rgba(220, 38, 38, 0.5) !important;
        border: 2px solid #b91c1c !important;
        animation: threatguardSlideIn 0.5s ease-out !important;
    `;
    
    // Add animation styles
    if (!document.getElementById('threatguard-popup-styles')) {
        const style = document.createElement('style');
        style.id = 'threatguard-popup-styles';
        style.textContent = `
            @keyframes threatguardSlideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes threatguardPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Popup content
    popup.innerHTML = `
        <div style="padding: 20px;">
            <!-- Header -->
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; animation: threatguardPulse 2s infinite;">
                    <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                </div>
                <div style="flex: 1;">
                    <h3 style="margin: 0; font-size: 18px; font-weight: 700;">🚨 ThreatGuard Security Alert</h3>
                    <p style="margin: 2px 0 0 0; font-size: 12px; opacity: 0.9;">Malicious Website Detected</p>
                    <p style="margin: 2px 0 0 0; font-size: 10px; opacity: 0.7; font-style: italic;">🔊 Voice alert played</p>
                </div>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; opacity: 0.8; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: opacity 0.3s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">×</button>
            </div>

            <!-- Alert Content -->
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px;">Malicious URL:</div>
                    <div style="font-size: 13px; font-weight: 600; word-break: break-all; line-height: 1.3;">${truncateURL(url, 45)}</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <div>
                        <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px;">Threat Score:</div>
                        <div style="font-size: 16px; font-weight: 700;">${analysis.score || 0}/100</div>
                    </div>
                    <div>
                        <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px;">Risk Level:</div>
                        <div style="font-size: 14px; font-weight: 700; text-transform: uppercase;">${analysis.riskLevel || 'HIGH'}</div>
                    </div>
                </div>

                <div>
                    <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px;">Category:</div>
                    <div style="font-size: 13px; font-weight: 600;">${analysis.category || 'Malicious Website'}</div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                <button onclick="this.parentElement.parentElement.remove(); stopVoiceAlert();" style="flex: 1; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">Acknowledge</button>
                <button onclick="console.log('📍 URL copied to clipboard'); navigator.clipboard.writeText('${url}')" style="flex: 1; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">Copy URL</button>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 10px; font-size: 10px; opacity: 0.7;">
                ⏰ This page will be blocked in 3 seconds
            </div>
        </div>
    `;
    
    // Add to page
    try {
        document.body.appendChild(popup);
        console.log("✅ Popup successfully added to page");
        console.log("📍 Popup element:", popup);
        
        // Verify popup is visible
        setTimeout(() => {
            const rect = popup.getBoundingClientRect();
            console.log("📏 Popup dimensions:", rect);
            if (rect.width === 0 || rect.height === 0) {
                console.error("❌ Popup not visible - check CSS conflicts");
            } else {
                console.log("✅ Popup is visible and positioned correctly");
            }
        }, 100);
        
    } catch (error) {
        console.error("❌ Error adding popup to page:", error);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.style.animation = 'threatguardSlideIn 0.5s ease-out reverse';
            setTimeout(() => {
                if (popup.parentElement) {
                    popup.remove();
                    console.log("🗑️ Popup auto-removed");
                }
            }, 500);
        }
    }, 5000);
    
    return popup;
}

// Voice alert functionality
let currentSpeech = null;

function playVoiceAlert(analysis) {
    try {
        // Stop any existing speech
        if (currentSpeech) {
            window.speechSynthesis.cancel();
        }

        // Create speech synthesis
        currentSpeech = new SpeechSynthesisUtterance();
        
        // Set voice properties based on risk level
        const riskLevel = analysis?.riskLevel?.toLowerCase() || 'high';
        
        if (riskLevel === 'critical') {
            currentSpeech.text = "Critical threat! Malicious website detected! Immediate action required!";
            currentSpeech.rate = 1.1;
            currentSpeech.pitch = 1.2;
            currentSpeech.volume = 1.0;
        } else if (riskLevel === 'high') {
            currentSpeech.text = "Warning! High risk malicious website detected! Please be careful!";
            currentSpeech.rate = 1.0;
            currentSpeech.pitch = 1.1;
            currentSpeech.volume = 0.9;
        } else {
            currentSpeech.text = "Suspicious website detected! Exercise caution!";
            currentSpeech.rate = 0.9;
            currentSpeech.pitch = 1.0;
            currentSpeech.volume = 0.8;
        }
        
        // Set voice to a female voice if available
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') || 
            voice.name.includes('Karen') ||
            voice.name.includes('Google US English Female')
        );
        
        if (femaleVoice) {
            currentSpeech.voice = femaleVoice;
        }
        
        // Add event listeners
        currentSpeech.onstart = () => {
            console.log("🔊 Voice alert started playing");
        };
        
        currentSpeech.onend = () => {
            console.log("🔊 Voice alert finished");
            currentSpeech = null;
        };
        
        currentSpeech.onerror = (event) => {
            console.error("❌ Voice alert error:", event);
            currentSpeech = null;
        };
        
        // Play the voice alert
        window.speechSynthesis.speak(currentSpeech);
        console.log("🔊 Voice alert initiated for risk level:", riskLevel);
        
    } catch (error) {
        console.error("❌ Error playing voice alert:", error);
        // Fallback: try a simple beep
        playBeep();
    }
}

function stopVoiceAlert() {
    try {
        if (currentSpeech) {
            window.speechSynthesis.cancel();
            currentSpeech = null;
            console.log("🔊 Voice alert stopped");
        }
    } catch (error) {
        console.error("❌ Error stopping voice alert:", error);
    }
}

function playBeep() {
    try {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800; // 800 Hz beep
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        
        console.log("🔊 Beep sound played as fallback");
    } catch (error) {
        console.error("❌ Could not play beep sound:", error);
    }
}

// Helper function to truncate URLs
function truncateURL(url, maxLength) {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}

// Enhanced message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("📨 Message received in content script:", request);
    console.log("📨 Sender info:", sender);
    console.log("📍 Current page URL:", window.location.href);
    
    if (request.action === "threatAlert") {
        console.log("🚨 THREAT ALERT DETECTED!");
        console.log("🔗 Malicious URL:", request.url);
        console.log("📊 Analysis:", request.analysis);
        
        try {
            const popup = createThreatPopup(request.url, request.analysis || {});
            sendResponse({ 
                status: "popup_created", 
                popupId: popup.id,
                timestamp: Date.now()
            });
            console.log("✅ Response sent to background script");
        } catch (error) {
            console.error("❌ Error creating popup:", error);
            sendResponse({ 
                status: "popup_error", 
                error: error.message 
            });
        }
    } else {
        console.log("❓ Unknown message action:", request.action);
        sendResponse({ status: "unknown_action" });
    }
    
    return true; // Keep message channel open
});

// Initialize when page is ready
function initializePopupScript() {
    console.log("🚀 Initializing ThreatGuard Popup Script");
    console.log("📍 Page URL:", window.location.href);
    console.log("📄 Page ready state:", document.readyState);
    
    // NO automatic test popup - only show when real threats are detected
    // NO manual test button - cleaner interface
    console.log("✅ ThreatGuard Popup Script Ready - Waiting for real threats");
    
    console.log("✅ ThreatGuard Popup Script Fully Initialized");
}

// Start initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePopupScript);
} else {
    initializePopupScript();
}

console.log("✅ ThreatGuard Popup Script Loaded");
