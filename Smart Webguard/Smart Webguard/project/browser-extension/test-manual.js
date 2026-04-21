// MANUAL TEST - Check if Extension is Working
console.log("🧪 MANUAL TEST START");

// Test 1: Check Chrome APIs
function testChromeAPIs() {
    console.log("🔍 Test 1: Chrome APIs");
    
    if (typeof chrome !== 'undefined') {
        console.log("✅ Chrome API available");
        
        if (chrome.runtime) {
            console.log("✅ Chrome runtime available");
        } else {
            console.log("❌ Chrome runtime NOT available");
        }
        
        if (chrome.tabs) {
            console.log("✅ Chrome tabs available");
        } else {
            console.log("❌ Chrome tabs NOT available");
        }
        
    } else {
        console.log("❌ Chrome API NOT available");
    }
}

// Test 2: Check Extension Context
function testExtensionContext() {
    console.log("🔍 Test 2: Extension Context");
    
    try {
        if (chrome.runtime.id) {
            console.log("✅ Extension ID:", chrome.runtime.id);
        } else {
            console.log("❌ No extension ID");
        }
    } catch (error) {
        console.log("❌ Extension context error:", error);
    }
}

// Test 3: Manual Popup
function testManualPopup() {
    console.log("🔍 Test 3: Manual Popup");
    
    const popup = document.createElement('div');
    popup.id = 'manual-test-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50px;
        right: 50px;
        background: blue;
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 999999;
        font-family: system-ui;
        font-size: 16px;
    `;
    popup.innerHTML = `
        <div>🧪 MANUAL TEST POPUP</div>
        <div>If you see this, JavaScript is working!</div>
        <button onclick="this.parentElement.remove()" style="margin-top: 10px; background: white; color: blue; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Remove</button>
    `;
    
    document.body.appendChild(popup);
    console.log("✅ Manual popup created");
    
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
            console.log("🗑️ Manual popup removed");
        }
    }, 5000);
}

// Test 4: Check Current URL
function testCurrentURL() {
    console.log("🔍 Test 4: Current URL");
    console.log("📍 Current URL:", window.location.href);
    
    const isThreat = window.location.href.includes('test-phishing') || 
                    window.location.href.includes('malicious-test') ||
                    window.location.href.includes('fake-site');
    
    console.log("🔍 Is threat URL:", isThreat);
}

// Test 5: Try Background Message
function testBackgroundMessage() {
    console.log("🔍 Test 5: Background Message");
    
    try {
        chrome.runtime.sendMessage({
            action: "testMessage",
            timestamp: Date.now(),
            url: window.location.href
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.log("❌ Background message error:", chrome.runtime.lastError);
            } else {
                console.log("✅ Background response:", response);
            }
        });
    } catch (error) {
        console.log("❌ Background message failed:", error);
    }
}

// Run all tests
function runAllTests() {
    console.log("🚀 RUNNING ALL MANUAL TESTS");
    console.log("=" .repeat(50));
    
    testChromeAPIs();
    testExtensionContext();
    testManualPopup();
    testCurrentURL();
    testBackgroundMessage();
    
    console.log("=" .repeat(50));
    console.log("🏁 MANUAL TESTS COMPLETED");
    console.log("📊 Check results above to identify issues");
}

// Auto-run tests
runAllTests();

// Make functions available for manual testing
window.manualTests = {
    runAll: runAllTests,
    testAPIs: testChromeAPIs,
    testContext: testExtensionContext,
    testPopup: testManualPopup,
    testURL: testCurrentURL,
    testMessage: testBackgroundMessage
};

console.log("🧪 MANUAL TEST SCRIPT LOADED");
console.log("💡 Run: window.manualTests.runAll() in console");
