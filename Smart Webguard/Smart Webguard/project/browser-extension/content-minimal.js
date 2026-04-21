// Minimal Content Script for Testing
console.log("🛡️ Minimal ThreatGuard Loading...");

// Simple popup function
function showSimplePopup() {
    console.log("🎨 Creating simple popup...");
    
    // Remove existing popups
    const existing = document.getElementById('simple-popup');
    if (existing) existing.remove();
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'simple-popup';
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
        font-size: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        min-width: 300px;
    `;
    popup.innerHTML = `
        <h3>🚨 THREATGUARD ALERT</h3>
        <p>Malicious website detected!</p>
        <p>Score: 85/100 | Risk: HIGH</p>
        <button onclick="this.parentElement.remove()" style="background: white; color: red; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Close</button>
    `;
    
    document.body.appendChild(popup);
    console.log("✅ Simple popup added");
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.remove();
            console.log("🗑️ Simple popup removed");
        }
    }, 5000);
}

// Simple voice function
function playSimpleVoice() {
    console.log("🔊 Playing simple voice...");
    
    try {
        const utterance = new SpeechSynthesisUtterance("Warning! Malicious website detected!");
        utterance.rate = 1.0;
        utterance.pitch = 1.1;
        utterance.volume = 0.9;
        
        utterance.onstart = () => console.log("🔊 Voice started");
        utterance.onend = () => console.log("🔊 Voice finished");
        utterance.onerror = (e) => console.error("❌ Voice error:", e);
        
        window.speechSynthesis.speak(utterance);
        console.log("✅ Voice command sent");
    } catch (error) {
        console.error("❌ Voice error:", error);
        // Try beep
        try {
            const audio = new AudioContext();
            const osc = audio.createOscillator();
            const gain = audio.createGain();
            osc.connect(gain);
            gain.connect(audio.destination);
            osc.frequency.value = 800;
            osc.start();
            osc.stop(audio.currentTime + 0.1);
            console.log("🔊 Beep played");
        } catch (e) {
            console.error("❌ Beep error:", e);
        }
    }
}

// Test immediately
console.log("🧪 Testing immediately...");
showSimplePopup();
playSimpleVoice();

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("📨 Message received:", request);
    
    if (request.action === "threatAlert") {
        console.log("🚨 Threat detected - showing popup and playing voice");
        showSimplePopup();
        playSimpleVoice();
        sendResponse({ status: "alert_shown" });
    }
    
    return true;
});

// Add manual test button
const testBtn = document.createElement('button');
testBtn.innerHTML = '🧪 TEST ALERT';
testBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #ff4444;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    z-index: 999998;
    font-size: 14px;
`;
testBtn.onclick = () => {
    console.log("🧪 Manual test triggered");
    showSimplePopup();
    playSimpleVoice();
};
document.body.appendChild(testBtn);

console.log("✅ Minimal ThreatGuard Loaded");
