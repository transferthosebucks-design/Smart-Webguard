# 🔍 Enhanced Features Debug Guide - हिंदी में

## ⚠️ **Problem: Enhanced Features Not Working**

आपने बताया कि 3 नए features काम नहीं कर रहे। मैंने एक **debug system** बनाया है जो step-by-step test करेगा।

---

## 🔧 **Debug Steps:**

### Step 1: **Debug Version Load करें**
```bash
# Debug manifest use करें
cp manifest-debug.json manifest.json
cp background-enhanced.js background.js
cp content-enhanced.js content.js
cp popup-enhanced.html popup.html
cp popup-enhanced.js popup.js
```

### Step 2: **Extension Reload करें**
1. `chrome://extensions/` जाएं
2. ThreatGuard extension reload करें
3. Developer tools open करें (F12)

### Step 3: **Console में Tests Run करें**
```javascript
// Console में यह command run करें:
window.debugEnhancedFeatures.runTests()
```

---

## 🧪 **Test Results देखें:**

### ✅ **Success होगा तो:**
```
🚀 Running Enhanced Features Debug Tests...
✅ Storage write: SUCCESS
✅ Storage read: SUCCESS
✅ Storage cleanup: SUCCESS
✅ Icon update: SUCCESS
✅ Badge update: SUCCESS
✅ Content scanner test: ['verify account', 'bank login', ...]
✅ Message passing test: {status: "received"}
📊 Test Results: {storage: true, icon: true, contentScanner: true, messagePassing: true}
✅ 4/4 tests passed
🎉 All tests passed! Enhanced features should work.
```

### ❌ **Error होगा तो:**
```
❌ Storage test FAILED: Error: Storage permission not granted
❌ Icon test FAILED: Error: Icon file not found
❌ Content scanner test FAILED: Error: Content script not injected
❌ Message passing test FAILED: Error: Background script not responding
📊 Test Results: {storage: false, icon: false, contentScanner: false, messagePassing: false}
❌ 0/4 tests passed
```

---

## 🔍 **Common Issues & Fixes:**

### Issue 1: **Storage Not Working**
**Error:** `Storage permission not granted`
**Fix:**
```json
// manifest.json में check करें:
"permissions": [
  "tabs",
  "activeTab",
  "storage",  // यह होना चाहिए
  "scripting",
  "notifications"
]
```

### Issue 2: **Icon Files Missing**
**Error:** `Icon file not found`
**Fix:**
```bash
# Icons folder बनाएं और files create करें:
mkdir icons
# icon16-green.png, icon48-green.png, icon128-green.png
# icon16-yellow.png, icon48-yellow.png, icon128-yellow.png  
# icon16-red.png, icon48-red.png, icon128-red.png
```

### Issue 3: **Content Script Not Injected**
**Error:** `Content script not injected`
**Fix:**
```json
// manifest.json में check करें:
"content_scripts": [
  {
    "matches": ["<all_urls>"],
    "js": ["debug-enhanced.js", "content-enhanced.js"],
    "run_at": "document_idle"
  }
]
```

### Issue 4: **Background Script Not Responding**
**Error:** `Background script not responding`
**Fix:**
```json
// manifest.json में check करें:
"background": {
  "service_worker": "background-enhanced.js"
}
```

---

## 🚀 **Manual Testing:**

### Test 1: **Storage Test**
```javascript
// Console में run करें:
window.debugEnhancedFeatures.testStorage()
```

### Test 2: **Icon Test**
```javascript
// Console में run करें:
window.debugEnhancedFeatures.testIcon()
// Extension icon green हो जाना चाहिए
```

### Test 3: **Content Scanner Test**
```javascript
// Console में run करें:
window.debugEnhancedFeatures.testContent()
// Keywords detect होने चाहिए
```

### Test 4: **Message Test**
```javascript
// Console में run करें:
window.debugEnhancedFeatures.testMessages()
// Background response आना चाहिए
```

---

## 🔧 **Quick Fix Checklist:**

### ✅ **Check Files:**
- [ ] `manifest.json` - सभी permissions हैं?
- [ ] `background-enhanced.js` - properly loaded?
- [ ] `content-enhanced.js` - injected?
- [ ] `popup-enhanced.html` - popup opens?
- [ ] Icon files - exist करते हैं?

### ✅ **Check Permissions:**
- [ ] `storage` permission
- [ ] `tabs` permission  
- [ ] `scripting` permission
- [ ] `notifications` permission

### ✅ **Check Console:**
- [ ] Background script errors
- [ ] Content script errors
- [ ] Popup errors
- [ ] Network errors

---

## 🎯 **Expected Working Behavior:**

### ✅ **Threat History:**
1. Malicious URL visit करें
2. Popup open करें
3. History में threat show होना चाहिए

### ✅ **Risk Indicator:**
1. Different sites visit करें
2. Extension icon color change होना चाहिए
3. Badge appear होना चाहिए

### ✅ **Content Scanner:**
1. Page with keywords visit करें
2. Console में scan results show होने चाहिए
3. Threat score increase होना चाहिए

---

## 🚨 **अगर अभी भी काम नहीं कर रहा:**

### Step 1: **Complete Debug Report**
```javascript
// Console में run करें और output copy करें:
window.debugEnhancedFeatures.runTests()
```

### Step 2: **Check Extension Details**
1. `chrome://extensions/` जाएं
2. ThreatGuard पर click करें
3. "Inspect views: background page" check करें
4. Console errors note करें

### Step 3: **Test Individual Features**
```javascript
// Individual tests run करें:
window.debugEnhancedFeatures.testStorage()
window.debugEnhancedFeatures.testIcon()
window.debugEnhancedFeatures.testContent()
window.debugEnhancedFeatures.testMessages()
```

---

## 📞 **Debug Report Share करें:**

Console output इस तरह share करें:
```
🔍 DEBUG RESULTS:
Test Results: {storage: false, icon: true, contentScanner: false, messagePassing: true}
Console Errors: [copy all error messages]
Extension Status: [enabled/disabled, permissions]
```

**मैं आपकी debug report देखकर specific issue fix करूंगा!** 🔧✨
