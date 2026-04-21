// Content Script for ThreatGuard Extension - DEBUG VERSION
// Real-time notification system for localhost:5173

(function() {
    'use strict';

    console.log("🛡️ ThreatGuard Debug Content Script Starting...");

    class ThreatGuardContentScript {
        constructor() {
            this.threatThreshold = 70;
            this.init();
        }

        init() {
            console.log("🚀 ThreatGuard Content Script Initialized");
            console.log("📍 Current URL:", window.location.href);
            this.setupMessageListener();
            this.monitorURL();
            
            // Add a test button for manual testing
            this.addTestButton();
        }

        // Add test button to page for debugging
        addTestButton() {
            const testButton = document.createElement('button');
            testButton.innerHTML = '🧪 Test ThreatGuard Popup';
            testButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4f46e5;
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 8px;
                cursor: pointer;
                z-index: 999998;
                font-family: system-ui;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            
            testButton.onclick = () => {
                console.log("🧪 Manual test triggered");
                this.showThreatAlertPopup("http://test-malicious-site.com/verify-account", {
                    score: 85,
                    riskLevel: "high",
                    category: "Phishing"
                });
            };
            
            document.body.appendChild(testButton);
            console.log("🧪 Test button added to page");
        }

        // Listen for messages from background script
        setupMessageListener() {
            console.log("📡 Setting up message listener...");
            
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                console.log("📨 Message received:", request);
                console.log("📨 Sender:", sender);
                
                if (request.action === "threatAlert") {
                    console.log("🚨 ThreatGuard Alert Received:", request);
                    console.log("🔗 URL:", request.url);
                    console.log("📊 Analysis:", request.analysis);
                    
                    // Display visual popup notification
                    this.showThreatAlertPopup(request.url, request.analysis);
                    
                    // Send response to confirm receipt
                    sendResponse({ status: "alert_received", timestamp: Date.now() });
                    console.log("✅ Response sent to background script");
                } else {
                    console.log("❓ Unknown message action:", request.action);
                }
                return true; // Keep message channel open for async response
            });
            
            console.log("✅ Message listener setup complete");
        }

        // Display styled popup notification
        showThreatAlertPopup(url, analysis) {
            console.log("🎨 Creating popup for:", url);
            console.log("📊 Analysis data:", analysis);

            // Remove any existing popups to prevent duplicates
            const existingPopup = document.getElementById('threatguard-alert-popup');
            if (existingPopup) {
                console.log("🗑️ Removing existing popup");
                existingPopup.remove();
            }

            // Create popup container
            const popup = document.createElement('div');
            popup.id = 'threatguard-alert-popup';
            popup.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 350px;
                background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                color: white;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                animation: threatguard-slidein 0.5s ease-out;
                border: 2px solid #b91c1c;
            `;

            // Add animation keyframes
            if (!document.getElementById('threatguard-styles')) {
                const style = document.createElement('style');
                style.id = 'threatguard-styles';
                style.textContent = `
                    @keyframes threatguard-slidein {
                        from {
                            transform: translateX(400px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes threatguard-pulse {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                    }
                `;
                document.head.appendChild(style);
                console.log("🎨 Animation styles added");
            }

            // Popup content
            popup.innerHTML = `
                <div style="padding: 20px;">
                    <!-- Header -->
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; animation: threatguard-pulse 2s infinite;">
                            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                            </svg>
                        </div>
                        <div style="flex: 1;">
                            <h3 style="margin: 0; font-size: 18px; font-weight: 700;">ThreatGuard Security Alert</h3>
                            <p style="margin: 2px 0 0 0; font-size: 12px; opacity: 0.9;">Malicious Website Detected</p>
                        </div>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; opacity: 0.8; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">×</button>
                    </div>

                    <!-- Alert Content -->
                    <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                        <div style="margin-bottom: 12px;">
                            <div style="font-size: 11px; opacity: 0.8; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px;">Malicious URL:</div>
                            <div style="font-size: 13px; font-weight: 600; word-break: break-all; line-height: 1.3;">${this.truncateURL(url, 50)}</div>
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

                    <!-- Action Button -->
                    <div style="text-align: center;">
                        <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255, 255, 255, 0.2); color: white; border: 1px solid rgba(255, 255, 255, 0.3); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.3s ease;">
                            Acknowledge Alert
                        </button>
                    </div>

                    <!-- Footer -->
                    <div style="text-align: center; margin-top: 10px; font-size: 10px; opacity: 0.7;">
                        This page will be blocked in 3 seconds
                    </div>
                </div>
            `;

            // Add to page
            document.body.appendChild(popup);
            console.log("✅ Popup added to page");

            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (popup && popup.parentElement) {
                    console.log("⏰ Auto-removing popup");
                    popup.style.animation = 'threatguard-slidein 0.5s ease-out reverse';
                    setTimeout(() => {
                        if (popup && popup.parentElement) {
                            popup.remove();
                            console.log("✅ Popup removed");
                        }
                    }, 500);
                }
            }, 5000);

            // Log for debugging
            console.log('🎉 ThreatGuard popup displayed for:', url);
        }

        // Helper function to truncate URLs
        truncateURL(url, maxLength) {
            if (url.length <= maxLength) return url;
            return url.substring(0, maxLength) + '...';
        }

        // Monitor URL changes (existing functionality)
        monitorURL() {
            let currentURL = window.location.href;
            console.log("👁️ Starting URL monitoring...");

            setInterval(() => {
                if (window.location.href !== currentURL) {
                    currentURL = window.location.href;
                    console.log("🔄 URL changed to:", currentURL);
                }
            }, 2000);
        }
    }

    // Initialize the content script
    console.log("🚀 Initializing ThreatGuard Content Script...");
    new ThreatGuardContentScript();
    console.log("✅ ThreatGuard Content Script Fully Loaded");
})();
