// Ultra Simple Test Script
console.log("SCRIPT LOADED - TEST 1");

// Test 1: Basic DOM manipulation
try {
    document.body.style.backgroundColor = 'yellow';
    console.log("TEST 1 PASSED: Can modify DOM");
} catch (e) {
    console.error("TEST 1 FAILED:", e);
}

// Test 2: Create element
try {
    const div = document.createElement('div');
    div.innerHTML = 'THREATGUARD TEST';
    div.style.cssText = 'position: fixed; top: 100px; left: 100px; background: red; color: white; padding: 20px; z-index: 999999;';
    document.body.appendChild(div);
    console.log("TEST 2 PASSED: Can create element");
} catch (e) {
    console.error("TEST 2 FAILED:", e);
}

// Test 3: Alert
try {
    alert("THREATGUARD TEST: If you see this, JavaScript is working!");
    console.log("TEST 3 PASSED: Alert works");
} catch (e) {
    console.error("TEST 3 FAILED:", e);
}

// Test 4: Chrome API
try {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        console.log("TEST 4 PASSED: Chrome API available");
        
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log("MESSAGE RECEIVED:", request);
            alert("MESSAGE: " + JSON.stringify(request));
            sendResponse({status: "received"});
            return true;
        });
        
    } else {
        console.error("TEST 4 FAILED: Chrome API not available");
    }
} catch (e) {
    console.error("TEST 4 FAILED:", e);
}

// Test 5: Voice
try {
    if ('speechSynthesis' in window) {
        console.log("TEST 5 PASSED: Speech synthesis available");
        const utterance = new SpeechSynthesisUtterance("ThreatGuard test voice alert");
        utterance.onstart = () => console.log("VOICE STARTED");
        utterance.onend = () => console.log("VOICE ENDED");
        speechSynthesis.speak(utterance);
    } else {
        console.error("TEST 5 FAILED: Speech synthesis not available");
    }
} catch (e) {
    console.error("TEST 5 FAILED:", e);
}

console.log("ALL TESTS COMPLETED - Check results above");
