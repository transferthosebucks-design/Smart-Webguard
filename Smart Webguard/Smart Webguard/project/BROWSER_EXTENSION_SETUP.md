# ThreatGuard Browser Extension Setup Guide

## Overview
This guide explains how to set up and use the ThreatGuard Chrome Extension for real-time malicious website detection and blocking.

## 🚀 Quick Start

### 1. Install the Extension
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right corner)
4. Click "Load unpacked"
5. Select the `browser-extension` folder from your project directory
6. The ThreatGuard extension will appear in your extensions list

### 2. Start Protection
1. Click the ThreatGuard icon in your browser toolbar
2. Verify the protection status shows "Active"
3. Browse the web normally - the extension will monitor URLs automatically

## 📋 Installation Steps

### Prerequisites
- Google Chrome browser (version 88+)
- ThreatGuard project files downloaded
- Access to the `browser-extension` folder

### Detailed Installation

#### Step 1: Locate Extension Files
Navigate to your project directory:
```
project-bolt-sb1-zufvmgir (17)/project/browser-extension/
```

#### Step 2: Open Chrome Extensions Page
1. Open Chrome
2. Type `chrome://extensions/` in the address bar
3. Press Enter

#### Step 3: Enable Developer Mode
1. Look for the "Developer mode" toggle in the top right
2. Click to enable it
3. Additional options will appear below

#### Step 4: Load the Extension
1. Click the "Load unpacked" button
2. A file dialog will open
3. Navigate to and select the `browser-extension` folder
4. Click "Select Folder"

#### Step 5: Verify Installation
The ThreatGuard extension should now appear:
- In your extensions list
- As a shield icon in your browser toolbar
- With "This can read and change site data" permission

## 🔧 Configuration

### Extension Popup
Click the ThreatGuard icon (🛡️) in your toolbar to access:
- **Protection Status**: Shows if monitoring is active
- **Current URL**: Displays the page you're currently visiting
- **Statistics**: Number of blocked URLs and threat threshold
- **Actions**: Analyze current URL, view blocked URLs, clear blocks

### Threat Threshold
The extension blocks URLs with threat scores **≥ 70**:
- **70-84**: High Risk - Blocked
- **85-100**: Critical - Blocked immediately
- **0-69**: Safe - Allowed through

## 🛡️ How It Works

### Real-time Monitoring
1. **Tab Monitoring**: Extension watches for URL changes in all tabs
2. **URL Analysis**: Each new URL is analyzed using ML detection patterns
3. **Threat Scoring**: URLs receive a score from 0-100 based on risk factors
4. **Automatic Blocking**: High-risk URLs are blocked automatically

### Detection Patterns
The extension analyzes URLs for:
- **Phishing Patterns**: Account verification, suspension notices
- **Malware Indicators**: Fake antivirus, software downloads
- **Suspicious TLDs**: .xyz, .top, .info, .click, .loan, etc.
- **Protocol Issues**: HTTP (non-HTTPS), IP addresses
- **Structure Problems**: Unusually long URLs, encoding issues

### Blocking Process
1. URL exceeds threat threshold (≥70)
2. URL added to persistent block list
3. Tab redirected to warning page
4. User sees threat details and options
5. User can go back or proceed with caution

## 🚨 Warning Page Features

When a URL is blocked, users see:
- **Threat Details**: Risk level, score, category
- **Indicators**: Specific reasons for blocking
- **Options**: Go back, ignore warning, report false positive
- **Security Info**: Detection time and protection status

## 📊 Management Features

### View Blocked URLs
1. Click extension icon
2. Click "📋 View Blocked URLs"
3. See list of all blocked websites
4. Unblock individual URLs if needed

### Clear All Blocks
1. Click extension icon
2. Click "🗑️ Clear All Blocked URLs"
3. Confirm action
4. All URLs removed from block list

### Manual Analysis
1. Navigate to any website
2. Click extension icon
3. Click "🔍 Analyze Current URL"
4. See immediate threat analysis results

## 🔍 Testing the Extension

### Test URLs (Safe for Testing)
Try these URLs to test the extension:

#### High-Risk Test URLs
```
http://test-phishing-site.com/verify-account
https://suspicious.xyz/banking-login
http://192.168.1.1/malware-download
https://fake-security.net/alert
```

#### Safe URLs (Should Not Be Blocked)
```
https://google.com
https://github.com
https://stackoverflow.com
https://mozilla.org
```

### Expected Behavior
1. **High-Risk URLs**: Should be redirected to warning page
2. **Safe URLs**: Should load normally
3. **Extension Popup**: Should show updated statistics
4. **Notifications**: Should appear for blocked URLs

## 🔧 Troubleshooting

### Common Issues

#### Extension Not Loading
**Problem**: Extension doesn't appear after "Load unpacked"
**Solution**:
1. Check if `browser-extension` folder contains all required files
2. Verify `manifest.json` has valid JSON syntax
3. Check Chrome console for error messages
4. Try reloading the extension

