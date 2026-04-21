# ThreatGuard Chrome Extension

## Overview
ThreatGuard is a real-time malicious website detection and blocking Chrome extension that integrates with the existing Cyber Phoenix detection system. It provides continuous protection while browsing the web by analyzing URLs and blocking malicious websites automatically.

## Features

### 🔍 Real-time URL Monitoring
- Continuously monitors tab URL changes
- Analyzes URLs using advanced ML detection patterns
- Caches analysis results for optimal performance

### 🛡️ Automatic Threat Blocking
- Blocks websites with threat scores > 70
- Redirects users to a secure warning page
- Maintains a persistent block list

### 🚨 Smart Alert System
- Browser notifications for detected threats
- Detailed threat analysis and indicators
- Risk level classification (Critical, High, Medium, Low)

### 📊 Protection Statistics
- Track number of blocked URLs
- Monitor protection status
- View threat detection history

### ⚙️ Management Controls
- View and manage blocked URLs
- Unblock specific URLs if needed
- Clear all blocked URLs
- Adjust threat threshold

## Installation

### Development Installation
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `browser-extension` folder from the project directory
5. The extension will be loaded and active

### Production Installation
1. Build the extension package
2. Upload to Chrome Web Store
3. Users can install from the Web Store

## Files Structure

```
browser-extension/
├── manifest.json          # Extension configuration and permissions
├── background.js          # Service worker for tab monitoring and analysis
├── content.js            # Content script for page integration
├── popup.html            # Extension popup interface
├── warning.html          # Warning page for blocked URLs
├── icons/                # Extension icons
└── README.md             # This documentation
```

## How It Works

### 1. Tab Monitoring
- Background script monitors `chrome.tabs.onUpdated` events
- Detects URL changes in real-time
- Skips chrome:// and extension pages

### 2. URL Analysis
- Uses existing ML detection patterns from the main application
- Analyzes for suspicious patterns, TLDs, protocols, and structures
- Calculates threat scores (0-100)

### 3. Threat Classification
- **Critical (85-100)**: Immediate blocking required
- **High (70-84)**: Automatic blocking
- **Medium (40-69)**: Warning only
- **Low (0-39)**: Safe to proceed

### 4. Blocking Mechanism
- URLs exceeding threshold are added to block list
- Tab is redirected to warning page
- User can choose to go back or proceed (with warning)

### 5. Storage & Persistence
- Blocked URLs stored in Chrome storage
- Analysis cache for performance optimization
- Settings and statistics persisted

## Integration with Main Application

### Content Script Bridge
The content script (`content.js`) serves as a bridge between the extension and the main ThreatGuard application:

1. **On ThreatGuard App Pages**: Connects to existing ML detection functions
2. **On Other Pages**: Injects simplified ML detection logic
3. **Communication**: Uses message passing for data exchange

### ML Detection Patterns
The extension uses the same detection patterns as the main application:

- **Phishing Patterns**: Account verification, suspension notices
- **Malware Patterns**: Fake antivirus, software downloads
- **Spam Patterns**: Get-rich-quick schemes, fake lotteries
- **Suspicious TLDs**: .xyz, .top, .info, .click, .loan, etc.
- **Protocol Analysis**: HTTP vs HTTPS, IP addresses, URL length

## User Interface

### Extension Popup
- Protection status indicator
- Current URL display
- Quick analysis button
- Blocked URLs management
- Protection statistics

### Warning Page
- Detailed threat information
- Risk score visualization
- Threat indicators list
- Action options (Go Back, Ignore, Report)

### Browser Notifications
- Real-time threat alerts
- Risk level indicators
- Quick action buttons

## Security Features

### Content Security Policy
- Strict CSP for extension pages
- Sanitized user inputs
- Secure script execution

### Permission Model
- Minimal required permissions
- `<all_urls>` for comprehensive protection
- Storage for persistence
- Notifications for alerts

### Data Protection
- No personal data collection
- Local storage only
- No telemetry or analytics
- Privacy-first approach

## Performance Optimization

### Caching Strategy
- Analysis results cached for 5 minutes
- Reduces redundant computations
- Improves user experience

### Efficient Monitoring
- Event-driven architecture
- Minimal resource usage
- Background processing

## Troubleshooting

### Common Issues

1. **Extension not loading**
   - Check manifest.json syntax
   - Ensure all files are present
   - Verify Chrome version compatibility

2. **URLs not being blocked**
   - Check if threat threshold is appropriate
   - Verify background script is running
   - Check Chrome extension permissions

3. **Warning page not showing**
   - Verify warning.html exists
   - Check web_accessible_resources in manifest
   - Ensure proper file paths

4. **Popup not working**
   - Check popup.html syntax
   - Verify JavaScript is working
   - Check for console errors

### Debug Mode
Enable console logging:
1. Open `chrome://extensions/`
2. Find ThreatGuard extension
3. Click "Inspect views: background page"
4. Check console for errors and logs

## Development

### Building the Extension
1. Make changes to files
2. Go to `chrome://extensions/`
3. Click "Reload" button for ThreatGuard
4. Test changes immediately

### Testing
1. Visit suspicious test URLs:
   - `http://test-phishing-site.com`
   - `https://suspicious.xyz/verify-account`
   - `http://192.168.1.1/malware`

2. Verify:
   - Extension detects threats
   - Warning page appears
   - URLs are blocked correctly
   - Statistics update properly

## Future Enhancements

### Planned Features
- [ ] Machine learning model integration
- [ ] Community threat sharing
- [ ] Custom whitelist/blacklist
- [ ] Advanced reporting dashboard
- [ ] Multi-language support
- [ ] Enterprise management console

### Technical Improvements
- [ ] WebAssembly ML models
- [ ] Real-time threat feeds
- [ ] Behavioral analysis
- [ ] Domain reputation scoring
- [ ] Certificate validation

## Support

For issues, questions, or contributions:
1. Check the troubleshooting section
2. Review console logs
3. Report issues with detailed information
4. Include steps to reproduce

## License

This extension is part of the ThreatGuard project and follows the same licensing terms.

---

**Note**: This extension is designed to work with the ThreatGuard web application. While it can function independently, full integration provides the best protection and user experience.
