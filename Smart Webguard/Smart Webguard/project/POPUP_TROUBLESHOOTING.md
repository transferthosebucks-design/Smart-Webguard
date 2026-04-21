# ThreatGuard Popup Not Working - Troubleshooting Guide

## 🚨 Issue: Notification Popup Not Working

Let's systematically troubleshoot why the popup is not appearing.

## 🔧 Step 1: Use Debug Version

### Replace content script with debug version:
1. **Temporarily update manifest.json** to use debug version:
```json
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["content-debug.js"],
    "run_at": "document_start"
  }
]
```

2. **Reload the extension** in `chrome://extensions/`

## 🔍 Step 2: Check Console Logs

### On localhost:5173 page:
1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for these messages:
```
🛡️ ThreatGuard Debug Content Script Starting...
🚀 ThreatGuard Content Script Initialized
📍 Current URL: http://localhost:5173/...
📡 Setting up message listener...
✅ Message listener setup complete
🧪 Test button added to page
✅ ThreatGuard Content Script Fully Loaded
```

### If you don't see these messages:
- **Content script not loading** → Check manifest.json
- **Extension not enabled** → Check chrome://extensions/
- **Permissions issue** → Check extension permissions

## 🧪 Step 3: Manual Test

### Click the test button:
1. Look for **"🧪 Test ThreatGuard Popup"** button at bottom-right
2. Click it to manually trigger popup
3. Check console for:
```
🧪 Manual test triggered
🎨 Creating popup for: http://test-malicious-site.com/verify-account
📊 Analysis data: {score: 85, riskLevel: "high", category: "Phishing"}
✅ Popup added to page
🎉 ThreatGuard popup displayed for: http://test-malicious-site.com/verify-account
```

### If manual test works:
- Content script is working
- Issue is with background script communication

### If manual test doesn't work:
- Content script has issues
- CSS/styling problems
- JavaScript errors

## 🔍 Step 4: Check Background Script

### In Chrome Extension Background Page:
1. Go to `chrome://extensions/`
2. Find ThreatGuard extension
3. Click "Inspect views: background page"
4. Go to Console tab
5. Look for:
```
Malicious site detected: [URL]
Threat alert message sent to content script
Threat alert sent to localhost:5173 tab: [TAB_ID]
```

### Test background script manually:
```javascript
// Send test message to localhost:5173
chrome.tabs.query({url: "*://localhost:5173/*"}).then(tabs => {
  console.log("Found localhost tabs:", tabs);
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, {
      action: "threatAlert",
      url: "http://test-malicious-site.com",
      analysis: {
        score: 85,
        riskLevel: "high",
        category: "Phishing"
      },
      timestamp: Date.now()
    }).then(response => {
      console.log("Response from content script:", response);
    }).catch(error => {
      console.error("Error sending message:", error);
    });
  });
});
```

## 🐛 Common Issues & Solutions

### Issue 1: Content Script Not Loading
**Symptoms**: No console messages from content script
**Causes**:
- Manifest.json content_scripts section incorrect
- Extension not properly loaded
- Permissions missing

**Solutions**:
1. Verify manifest.json content_scripts section
2. Reload extension: `chrome://extensions/` → Reload button
3. Check extension is enabled

### Issue 2: Message Not Received
**Symptoms**: Background script sends but content script doesn't receive
**Causes**:
- Tab not ready when message sent
- Content script not injected
- Chrome API error

**Solutions**:
1. Add delay in background script before sending
2. Check content script is loaded on target tab
3. Look for Chrome API errors in console

### Issue 3: Popup Not Visible
**Symptoms**: Message received but popup not visible
**Causes**:
- CSS z-index too low
- Popup positioned off-screen
- CSS conflicts with web app

**Solutions**:
1. Increase z-index to 9999999
2. Check popup position in CSS
3. Test on clean page (about:blank)

### Issue 4: localhost:5173 Not Found
**Symptoms**: Background script can't find localhost tab
**Causes**:
- localhost:5173 not running
- Tab URL doesn't match exactly
- Multiple tabs confused

**Solutions**:
1. Ensure localhost:5173 is running
2. Check exact URL format in browser
3. Use broader URL matching pattern

## 🔧 Quick Fixes

### Fix 1: Update Background Script Timing
Add delay before sending message:
```javascript
// In background.js handleThreatDetected function
setTimeout(async () => {
  await this.sendAlertToLocalhost(url, analysis);
}, 1000); // Wait 1 second for content script to load
```

### Fix 2: Improve URL Matching
Update localhost detection:
```javascript
// In background.js sendAlertToLocalhost function
for (const tab of tabs) {
  if (tab.url && (tab.url.includes('localhost:5173') || tab.url.includes('127.0.0.1:5173'))) {
    // Send message
  }
}
```

### Fix 3: Add Error Handling
Improve message sending:
```javascript
// In background.js
try {
  await chrome.tabs.sendMessage(tab.id, message);
  console.log("✅ Message sent successfully");
} catch (error) {
  console.error("❌ Failed to send message:", error);
  // Try again after delay
  setTimeout(() => {
    chrome.tabs.sendMessage(tab.id, message);
  }, 2000);
}
```

## 🧪 Complete Test Sequence

### Step 1: Basic Test
1. Load debug version of content script
2. Open localhost:5173
3. Click test button
4. Verify popup appears

### Step 2: Communication Test
1. Keep localhost:5173 open
2. Open malicious test URL in new tab
3. Check background script console
4. Check content script console

### Step 3: Integration Test
1. Reload original content script
2. Test with real malicious URL
3. Verify complete flow

## 📊 Expected Console Output

### Working System Should Show:
```
// Content Script Console (localhost:5173)
🛡️ ThreatGuard Debug Content Script Starting...
🚀 ThreatGuard Content Script Initialized
📍 Current URL: http://localhost:5173/
📡 Setting up message listener...
✅ Message listener setup complete
🧪 Test button added to page
✅ ThreatGuard Content Script Fully Loaded

// When threat detected
📨 Message received: {action: "threatAlert", ...}
🚨 ThreatGuard Alert Received: {...}
🎨 Creating popup for: http://malicious-site.com
✅ Popup added to page
🎉 ThreatGuard popup displayed

// Background Script Console
Malicious site detected: http://malicious-site.com
Threat alert message sent to content script
Threat alert sent to localhost:5173 tab: 123
```

## 🆘 Still Not Working?

### Check These:
1. **Extension Permissions**: Make sure all permissions are granted
2. **Chrome Version**: Ensure Chrome supports Manifest V3
3. **Local Server**: Verify localhost:5173 is accessible
4. **Firewall/Antivirus**: Check if blocking extension
5. **Other Extensions**: Disable conflicting extensions

### Last Resort:
1. Create a minimal test extension
2. Test basic message passing
3. Gradually add complexity
4. Isolate the specific issue

---

## 🎯 Next Steps

1. **Use debug version** first
2. **Check console logs** thoroughly
3. **Test manually** with test button
4. **Verify background script** communication
5. **Apply fixes** based on findings

The debug version should help identify exactly where the issue is occurring! 🛡️
