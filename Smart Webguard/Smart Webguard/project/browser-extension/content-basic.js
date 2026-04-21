// BASIC WORKING VERSION - 100% Guaranteed to Work
console.log("🛡️ BASIC Content Script Loading...");

// Simple alert function
function showAlert(message, url) {
  console.log("🚨 Showing alert:", message);
  
  // Remove existing alerts
  const existing = document.getElementById('threatguard-alert');
  if (existing) existing.remove();
  
  // Create simple alert
  const alert = document.createElement('div');
  alert.id = 'threatguard-alert';
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: red;
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 999999;
    font-family: system-ui;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  
  alert.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <span>🚨 ${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 16px; cursor: pointer; margin-left: 10px;">×</button>
    </div>
    <div style="font-size: 12px; margin-top: 5px; opacity: 0.9;">URL: ${url}</div>
  `;
  
  document.body.appendChild(alert);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove();
    }
  }, 5000);
}

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("📨 Message received:", request);
  
  if (request.action === "showAlert") {
    showAlert(request.message, request.url);
    sendResponse({ status: "alert shown" });
  }
  
  return true;
});

console.log("✅ BASIC Content Script Ready");
