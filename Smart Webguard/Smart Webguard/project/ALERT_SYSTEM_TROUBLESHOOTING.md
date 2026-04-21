# Alert System Troubleshooting Guide

## 🔧 Why Alert System May Not Work

### Common Issues & Solutions

#### 1. **Browser Notifications Not Showing**

**Problem**: Desktop notifications not appearing

**Solutions**:
1. Check browser notification permission:
   - Click the 🔔 icon in browser address bar
   - Ensure notifications are "Allowed"
   - If blocked, change to "Allow" and refresh page

2. Check system settings:
   - **Windows**: Settings → System → Notifications → Allow notifications
   - **Mac**: System Preferences → Notifications → [Your Browser] → Enable
   - **Linux**: System Settings → Notifications → Enable

3. Check in-app settings:
   - Open "Advanced Alert System" section
   - Click Settings icon (⚙️)
   - Ensure "Browser Notifications" is checked ✅

#### 2. **Voice Alerts Not Playing**

**Problem**: No voice warnings heard

**Solutions**:
1. Enable voice alerts:
   - Advanced Alert System → Settings (⚙️)
   - Check "Voice Alerts" (🔊 icon) ✅

2. Check browser audio:
   - Ensure browser tab is not muted
   - Check system volume is on
   - Try clicking "Test Voice" button

3. Browser compatibility:
   - Voice works best in Chrome, Edge, Safari
   - Firefox may have limited voice support
   - Try different browser if issues persist

4. Language support:
   - Hindi voices may not be available on all systems
   - Switch to English if Hindi voice not working
   - Check system TTS (Text-to-Speech) settings

#### 3. **Auto-Block Not Working**

**Problem**: Malicious URLs not being blocked

**Solutions**:
1. Enable auto-blocking:
   - Advanced Alert System → Settings (⚙️)
   - Check "Auto-Block Enabled" (🚫 icon) ✅

2. Check threat level:
   - Auto-block only works for High (65+) and Critical (85+) threats
   - Medium and Low threats show warnings but don't auto-block

3. Check alert threshold:
   - Settings → Alert Threshold slider
   - Set to 70 or lower for balanced protection
   - If set too high (90+), fewer threats will be blocked

#### 4. **No Alerts Appearing**

**Problem**: Analysis completes but no alerts show

**Solutions**:
1. Check alert system is enabled:
   - "Enable Alerts" checkbox must be ✅
   - Status should show "Active" (सक्रिय)

2. Verify threat level meets criteria:
   - Only High and Critical threats trigger alerts by default
   - Check "Critical Only" is unchecked for more alerts

3. Check alert threshold:
   - Current threshold: 70 (default)
   - Lower threshold = more alerts
   - Higher threshold = fewer alerts

4. Test with test buttons:
   - Use "Alert System Test" section
   - Click "Critical Threat" or "High Threat" button
   - Should immediately trigger all alerts

## 🧪 Testing Alert System

### Method 1: Use Test Buttons (RECOMMENDED)

1. Find "Alert System" section on the page
2. Click any threat level button:
   - **Critical Threat** (गंभीर खतरा) - Score 95
   - **High Threat** (उच्च खतरा) - Score 75
   - **Medium Threat** (मध्यम खतरा) - Score 50
   - **Low Threat** (कम खतरा) - Score 20

3. What should happen:
   - ✅ Voice alert speaks threat details
   - ✅ Desktop notification appears
   - ✅ Alert card shows in "Active Alerts"
   - ✅ High/Critical: URL added to blocked list
   - ✅ Sound alert plays
   - ✅ Vibration (on mobile)

### Method 2: Analyze Test URLs

Paste these test URLs to trigger alerts:

**Critical Threat (Score 90+)**:
```
http://phishing-test.malicious.example.com/login?redirect=steal
```

**High Threat (Score 70+)**:
```
http://malware-download.suspicious.site/payload.exe
```

**Medium Threat (Score 40+)**:
```
http://spam.questionable-domain.xyz/offer
```

## ✅ Checklist: Verify Everything is Working

### Step 1: Enable All Features
- [ ] Advanced Alert System → Settings (⚙️)
- [ ] ✅ Enable Alerts
- [ ] ✅ Sound Alerts
- [ ] ✅ Voice Alerts (🔊)
- [ ] ✅ Auto-Block Enabled (🚫)
- [ ] ✅ Browser Notifications
- [ ] ✅ Vibration Alerts
- [ ] Alert Threshold: 70

