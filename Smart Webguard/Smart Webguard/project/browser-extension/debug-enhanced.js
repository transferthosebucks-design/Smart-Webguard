// Debug Enhanced Features - Step by Step Testing
console.log("🔍 DEBUG: Enhanced Features Test Starting...");

// Test 1: Check Chrome Storage
async function testChromeStorage() {
    console.log("🧪 Test 1: Chrome Storage");
    try {
        // Test saving data
        await chrome.storage.local.set({ testKey: "testValue" });
        console.log("✅ Storage write: SUCCESS");
        
        // Test reading data
        const result = await chrome.storage.local.get(['testKey']);
        console.log("✅ Storage read:", result);
        
        // Clean up
        await chrome.storage.local.remove(['testKey']);
        console.log("✅ Storage cleanup: SUCCESS");
        
        return true;
    } catch (error) {
        console.error("❌ Storage test FAILED:", error);
        return false;
    }
}

// Test 2: Check Icon Update
async function testIconUpdate() {
    console.log("🧪 Test 2: Icon Update");
    try {
        const testIcon = {
            '16': 'icons/icon16-green.png',
            '48': 'icons/icon48-green.png',
            '128': 'icons/icon128-green.png'
        };
        
        await chrome.action.setIcon({ path: testIcon });
        console.log("✅ Icon update: SUCCESS");
        
        await chrome.action.setBadgeText({ text: "TEST" });
        console.log("✅ Badge update: SUCCESS");
        
        // Reset
        await chrome.action.setBadgeText({ text: "" });
        
        return true;
    } catch (error) {
        console.error("❌ Icon test FAILED:", error);
        return false;
    }
}

// Test 3: Check Content Scanner
function testContentScanner() {
    console.log("🧪 Test 3: Content Scanner");
    try {
        // Add test content to page
        const testDiv = document.createElement('div');
        testDiv.id = 'test-content-scanner';
        testDiv.innerHTML = 'verify account bank login reset password crypto profit';
        testDiv.style.display = 'none';
        document.body.appendChild(testDiv);
        
        // Test keyword detection
        const keywords = ['verify account', 'bank login', 'reset password', 'crypto profit'];
        const pageText = document.body.innerText.toLowerCase();
        
        let foundKeywords = [];
        keywords.forEach(keyword => {
            if (pageText.includes(keyword.toLowerCase())) {
                foundKeywords.push(keyword);
            }
        });
        
        console.log("✅ Content scanner test:", foundKeywords);
        
        // Clean up
        testDiv.remove();
        
        return foundKeywords.length > 0;
    } catch (error) {
        console.error("❌ Content scanner test FAILED:", error);
        return false;
    }
}

// Test 4: Check Message Passing
async function testMessagePassing() {
    console.log("🧪 Test 4: Message Passing");
    try {
        // Test sending message to background
        const response = await chrome.runtime.sendMessage({
            action: "testMessage",
            timestamp: Date.now()
        });
        
        console.log("✅ Message passing test:", response);
        return true;
    } catch (error) {
        console.error("❌ Message passing test FAILED:", error);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log("🚀 Running Enhanced Features Debug Tests...");
    
    const results = {
        storage: await testChromeStorage(),
        icon: await testIconUpdate(),
        contentScanner: testContentScanner(),
        messagePassing: await testMessagePassing()
    };
    
    console.log("📊 Test Results:", results);
    
    const successCount = Object.values(results).filter(Boolean).length;
    console.log(`✅ ${successCount}/4 tests passed`);
    
    if (successCount < 4) {
        console.log("❌ Some tests failed - checking issues...");
        
        if (!results.storage) {
            console.log("🔧 Fix: Check storage permissions in manifest");
        }
        
        if (!results.icon) {
            console.log("🔧 Fix: Check icon files and action permissions");
        }
        
        if (!results.contentScanner) {
            console.log("🔧 Fix: Check content script injection");
        }
        
        if (!results.messagePassing) {
            console.log("🔧 Fix: Check background script and message listeners");
        }
    } else {
        console.log("🎉 All tests passed! Enhanced features should work.");
    }
    
    return results;
}

// Auto-run tests
runAllTests();

// Manual test functions for console
window.debugEnhancedFeatures = {
    runTests: runAllTests,
    testStorage: testChromeStorage,
    testIcon: testIconUpdate,
    testContent: testContentScanner,
    testMessages: testMessagePassing
};

console.log("🔍 DEBUG: Enhanced Features Debug Script Loaded");
console.log("💡 Run: window.debugEnhancedFeatures.runTests() in console");
