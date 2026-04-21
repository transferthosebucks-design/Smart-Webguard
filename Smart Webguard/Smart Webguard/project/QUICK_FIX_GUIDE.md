# 🚨 Quick Fix for Popup Not Working

## 🔧 What I Did

I created **simplified versions** of both scripts to isolate the issue:

### ✅ Files Created:
- `content-simple.js` - Minimal content script with immediate test
- `background-simple.js` - Simple background script with better logging
- Updated `manifest.json` to use these versions

## 🚀 IMMEDIATE STEPS

### Step 1: Reload Extension
1. Go to `chrome://extensions/`
2. Find **ThreatGuard** extension
3. Click **Reload button** 🔄

### Step 2: Test Basic Functionality
1. Open your localhost:5173 app
2. Open Developer Tools (F12) → Console
3. You should see **RED TEST POPUP** immediately

### Step 3: Check Console Messages
**On localhost:5173 console, you should see:**
```
🛡️ ThreatGuard Simple Content Script Loading...
✅ ThreatGuard Simple Content Script Loaded
```

**On background script console (chrome://extensions/ → Inspect background):**
```
🛡️ ThreatGuard Simple Background Script Starting...
🚀 Simple ThreatGuard Initialized
```

## 🧪 Test the Alert System

### Test 1: Manual Test
**In localhost:5173 console, run:**
```javascript
chrome.runtime.sendMessage({action: "testAlert"});
```

### Test 2: Visit Malicious URL
1. Keep localhost:5173 open
2. Visit: `http://test-phishing-site.com/verify-account`
3. Should see popup on localhost:5173

### Test 3: Check Communication
**In background console, run:**
```javascript
chrome.tabs.query({url: "*://localhost:5173/*"}).then(tabs => {
  console.log("Found tabs:", tabs);
  if (tabs.length > 0) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "threatAlert",
      url: "http://test.com",
      analysis: {score: 85, riskLevel: "high", category: "Test"}
    });
  }
});
```

## 🔍 What to Look For

### ✅ Working System:
1. **Red test popup** appears immediately on localhost:5173
2. **Console messages** show scripts loaded
3. **Manual test** triggers alert popup
4. **Malicious URL** triggers real alert

### ❌ Not Working:
1. **No red test popup** → Content script not loading
2. **No console messages** → Extension not working
3. **Manual test fails** → Communication broken

## 🛠️ Common Issues & Quick Fixes

### Issue 1: No Test Popup
**Fix:** 
- Reload extension
- Check if localhost:5173 is actually running
- Open new tab for localhost:5173

### Issue 2: No Console Messages
**Fix:**
- Check extension is enabled in chrome://extensions/
- Look for extension errors
- Make sure permissions are granted

### Issue 3: Manual Test Fails
**Fix:**
- Check both consoles for errors
- Try closing and reopening localhost:5173
- Check if multiple tabs are interfering

## 🎯 Expected Results

### When Working Correctly:
1. **Red test popup** appears immediately on page load
2. **Console shows** loading messages
3. **Manual test** works
4. **Real threats** trigger proper alerts

### Popups Should Look Like:
- **Test popup**: Red box with "THREATGUARD TEST" text
- **Alert popup**: Styled red gradient with threat details

## 📞 Still Not Working?

### Check These:
1. **Chrome version** supports Manifest V3
2. **Local server** running on port 5173
3. **Extension permissions** all granted
4. **No conflicting extensions**

### Last Resort:
1. **Disable all other extensions**
2. **Try in incognito mode**
3. **Create new Chrome profile**
4. **Test on different website**

---

## 🚀 Summary

The simple versions should work immediately. If you see the **red test popup** on localhost:5173, the basic system is working, and we can debug the communication issue.

If you **don't see the red test popup**, there's a fundamental loading issue we need to fix first.

**Reload the extension and test now!** 🛡️