### Step 2: Grant Permissions
- [ ] Browser notification permission: Allowed
- [ ] System notifications: Enabled
- [ ] Audio playback: Allowed

### Step 3: Test Each Feature

**Test Voice Alerts:**
1. Settings → Voice Alerts → Enable
2. Click any test threat button
3. Listen for voice saying threat details

**Expected**:
- Critical: "गंभीर सुरक्षा खतरा पाया गया!" or "Critical security threat detected!"
- High: "उच्च जोखिम खतरा पाया गया!" or "High risk threat detected!"

**Test Browser Notifications:**
1. Click "Critical Threat" test button
2. Check for desktop notification popup

**Expected**:
- Notification shows threat score
- Shows category (Phishing, Malware, etc.)
- Shows threat indicators
- Shows blocking status

**Test Auto-Blocking:**
1. Click "Critical Threat" or "High Threat" button
2. Check "Blocked Websites" section
3. Click "Show" if hidden

**Expected**:
- Test URL appears in blocked list
- Shows score, category, block reason
- Shows timestamp

**Test Alert Display:**
1. Click any test button
2. Check "Active Alerts" section appears

**Expected**:
- Alert card shows with color coding
- Shows threat details
- Shows time, type, categories
- Can be dismissed with X button

## 🔍 Debug Mode

### Check Console Logs

1. Open browser DevTools (F12)
2. Go to Console tab
3. Click test threat button
4. Look for logs:

```
Enhanced ML Model initialized with Kaggle-style dataset
Voice assistant is active. Your security is our priority.
Notification permission: granted
Alert triggered for threat: test-123456
```

### Check for Errors

If you see errors like:
- `Notification permission denied` → Grant permission
- `Speech synthesis not supported` → Try different browser
- `Audio context blocked` → Click page first to enable audio

## 📱 Mobile-Specific Issues

### Vibration Not Working
- Feature only works on devices with vibration hardware
- Check browser supports Vibration API
- Enable haptic feedback in device settings

### Voice Not Working on Mobile
- Some mobile browsers limit speech synthesis
- Try enabling desktop site mode
- Chrome and Safari have best mobile support

### Notifications Not Showing
- Check app is not in power saving mode
- Ensure browser has notification permission
- Try adding site to home screen (PWA mode)

## 🎯 Expected Behavior Summary

### When You Analyze a High/Critical Threat:

**Immediately (< 1 second):**
1. 🔊 Voice speaks: "गंभीर/उच्च सुरक्षा खतरा पाया गया!"
2. 🔔 Desktop notification appears with details
3. 🔊 Alert sound plays (beep pattern)
4. 📳 Device vibrates (if supported)

**Within 2 seconds:**
5. 🚫 URL added to blocked list (auto-block enabled)
6. 📢 "Active Alert" card appears on screen
7. 🔊 Voice speaks blocking confirmation

**After alert threshold time (5 seconds default):**
8. Alert card auto-hides (if auto-hide enabled)
9. Notification auto-closes
10. Alert moves to history

## 🆘 Still Not Working?

### Quick Fixes:

1. **Hard Refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear Cache**: Browser Settings → Privacy → Clear Browsing Data
3. **Restart Browser**: Close all tabs and reopen
4. **Try Incognito Mode**: Test if extensions are interfering
5. **Update Browser**: Ensure latest version installed

### Browser Compatibility:

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Voice Alerts | ✅ Best | ✅ Best | ✅ Good | ⚠️ Limited |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| Vibration | ✅ | ✅ | ❌ | ❌ |
| Auto-Block | ✅ | ✅ | ✅ | ✅ |

**Recommended**: Chrome or Edge for full feature support

## 💡 Pro Tips

1. **Lower Alert Threshold**: Set to 60-65 for more sensitive detection
2. **Disable Auto-Hide**: Keep alerts visible until manual dismiss
3. **Enable Critical Only**: Reduce alert fatigue for high-security needs
4. **Test Regularly**: Use test buttons to verify system is working
5. **Check Blocked List**: Review blocked sites weekly

---

## 📞 Need More Help?

If alerts still not working after trying all solutions:

1. Check browser console for specific errors
2. Try the test buttons - if they work, real analysis should too
3. Verify threat score is above alert threshold (70 default)
4. Ensure analyzing URLs with `http://` or `https://`
5. Contact Team Wise Coders: bklboys149@gmail.com

---

**Made with ❤️ by Team Wise Coders**
**Your Security, Our Priority** 🛡️
