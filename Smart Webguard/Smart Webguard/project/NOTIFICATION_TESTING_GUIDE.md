# ThreatGuard Notification System Testing Guide

## 🎯 Overview
This guide explains how to test the real-time notification system that sends alerts from the Chrome Extension to your localhost:5173 web application.

## 🔧 Setup Requirements

### Prerequisites
1. **ThreatGuard Web App** running on `http://localhost:5173`
2. **Chrome Extension** loaded and enabled
3. **Developer Tools** open for debugging

### Extension Installation
If not already installed:
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → select `browser-extension` folder
4. Verify ThreatGuard extension appears in toolbar

## 🧪 Testing Scenarios

### Scenario 1: Direct Threat Detection
**Test URLs** (These should trigger the notification system):

#### High-Risk Test URLs
```
http://test-phishing-site.com/verify-account
https://suspicious.xyz/banking-login
http://192.168.1.1/malware-download
https://fake-security.net/alert
https://bitcoin-investment.biz/guaranteed-profit
```

#### Expected Behavior:
1. **Chrome Extension** detects threat (score ≥ 70)
2. **Visual Popup** appears on localhost:5173 web app
3. **Chrome Notification** appears in system tray
4. **3-second delay** before redirect to warning page
5. **Popup auto-closes** after 5 seconds

### Scenario 2: Cross-Tab Communication
**Test Steps**:
1. Open localhost:5173 web app in one tab
2. Open malicious test URL in another tab
3. Verify popup appears on localhost:5173 tab

### Scenario 3: Multiple Alerts
**Test Steps**:
1. Visit multiple malicious URLs quickly
2. Verify multiple popups appear (stacked)
3. Each popup shows correct threat information

## 🔍 Debugging Steps

### 1. Check Extension Background Script
1. Go to `chrome://extensions/`
2. Find ThreatGuard extension
3. Click "Inspect views: background page"
4. Check console for messages:
   ```
   "Malicious site detected: [URL]"
   "Threat alert message sent to content script"
   "Threat alert sent to localhost:5173 tab: [TAB_ID]"
   ```

### 2. Check Content Script
1. On localhost:5173 page, open Developer Tools (F12)
2. Check console for messages:
   ```
   "ThreatGuard Content Script Loaded"
   "ThreatGuard Alert Received: [OBJECT]"
   "ThreatGuard popup displayed for: [URL]"
   ```

### 3. Verify Popup Elements
1. Right-click on the popup → Inspect Element
2. Verify element structure:
   ```html
   <div id="threatguard-alert-popup" style="position: fixed; top: 20px; right: 20px;">
     <!-- Popup content -->
   </div>
   ```

## 🚨 Troubleshooting

### Issue 1: Popup Not Appearing
**Possible Causes**:
- Content script not loaded
- Message not received
- CSS z-index conflict

**Solutions**:
1. Check content script console logs
2. Verify localhost:5173 is running
3. Check for CSS conflicts
4. Reload the extension

### Issue 2: Message Not Received
**Possible Causes**:
- Tab not found
- Content script not injected
- Permission issues

**Solutions**:
1. Refresh localhost:5173 page
2. Check extension permissions
3. Verify content script matches
4. Check background script logs

### Issue 3: Popup Styling Issues
**Possible Causes**:
- CSS conflicts with web app
- Z-index too low
- Positioning conflicts

**Solutions**:
1. Increase z-index to 9999999
2. Check for conflicting CSS
3. Verify popup position
4. Test on clean page

### Issue 4: No Chrome Notification
**Possible Causes**:
- Notification permission denied
- Icon missing
- API error

**Solutions**:
1. Check Chrome notification permissions
2. Verify icon files exist
3. Check background script console
4. Test with simple notification

## 📊 Expected Popup Design

