# 🔍 Step-by-Step Debug - हिंदी में

## ⚠️ **Problem: Extension Not Working**

आपका extension काम नहीं कर रहा। मैंने **complete debug system** बनाया है जो बताएगा कि problem क्या है।

---

## 🚀 **Debug Installation:**

### Step 1: **Test Version Load करें**
```bash
# Test files use करें
cp manifest-test.json manifest.json
cp background-basic.js background.js
cp content-basic.js content.js
```

### Step 2: **Extension Reload करें**
1. `chrome://extensions/` जाएं
2. ThreatGuard extension reload करें (🔄)
3. कोई errors check करें

---

## 🧪 **Debug Testing:**

### Step 3: **Console में Tests Run करें**
किसी भी webpage पर जाएं और console (F12) open करें:

```javascript
// Automatic tests run हो जाएंगे page load पर
// Manual भी run कर सकते हैं:

window.manualTests.runAll()
```

---

## 📊 **Test Results Analysis:**

### ✅ **Perfect Working होगा तो:**
```
🧪 MANUAL TEST START
🚀 RUNNING ALL MANUAL TESTS
==================================================
🔍 Test 1: Chrome APIs
✅ Chrome API available
✅ Chrome runtime available
✅ Chrome tabs available

🔍 Test 2: Extension Context
✅ Extension ID: abcdef123456

🔍 Test 3: Manual Popup
✅ Manual popup created
[BLUE popup should appear on page]

🔍 Test 4: Current URL
📍 Current URL: https://google.com
🔍 Is threat URL: false

🔍 Test 5: Background Message
✅ Background response: {status: "received"}
==================================================
🏁 MANUAL TESTS COMPLETED
📊 Check results above to identify issues
```

### ❌ **Problems Identify होंगे:**

#### Problem A: **Chrome API Not Available**
```
❌ Chrome API NOT available
❌ Chrome runtime NOT available
❌ Chrome tabs NOT available
```
**Fix:** Extension properly loaded नहीं है
- `chrome://extensions/` में extension enable करें
- Extension reload करें
- Chrome restart करें

#### Problem B: **Extension Context Missing**
```
✅ Chrome API available
❌ No extension ID
❌ Extension context error
```
**Fix:** Content script injection problem
- Manifest.json check करें
- Content script matches check करें
- Page refresh करें

#### Problem C: **Background Not Responding**
```
✅ Chrome APIs working
✅ Extension context working
❌ Background message error: Could not establish connection
```
**Fix:** Background script problem
- Background script check करें
- Service worker errors check करें
- Extension reload करें

#### Problem D: **JavaScript Not Working**
```
❌ Manual popup not created
❌ JavaScript errors in console
```
**Fix:** Page JavaScript problem
- Browser JavaScript enable करें
- Console errors check करें
- Different page try करें

---

## 🔧 **Specific Fix Guide:**

### Fix 1: **Extension Loading Issues**
```bash
# Complete fresh install
1. chrome://extensions/ → Remove ThreatGuard
2. Browser restart करें
3. Load unpacked → browser-extension folder
4. Enable extension
5. Reload extension
```

### Fix 2: **Manifest Issues**
```json
// Check manifest.json syntax:
{
  "manifest_version": 3,  // Must be 3
  "permissions": ["tabs", "activeTab"],  // Basic permissions
  "background": {
    "service_worker": "background-basic.js"  // File must exist
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],  // Correct pattern
      "js": ["test-manual.js", "content-basic.js"],  // Files must exist
      "run_at": "document_idle"
    }
  ]
}
```

### Fix 3: **File Issues**
```bash
# Check files exist:
ls -la browser-extension/
# Should see:
# manifest-test.json
# background-basic.js  
# content-basic.js
# test-manual.js
# warning.html (if exists)
```

---

## 🎯 **Success Checklist:**

### ✅ **Working When:**
- [ ] Extension shows in `chrome://extensions/`
- [ ] Extension is enabled (toggle ON)
- [ ] No errors in extension details
- [ ] Console shows "🧪 MANUAL TEST START"
- [ ] Blue popup appears automatically
- [ ] All tests show ✅ status
- [ ] Background message gets response

### ❌ **Not Working When:**
- [ ] Extension not listed in `chrome://extensions/`
- [ ] Extension disabled (toggle OFF)
- [ ] Red errors in extension details
- [ ] No console messages
- [ ] Manual popup doesn't appear
- [ ] Tests show ❌ status

---

## 📞 **Debug Report Format:**

Console output copy करके मुझे इस तरह share करें:

```
🔍 DEBUG REPORT:
Extension Status: [enabled/disabled, errors]
Console Output: [copy all test results]
Manual Popup: [appeared/not appeared]
Background Message: [success/error]
Page Tested: [URL where you tested]
```

---

## 🚨 **Final Troubleshooting:**

### Last Resort Options:
1. **Different Browser Try करें** (Microsoft Edge)
2. **New Chrome Profile** create करें
3. **Chrome Update** करें (Manifest V3 support)
4. **Windows Restart** करें
5. **Different Computer** पर try करें

**मुझे आपकी debug report भेजें, मैं exact problem identify करके fix करूंगा!** 🔧✨