#### URLs Not Being Blocked
**Problem**: Extension shows as active but doesn't block threats
**Solution**:
1. Check if threat threshold is set correctly (default: 70)
2. Verify background script is running
3. Test with known high-risk URLs
4. Check extension permissions

#### Warning Page Not Showing
**Problem**: URLs are blocked but warning page doesn't appear
**Solution**:
1. Verify `warning.html` exists in extension folder
2. Check `web_accessible_resources` in manifest.json
3. Ensure file paths are correct
4. Reload the extension

#### Popup Not Working
**Problem**: Clicking extension icon doesn't open popup
**Solution**:
1. Check `popup.html` exists and has valid HTML
2. Verify JavaScript is working (check console)
3. Ensure no syntax errors in popup script
4. Reload the extension

### Debug Mode
To enable debug logging:
1. Go to `chrome://extensions/`
2. Find ThreatGuard extension
3. Click "Inspect views: background page"
4. Console will show detailed logs and errors

### Performance Issues
If the extension slows down browsing:
1. Check analysis cache (should reduce redundant checks)
2. Verify threat threshold isn't too low
3. Clear blocked URLs list if very large
4. Reload the extension

## 🔄 Integration with Main App

### When Running on ThreatGuard App
If you visit your local ThreatGuard application:
- Extension connects to existing ML detection functions
- Uses full advanced detection capabilities
- Integrates with app's real-time monitor
- Shares data between extension and web app

### When on Other Websites
Extension uses built-in simplified detection:
- Basic pattern matching
- Common threat indicators
- Fast analysis for performance
- Still provides effective protection

## 📱 Permissions Explained

The extension requests these permissions:

### Required Permissions
- **`tabs`**: Monitor tab URL changes
- **`activeTab`**: Analyze current page content
- **`storage`**: Save blocked URLs and settings
- **`scripting`**: Inject content scripts for analysis
- **`notifications`**: Show threat alerts
- **`<all_urls>`**: Monitor all websites for protection

### Why These Permissions
- **Security**: Need to check all URLs you visit
- **Functionality**: Required for real-time monitoring
- **Privacy**: No personal data collected or transmitted
- **Performance**: Local storage for fast operation

## 🔒 Privacy & Security

### Data Protection
- **No Tracking**: Extension doesn't track your browsing history
- **Local Storage**: All data stored locally on your device
- **No Telemetry**: No data sent to external servers
- **Privacy First**: Designed with user privacy as priority

### Security Features
- **Content Security Policy**: Strict security rules
- **Sanitized Inputs**: All user inputs properly sanitized
- **Secure Updates**: Manual update process prevents hijacking
- **Open Source**: Code can be audited for security

## 📈 Advanced Usage

### Custom Threat Threshold
To adjust the threat threshold:
1. Open `background.js` in extension folder
2. Find `this.threatThreshold = 70;`
3. Change the value (0-100)
4. Reload the extension

### Adding Custom Patterns
To add custom detection patterns:
1. Open `background.js`
2. Find `suspiciousPatterns` array
3. Add new regex patterns
4. Reload the extension

### Export/Import Blocked URLs
Currently not supported, but you can:
- View blocked URLs in extension popup
- Manually copy list for backup
- Clear and rebuild as needed

## 🆘 Getting Help

### Support Resources
1. **README.md**: Technical documentation
2. **Console Logs**: Debug information
3. **GitHub Issues**: Report problems
4. **Community Forum**: User discussions

### Reporting Issues
When reporting issues, include:
- Chrome version
- Extension version
- Steps to reproduce
- Console error messages
- Expected vs actual behavior

### Feature Requests
We welcome suggestions for:
- New detection patterns
- UI improvements
- Performance optimizations
- Additional features

## 📝 Development Notes

### File Structure
```
browser-extension/
├── manifest.json          # Extension configuration
├── background.js          # Main service worker
├── content.js            # Page integration script
├── popup.html            # Extension popup interface
├── warning.html          # Blocked URL warning page
├── icons/                # Extension icons (placeholder)
└── README.md             # Technical documentation
```

### Key Components
- **Background Script**: Core monitoring and analysis
- **Content Script**: Bridge to web pages
- **Popup**: User interface and controls
- **Warning Page**: Blocked URL information
- **Manifest**: Permissions and configuration

### Integration Points
- **ML Detection**: Uses existing patterns from main app
- **URL Blocker**: Integrates with app's blocking system
- **Alert System**: Connects to app's notification system
- **Storage**: Shares data with web application when possible

---

## 🎯 Next Steps

After installation:
1. **Test with sample URLs** to verify functionality
2. **Adjust settings** if needed (threshold, patterns)
3. **Monitor performance** and user experience
4. **Provide feedback** for improvements

The ThreatGuard extension is now ready to protect you from malicious websites while you browse! 🛡️
