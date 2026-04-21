# 🚨 Troubleshooting Guide - Popup & Voice Not Working

## 🔧 I've Created a Minimal Version for Testing

I've simplified the code to identify the issue. The new version has:
- **Basic red popup** (no complex CSS)
- **Simple voice alert** (no complex voice selection)
- **Immediate test** when page loads
- **Manual test button** for debugging

## 🚀 Step-by-Step Troubleshooting

### Step 1: Reload Extension
1. Go to `chrome://extensions/`
2. Find **ThreatGuard** extension
3. Click **Reload button** 🔄

### Step 2: Open localhost:5173
1. Start your React app: `npm run dev`
2. Open `http://localhost:5173`
3. Open Developer Tools (F12) → Console

### Step 3: Check What Happens

#### ✅ **Working Correctly Should Show:**
```
🛡️ Minimal ThreatGuard Loading...
🧪 Testing immediately...
🎨 Creating simple popup...
✅ Simple popup added
🔊 Playing simple voice...
✅ Voice command sent
🔊 Voice started
🔊 Voice finished
✅ Minimal ThreatGuard Loaded
```

AND you should see:
- **Red popup** appear immediately
- **Voice alert** play immediately
- **"🧪 TEST ALERT" button** at bottom-right

#### ❌ **If Nothing Happens:**
Check for these console messages:
- **No console output at all** → Content script not loading
- **"🛡️ Minimal ThreatGuard Loading..." only** → Script loading but failing
- **Voice errors** → Browser doesn't support speech synthesis

## 🔍 Common Issues & Solutions

### Issue 1: No Console Output
**Problem**: Content script not loading
**Solutions**:
1. **Reload extension** again
2. **Check manifest.json** syntax
3. **Verify extension permissions**
4. **Open new tab** for localhost:5173

### Issue 2: Console Shows Loading But No Popup
**Problem**: Script loading but popup creation failing
**Solutions**:
1. **Check CSS conflicts** in your React app
2. **Try on different page** (like about:blank)
3. **Check for JavaScript errors**
4. **Verify document.body exists**

### Issue 3: Voice Not Working
**Problem**: Speech synthesis not supported or blocked
**Solutions**:
1. **Check browser compatibility**
2. **Try different browser** (Chrome works best)
3. **Check audio permissions**
4. **Look for voice errors in console**

### Issue 4: Popup Not Visible
**Problem**: Popup created but not visible
**Solutions**:
1. **Check z-index** (should be 999999)
2. **Check position** (fixed, top: 50px, right: 50px)
3. **Check for overflow: hidden** on parent elements
4. **Try simpler CSS**

## 🧪 Manual Testing

### Test 1: Manual Button
1. Look for **"🧪 TEST ALERT"** button at bottom-right
2. Click it
3. Should see red popup and hear voice

### Test 2: Console Commands
**In localhost:5173 console:**
```javascript
// Test popup directly
showSimplePopup();

// Test voice directly
playSimpleVoice();

// Test message system
chrome.runtime.sendMessage({
  action: "threatAlert",
  url: "http://test.com",
  analysis: {score: 85, riskLevel: "high"}
});
```

### Test 3: Real Threat Detection
1. Keep localhost:5173 open
2. Visit: `http://test-phishing-site.com/verify-account`
3. Should see popup and hear voice on localhost:5173

## 🔧 Debugging Steps

### Step 1: Check Extension Loading
1. `chrome://extensions/` → ThreatGuard extension
2. Look for **"Inspect views: background page"**
3. Check background console for errors

### Step 2: Check Content Script
1. On localhost:5173 page
2. F12 → Console
3. Look for loading messages
4. Check for JavaScript errors

### Step 3: Check Permissions
1. `chrome://extensions/` → ThreatGuard
2. Click **"Details"**
3. Verify **"Allow on all sites"** is enabled
4. Check **"Site access"** permissions

### Step 4: Test on Clean Page
1. Open `about:blank` in new tab
2. Check if popup appears there
3. If yes → CSS conflict in your React app
4. If no → Extension issue

## 📊 Expected Results with Minimal Version

### ✅ **Should Work Immediately:**
1. **Page loads** → Console shows loading messages
2. **Red popup** appears automatically
3. **Voice alert** plays automatically
4. **Test button** appears at bottom-right
5. **Manual test** works when clicked

### ✅ **Real Threat Detection:**
1. **Visit malicious URL** → Background detects threat
2. **Popup appears** on localhost:5173
3. **Voice alert** plays on localhost:5173
4. **Website blocked** after 3 seconds

## 🚨 If Still Not Working

### Last Resort Fixes:
1. **Disable all other extensions**
2. **Try in incognito mode**
3. **Create new Chrome profile**
4. **Test on different computer**
5. **Check Chrome version** (needs Manifest V3 support)

### Advanced Debugging:
```javascript
// Check if content script is running
console.log("Content script active:", typeof showSimplePopup !== 'undefined');

// Check DOM ready state
console.log("DOM ready:", document.readyState);
console.log("Body exists:", !!document.body);

// Check speech synthesis support
console.log("Speech support:", 'speechSynthesis' in window);
console.log("Available voices:", speechSynthesis.getVoices().length);
```

---

## 🎯 Success Criteria

✅ **Minimal version working when:**
- Console shows loading messages
- Red popup appears immediately
- Voice alert plays immediately
- Test button works when clicked
- Real threat detection triggers alerts

## 🚀 Ready to Test!

**Reload the extension** and open `http://localhost:5173`. The minimal version should:
- Show a red popup immediately
- Play a voice alert immediately  
- Have a "🧪 TEST ALERT" button
- Provide detailed console logging

This will help us identify exactly what's not working! 🛡️