### Visual Elements
- **Position**: Top-right corner (20px from edges)
- **Width**: 380px
- **Background**: Red gradient (#dc2626 to #b91c1c)
- **Animation**: Slide-in from right, auto-close after 5 seconds

### Content Structure
```
🚨 ThreatGuard Security Alert
├── Warning icon with pulse animation
├── Malicious Website Detected subtitle
├── Close button (×)
├── Alert Details Box:
│   ├── Detected URL (truncated)
│   ├── Threat Score: XX/100
│   ├── Risk Level: HIGH/MEDIUM/CRITICAL
│   └── Category: Phishing/Malware/etc.
├── Acknowledge Alert button
└── "This page will be blocked in 3 seconds" footer
```

## 🔧 Manual Testing Commands

### Test with Console
You can manually trigger the notification system:

1. **On localhost:5173 page**, open console and run:
```javascript
// Simulate threat alert
chrome.runtime.sendMessage({
  action: "threatAlert",
  url: "http://test-malicious-site.com",
  analysis: {
    score: 85,
    riskLevel: "high",
    category: "Phishing"
  }
});
```

2. **In background script console**, run:
```javascript
// Send message to localhost tab
chrome.tabs.query({url: "*://localhost:5173/*"}).then(tabs => {
  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, {
      action: "threatAlert",
      url: "http://test-malicious-site.com",
      analysis: {
        score: 85,
        riskLevel: "high",
        category: "Phishing"
      }
    });
  });
});
```

## 📱 Performance Testing

### Test Multiple Scenarios
1. **Rapid URL Changes**: Visit multiple malicious URLs quickly
2. **Multiple Tabs**: Test with several localhost tabs open
3. **Long Sessions**: Test popup behavior over extended periods
4. **Memory Usage**: Monitor for memory leaks

### Performance Metrics
- **Popup Display Time**: Should appear within 100ms
- **Animation Smoothness**: 60fps animations
- **Memory Impact**: Minimal memory usage increase
- **CPU Usage**: Low CPU overhead

## 🎯 Success Criteria

### ✅ Working Correctly When:
- [ ] Popup appears within 100ms of threat detection
- [ ] Popup displays correct threat information
- [ ] Popup auto-closes after 5 seconds
- [ ] Manual close button works
- [ ] Multiple popups stack properly
- [ ] Chrome notification also appears
- [ ] Page redirects to warning page after 3 seconds
- [ ] Console logs show proper message flow

### ❌ Issues to Fix:
- [ ] Popup doesn't appear
- [ ] Wrong threat information displayed
- [ ] Popup doesn't auto-close
- [ ] Styling conflicts with web app
- [ ] No console logs for debugging
- [ ] Chrome notification missing
- [ ] Page doesn't redirect properly

## 🔄 Testing Workflow

### Before Each Test:
1. Clear browser cache
2. Reload extension
3. Refresh localhost:5173
4. Open Developer Tools
5. Clear console logs

### During Test:
1. Visit malicious test URL
2. Observe popup appearance
3. Check console logs
4. Verify threat information
5. Test manual close
6. Wait for auto-close
7. Verify redirect timing

### After Each Test:
1. Document results
2. Note any issues
3. Check performance impact
4. Verify no errors in console

## 📝 Test Report Template

```
Test Date: [DATE]
Test URL: [MALICIOUS_URL]
Expected Score: [EXPECTED_SCORE]
Actual Score: [ACTUAL_SCORE]

Popup Appearance: ✅/❌ (Time: [MS])
Popup Content: ✅/❌ (Correct: [YES/NO])
Auto-Close: ✅/❌ (Time: [SECONDS])
Chrome Notification: ✅/❌
Page Redirect: ✅/❌ (Time: [SECONDS])

Console Logs:
[BACKGROUND]: [LOGS]
[CONTENT]: [LOGS]

Issues Found:
[LIST ANY ISSUES]

Performance Impact:
[CPU/MEMORY USAGE]
```

---

## 🚀 Ready to Test!

Once you've completed the setup, follow this testing sequence:

1. **Basic Test**: Visit one malicious URL
2. **Cross-Tab Test**: Test localhost communication
3. **Multiple Test**: Test several URLs quickly
4. **Edge Cases**: Test boundary conditions
5. **Performance Test**: Monitor resource usage

The notification system should now provide real-time visual alerts on your localhost:5173 web application whenever malicious websites are detected! 🛡️
