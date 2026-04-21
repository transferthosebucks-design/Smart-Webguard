# 🚨 Notification Popup Testing Guide

## 🎯 Goal: Get Notification Popups Working on localhost:5173

I've created a **popup-focused content script** that should reliably show notifications.

## 🔧 What's New

### ✅ **Enhanced Popup System**
- **Better CSS styling** with `!important` declarations
- **Detailed logging** for debugging
- **Manual test button** for instant testing
- **Auto test popup** on page load
- **Copy URL functionality**
- **Visual feedback** for all actions

### ✅ **Key Features**
- **Immediate test popup** when page loads
- **Test button** at bottom-right for manual testing
- **Enhanced error handling**
- **Popup visibility verification**

## 🚀 IMMEDIATE TESTING

### Step 1: Reload Extension
1. Go to `chrome://extensions/`
2. Find **ThreatGuard** extension
3. Click **Reload button** 🔄

### Step 2: Open localhost:5173
1. Start your React app: `npm run dev`
2. Open `http://localhost:5173`
3. Open Developer Tools (F12) → Console

### Step 3: Look for Initial Test Popup
**You should see a popup appear automatically after 1 second** with:
- Title: "🚨 ThreatGuard Security Alert"
- Test URL: "http://initial-test-site.com"
- Score: 75/100
- Risk Level: HIGH

### Step 4: Check Console Messages
**On localhost:5173 console, you should see:**
```
🛡️ ThreatGuard Popup Script Loading...
🚀 Initializing ThreatGuard Popup Script
📍 Page URL: http://localhost:5173/
📄 Page ready state: interactive
🧪 Test button added to page
🧪 Creating initial test popup...
🎨 Creating threat popup for: http://initial-test-site.com
📊 Analysis data: {score: 75, riskLevel: "high", category: "Initial Test"}
✅ Popup successfully added to page
📍 Popup element: <div id="threatguard-notification-...">
📏 Popup dimensions: DOMRect {x: ..., y: ..., width: 350, height: ...}
✅ Popup is visible and positioned correctly
✅ ThreatGuard Popup Script Fully Initialized
✅ ThreatGuard Popup Script Loaded
```

### Step 5: Manual Test
1. Look for **"🧪 Test ThreatGuard Popup"** button at bottom-right
2. Click it
3. Should see another popup with different threat data

## 🧪 Testing Real Threat Detection

### Test 1: Manual Message
**In localhost:5173 console, run:**
```javascript
chrome.runtime.sendMessage({
  action: "threatAlert",
  url: "http://test-malicious-site.com/verify-account",
  analysis: {
    score: 92,
    riskLevel: "critical",
    category: "Phishing Attack"
  }
});
```

### Test 2: Visit Malicious URL
1. Keep localhost:5173 open
2. Visit: `http://test-phishing-site.com/verify-account`
3. Should see popup on localhost:5173
4. Check background script console for logs

## 🔍 Troubleshooting

### Issue: No Initial Test Popup
**Check:**
- Extension reloaded properly
- Console shows loading messages
- No CSS conflicts on page
- Page is fully loaded

### Issue: Popup Not Visible
**Check console for:**
```
✅ Popup successfully added to page
📏 Popup dimensions: DOMRect {width: 350, height: ...}
✅ Popup is visible and positioned correctly
```

**If you see:**
```
❌ Popup not visible - check CSS conflicts
```
**Then:** Check if your React app has CSS that interferes

### Issue: Manual Test Doesn't Work
**Check:**
- Test button is visible at bottom-right
- Clicking button shows console message
- No JavaScript errors in console

## 📊 Expected Popup Appearance

### Working Popup Should Have:
- **Position**: Top-right corner (20px from edges)
- **Size**: 350px width
- **Colors**: Red gradient background
- **Content**:
  - 🚨 ThreatGuard Security Alert header
  - Malicious URL (truncated)
  - Threat Score: XX/100
  - Risk Level: HIGH/MEDIUM/CRITICAL
  - Category: Phishing/Malware/etc.
  - Acknowledge and Copy URL buttons
  - "This page will be blocked in 3 seconds" footer

## 🎯 Success Indicators

✅ **Working correctly when:**
1. **Initial test popup** appears automatically after page load
2. **Test button** is visible at bottom-right
3. **Manual test button** creates new popup
4. **Console shows detailed success messages**
5. **Real threat detection** creates popups
6. **Popups auto-close after 5 seconds**

## 🚨 Debug Commands

### Check Popup Function Directly
**In localhost:5173 console:**
```javascript
// Test popup creation directly
window.testThreatGuardPopup();
```

### Check Extension Communication
**In localhost:5173 console:**
```javascript
// Test message to background
chrome.runtime.sendMessage({action: "test"});
```

### Force Popup Creation
**In localhost:5173 console:**
```javascript
// Create popup with custom data
const popup = createThreatPopup("http://forced-test.com", {
  score: 88,
  riskLevel: "high", 
  category: "Forced Test"
});
```

## 🔧 If Still Not Working

### Quick Fixes:
1. **Hard refresh** localhost:5173 (Ctrl+F5)
2. **Reload extension** again
3. **Check for CSS conflicts** in your React app
4. **Try in incognito mode**
5. **Disable other extensions**

### Advanced Debugging:
1. **Check computed styles** of popup element
2. **Verify z-index** is high enough
3. **Check for position: fixed** support
4. **Look for overflow: hidden** on parent elements

---

## 🚀 Ready to Test!

**Reload the extension** and open `http://localhost:5173`. You should see:

1. ✅ **Initial test popup** after 1 second
2. ✅ **Test button** at bottom-right
3. ✅ **Detailed console logs**
4. ✅ **Working popup styling**

The enhanced popup system should work reliably! 🛡️
