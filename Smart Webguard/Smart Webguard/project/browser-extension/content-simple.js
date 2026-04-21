// Simple Content Script for ThreatGuard Extension
// Minimal version to test basic functionality

console.log("🛡️ ThreatGuard Simple Content Script Loading...");

// Test popup immediately when script loads
function testPopup() {
    console.log("🧪 Creating test popup...");
    
    // Remove any existing popups
    const existing = document.getElementById('test-popup');
    if (existing) existing.remove();
    
    // Create simple test popup
    const popup = document.createElement('div');
    popup.id = 'test-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50px;
        right: 50px;
        background: red;
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 999999;
        font-family: Arial;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;
    popup.innerHTML = `
        <h3>🚨 THREATGUARD TEST</h3>
        <p>If you see this, the content script works!</p>
        <button onclick="this.parentElement.remove()" style="background: white; color: red; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Close</button>
    `;
    
    document.body.appendChild(popup);
    console.log("✅ Test popup added to page");
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
            console.log("🗑️ Test popup removed");
        }
    }, 3000);
}

// Test immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', testPopup);
} else {
    testPopup();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("📨 Message received:", request);
    
    if (request.action === "threatAlert") {
        console.log("🚨 Threat alert detected!");
        
        // Remove existing alert popup
        const existingAlert = document.getElementById('threatguard-alert');
        if (existingAlert) existingAlert.remove();
        
        // Create alert popup
        const alertPopup = document.createElement('div');
        alertPopup.id = 'threatguard-alert';
        alertPopup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: linear-gradient(135deg, #dc2626, #ef4444);
            color: white;
            padding: 20px;
            border-radius: 12px;
            z-index: 999999;
            font-family: Arial, sans-serif;
            box-shadow: 0 10px 25px rgba(0,0,0,0.4);
            border: 2px solid #b91c1c;
        `;
        
        alertPopup.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 30px; height: 30px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 10px;">⚠️</div>
                <div>
                    <h3 style="margin: 0; font-size: 16px; font-weight: bold;">ThreatGuard Alert</h3>
                    <p style="margin: 0; font-size: 12px; opacity: 0.9;">Malicious Website Detected</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                <div style="font-size: 11px; margin-bottom: 5px;">URL: ${request.url || 'Unknown'}</div>
                <div style="font-size: 11px;">Score: ${request.analysis?.score || 'N/A'}/100 | Risk: ${request.analysis?.riskLevel || 'HIGH'}</div>
            </div>
            <div style="text-align: center;">
                <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 12px;">OK</button>
            </div>
        `;
        
        document.body.appendChild(alertPopup);
        console.log("✅ Alert popup created");
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertPopup.parentElement) {
                alertPopup.remove();
                console.log("🗑️ Alert popup removed");
            }
        }, 5000);
        
        sendResponse({ status: "alert_received" });
    }
    
    return true;
});

console.log("✅ ThreatGuard Simple Content Script Loaded");
