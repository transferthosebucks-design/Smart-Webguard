// Hindi Language Translation System for Indian Users
export interface Translation {
  en: string;
  hi: string;
}

export const translations: Record<string, Translation> = {
  // Main Interface
  'ThreatGuard ML': { en: 'Cyber Phoenix', hi: 'साइबर फीनिक्स' },
  'AI-Powered Threat Detection': { en: 'AI-Powered Threat Detection', hi: 'एआई-संचालित खतरा पहचान' },
  'Team Scout': { en: 'Team Wise Coders', hi: 'टीम वाइज कोडर्स' },
  
  // Analysis Interface
  'Content Analysis': { en: 'Content Analysis', hi: 'सामग्री विश्लेषण' },
  'Analyze Content': { en: 'Analyze Content', hi: 'सामग्री का विश्लेषण करें' },
  'Analyzing...': { en: 'Analyzing...', hi: 'विश्लेषण कर रहे हैं...' },
  'Analysis Results': { en: 'Analysis Results', hi: 'विश्लेषण परिणाम' },
  'Export Report': { en: 'Export Report', hi: 'रिपोर्ट निर्यात करें' },
  
  // Content Types
  'URL': { en: 'URL', hi: 'यूआरएल' },
  'Text Content': { en: 'Text Content', hi: 'पाठ सामग्री' },
  'Domain': { en: 'Domain', hi: 'डोमेन' },
  'File Hash': { en: 'File Hash', hi: 'फ़ाइल हैश' },
  
  // Risk Levels
  'Critical Risk': { en: 'Critical Risk', hi: 'गंभीर जोखिम' },
  'High Risk': { en: 'High Risk', hi: 'उच्च जोखिम' },
  'Medium Risk': { en: 'Medium Risk', hi: 'मध्यम जोखिम' },
  'Low Risk': { en: 'Low Risk', hi: 'कम जोखिम' },
  'Risk Score': { en: 'Risk Score', hi: 'जोखिम स्कोर' },
  
  // Threat Categories
  'Phishing': { en: 'Phishing', hi: 'फिशिंग' },
  'Malware': { en: 'Malware', hi: 'मैलवेयर' },
  'Spam': { en: 'Spam', hi: 'स्पैम' },
  'Safe': { en: 'Safe', hi: 'सुरक्षित' },
  'Threat Categories': { en: 'Threat Categories', hi: 'खतरा श्रेणियां' },
  'Threat Indicators': { en: 'Threat Indicators', hi: 'खतरा संकेतक' },
  
  // Real-time Monitoring
  'Real-Time Monitoring': { en: 'Real-Time Monitoring', hi: 'रीयल-टाइम निगरानी' },
  'Start Monitoring': { en: 'Start Monitoring', hi: 'निगरानी शुरू करें' },
  'Stop Monitoring': { en: 'Stop Monitoring', hi: 'निगरानी बंद करें' },
  'Actively monitoring browsing activity': { en: 'Actively monitoring browsing activity', hi: 'ब्राउज़िंग गतिविधि की सक्रिय निगरानी' },
  'Monitoring disabled': { en: 'Monitoring disabled', hi: 'निगरानी अक्षम' },
  'URLs Scanned': { en: 'URLs Scanned', hi: 'स्कैन किए गए यूआरएल' },
  'Threats Blocked': { en: 'Threats Blocked', hi: 'अवरुद्ध खतरे' },
  'Active Time': { en: 'Active Time', hi: 'सक्रिय समय' },
  'Last Threat': { en: 'Last Threat', hi: 'अंतिम खतरा' },
  'Currently Scanning:': { en: 'Currently Scanning:', hi: 'वर्तमान में स्कैन कर रहे हैं:' },
  
  // Alert System
  'Alert System': { en: 'Alert System', hi: 'अलर्ट सिस्टम' },
  'Enable Alerts': { en: 'Enable Alerts', hi: 'अलर्ट सक्षम करें' },
  'Sound Alerts': { en: 'Sound Alerts', hi: 'ध्वनि अलर्ट' },
  'Critical Only': { en: 'Critical Only', hi: 'केवल गंभीर' },
  'Browser Notifications': { en: 'Browser Notifications', hi: 'ब्राउज़र सूचनाएं' },
  'Auto-hide alerts': { en: 'Auto-hide alerts', hi: 'अलर्ट स्वतः छुपाएं' },
  'Alerts Active': { en: 'Alerts Active', hi: 'अलर्ट सक्रिय' },
  'Alerts Disabled': { en: 'Alerts Disabled', hi: 'अलर्ट अक्षम' },
  'Threat Detected': { en: 'Threat Detected', hi: 'खतरा पाया गया' },
  'Critical Alerts': { en: 'Critical Alerts', hi: 'गंभीर अलर्ट' },
  'High Risk Alerts': { en: 'High Risk Alerts', hi: 'उच्च जोखिम अलर्ट' },
  'Active Alerts': { en: 'Active Alerts', hi: 'सक्रिय अलर्ट' },
  
  // Threat Classification
  'Advanced Threat Classification': { en: 'Advanced Threat Classification', hi: 'उन्नत खतरा वर्गीकरण' },
  'Classification': { en: 'Classification', hi: 'वर्गीकरण' },
  'Attack Techniques': { en: 'Attack Techniques', hi: 'हमला तकनीकें' },
  'Mitigation': { en: 'Mitigation', hi: 'शमन' },
  'Primary Threat Vector': { en: 'Primary Threat Vector', hi: 'प्राथमिक खतरा वेक्टर' },
  'Attack Sophistication': { en: 'Attack Sophistication', hi: 'हमला परिष्कार' },
  'Target Audience': { en: 'Target Audience', hi: 'लक्षित दर्शक' },
  'Delivery Method': { en: 'Delivery Method', hi: 'वितरण विधि' },
  
  // Visualization
  'Threat Analytics': { en: 'Threat Analytics', hi: 'खतरा विश्लेषण' },
  'Threat Visualization': { en: 'Threat Visualization', hi: 'खतरा दृश्यीकरण' },
  'Live Analytics': { en: 'Live Analytics', hi: 'लाइव विश्लेषण' },
  'Overview': { en: 'Overview', hi: 'अवलोकन' },
  'Trends': { en: 'Trends', hi: 'रुझान' },
  'Categories': { en: 'Categories', hi: 'श्रेणियां' },
  'Timeline': { en: 'Timeline', hi: 'समयरेखा' },
  'Risk Level Distribution': { en: 'Risk Level Distribution', hi: 'जोखिम स्तर वितरण' },
  'Real-Time Metrics': { en: 'Real-Time Metrics', hi: 'रीयल-टाइम मेट्रिक्स' },
  'Detection Rate': { en: 'Detection Rate', hi: 'पहचान दर' },
  'Response Time': { en: 'Response Time', hi: 'प्रतिक्रिया समय' },
  'False Positives': { en: 'False Positives', hi: 'गलत सकारात्मक' },
  
  // Statistics
  'Total Scans': { en: 'Total Scans', hi: 'कुल स्कैन' },
  'Threats Detected': { en: 'Threats Detected', hi: 'पाए गए खतरे' },
  'Clean Content': { en: 'Clean Content', hi: 'स्वच्छ सामग्री' },
  'Avg Threat Score': { en: 'Avg Threat Score', hi: 'औसत खतरा स्कोर' },
  'Recent Analyses': { en: 'Recent Analyses', hi: 'हाल के विश्लेषण' },
  'No Analysis History': { en: 'No Analysis History', hi: 'कोई विश्लेषण इतिहास नहीं' },
  
  // About Section
  'About Team Scout': { en: 'About Team Wise Coders', hi: 'टीम वाइज कोडर्स के बारे में' },
  'Our Technology': { en: 'Our Technology', hi: 'हमारी तकनीक' },
  'Our Mission': { en: 'Our Mission', hi: 'हमारा मिशन' },
  'Advanced AI Threat Detection': { en: 'Advanced AI Threat Detection', hi: 'उन्नत एआई खतरा पहचान' },
  'Meet Team Scout': { en: 'Meet Team Wise Coders', hi: 'टीम वाइज कोडर्स से मिलें' },
  'Our Expertise': { en: 'Our Expertise', hi: 'हमारी विशेषज्ञता' },
  'Made in India': { en: 'Made in India', hi: 'मेड इन इंडिया' },
  'Proudly developed in Maharashtra': { en: 'Proudly developed in Maharashtra', hi: 'महाराष्ट्र में गर्व से विकसित' },
  
  // Hero Section
  'Protect your digital assets': { en: 'Protect your digital assets with our cutting-edge machine learning algorithms', hi: 'अत्याधुनिक मशीन लर्निंग एल्गोरिदम के साथ अपनी डिजिटल संपत्ति की सुरक्षा करें' },
  'Start Free Analysis': { en: 'Start Free Analysis', hi: 'मुफ्त विश्लेषण शुरू करें' },
  'Learn More': { en: 'Learn More', hi: 'और जानें' },
  
  // Footer
  'Our Services': { en: 'Our Services', hi: 'हमारी सेवाएं' },
  'Threat Detection': { en: 'Threat Detection', hi: 'खतरा पहचान' },
  'Security Audits': { en: 'Security Audits', hi: 'सुरक्षा ऑडिट' },
  'ML Consulting': { en: 'ML Consulting', hi: 'एमएल परामर्श' },
  'Custom Solutions': { en: 'Custom Solutions', hi: 'कस्टम समाधान' },
  'Contact Us': { en: 'Contact Us', hi: 'संपर्क करें' },
  'Privacy Policy': { en: 'Privacy Policy', hi: 'गोपनीयता नीति' },
  'Terms of Service': { en: 'Terms of Service', hi: 'सेवा की शर्तें' },
  'Security': { en: 'Security', hi: 'सुरक्षा' },
  
  // Common Phrases
  'accuracy': { en: 'accuracy', hi: 'सटीकता' },
  'confidence': { en: 'confidence', hi: 'विश्वास' },
  'detected': { en: 'detected', hi: 'पाया गया' },
  'blocked': { en: 'blocked', hi: 'अवरुद्ध' },
  'scanning': { en: 'scanning', hi: 'स्कैन कर रहे हैं' },
  'monitoring': { en: 'monitoring', hi: 'निगरानी' },
  'protection': { en: 'protection', hi: 'सुरक्षा' },
  'security': { en: 'security', hi: 'सुरक्षा' },
  'threat': { en: 'threat', hi: 'खतरा' },
  'safe': { en: 'safe', hi: 'सुरक्षित' },
  'dangerous': { en: 'dangerous', hi: 'खतरनाक' },
  'suspicious': { en: 'suspicious', hi: 'संदिग्ध' },
  
  // Alert Messages
  'Threat Detected!': { en: 'Threat Detected!', hi: 'खतरा पाया गया!' },
  'High risk detected': { en: 'High risk detected', hi: 'उच्च जोखिम पाया गया' },
  'Critical threat found': { en: 'Critical threat found', hi: 'गंभीर खतरा मिला' },
  'System protected': { en: 'System protected', hi: 'सिस्टम सुरक्षित' },
  'Threat blocked successfully': { en: 'Threat blocked successfully', hi: 'खतरा सफलतापूर्वक अवरुद्ध' },
  
  // Descriptions
  'Credential harvesting and account compromise attempt detected': {
    en: 'Credential harvesting and account compromise attempt detected',
    hi: 'क्रेडेंशियल हार्वेस्टिंग और खाता समझौता प्रयास का पता चला'
  },
  'Malicious software distribution and system infection attempt': {
    en: 'Malicious software distribution and system infection attempt',
    hi: 'दुर्भावनापूर्ण सॉफ़्टवेयर वितरण और सिस्टम संक्रमण प्रयास'
  },
  'Unsolicited bulk message with potential fraud indicators': {
    en: 'Unsolicited bulk message with potential fraud indicators',
    hi: 'संभावित धोखाधड़ी संकेतकों के साथ अवांछित बल्क संदेश'
  },
  'No specific threat indicators detected': {
    en: 'No specific threat indicators detected',
    hi: 'कोई विशिष्ट खतरा संकेतक नहीं मिला'
  },
  'Content appears to be safe': {
    en: 'Content appears to be safe',
    hi: 'सामग्री सुरक्षित प्रतीत होती है'
  }
};

export class HindiTranslator {
  private currentLanguage: 'en' | 'hi' = 'en';
  
  setLanguage(language: 'en' | 'hi') {
    this.currentLanguage = language;
    localStorage.setItem('preferred-language', language);
  }
  
  getLanguage(): 'en' | 'hi' {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('preferred-language') as 'en' | 'hi';
      if (saved) {
        this.currentLanguage = saved;
        return saved;
      }
    }
    return this.currentLanguage;
  }
  
  translate(key: string): string {
    const translation = translations[key];
    if (!translation) return key;
    
    return this.currentLanguage === 'hi' ? translation.hi : translation.en;
  }
  
  translateThreatDescription(category: string, riskLevel: string): string {
    const descriptions = {
      'Phishing': {
        en: 'Credential harvesting and account compromise attempt detected',
        hi: 'क्रेडेंशियल हार्वेस्टिंग और खाता समझौता प्रयास का पता चला'
      },
      'Malware': {
        en: 'Malicious software distribution and system infection attempt',
        hi: 'दुर्भावनापूर्ण सॉफ़्टवेयर वितरण और सिस्टम संक्रमण प्रयास'
      },
      'Spam': {
        en: 'Unsolicited bulk message with potential fraud indicators',
        hi: 'संभावित धोखाधड़ी संकेतकों के साथ अवांछित बल्क संदेश'
      },
      'Account Compromise': {
        en: 'Advanced phishing patterns targeting user credentials',
        hi: 'उपयोगकर्ता क्रेडेंशियल को लक्षित करने वाले उन्नत फिशिंग पैटर्न'
      },
      'System Infection': {
        en: 'Malicious software deployment and system compromise',
        hi: 'दुर्भावनापूर्ण सॉफ़्टवेयर तैनाती और सिस्टम समझौता'
      },
      'Fraudulent Scheme': {
        en: 'Financial fraud and deceptive marketing practices',
        hi: 'वित्तीय धोखाधड़ी और भ्रामक विपणन प्रथाएं'
      },
      'Business Email Compromise': {
        en: 'Sophisticated corporate fraud targeting financial transactions',
        hi: 'वित्तीय लेनदेन को लक्षित करने वाली परिष्कृत कॉर्पोरेट धोखाधड़ी'
      },
      'Cryptocurrency Fraud': {
        en: 'Digital currency investment scams and wallet theft attempts',
        hi: 'डिजिटल मुद्रा निवेश घोटाले और वॉलेट चोरी के प्रयास'
      },
      'Romance Scam': {
        en: 'Emotional manipulation for financial exploitation',
        hi: 'वित्तीय शोषण के लिए भावनात्मक हेरफेर'
      }
    };
    
    const desc = descriptions[category as keyof typeof descriptions];
    return desc ? (this.currentLanguage === 'hi' ? desc.hi : desc.en) : category;
  }
  
  translateAlertMessage(riskLevel: string, category: string): string {
    const messages = {
      'critical': {
        en: `🚨 CRITICAL THREAT DETECTED! ${category} attack in progress.`,
        hi: `🚨 गंभीर खतरा पाया गया! ${category} हमला चल रहा है।`
      },
      'high': {
        en: `⚠️ HIGH RISK THREAT! ${category} detected - immediate action required.`,
        hi: `⚠️ उच्च जोखिम खतरा! ${category} पाया गया - तत्काल कार्रवाई आवश्यक।`
      },
      'medium': {
        en: `⚠️ MEDIUM RISK: ${category} indicators found.`,
        hi: `⚠️ मध्यम जोखिम: ${category} संकेतक मिले।`
      },
      'low': {
        en: `ℹ️ LOW RISK: Minor ${category} patterns detected.`,
        hi: `ℹ️ कम जोखिम: मामूली ${category} पैटर्न पाए गए।`
      }
    };
    
    const msg = messages[riskLevel as keyof typeof messages];
    return msg ? (this.currentLanguage === 'hi' ? msg.hi : msg.en) : `${riskLevel} threat detected`;
  }
}

// Singleton instance
let translator: HindiTranslator | null = null;

export function getTranslator(): HindiTranslator {
  if (!translator) {
    translator = new HindiTranslator();
  }
  return translator;
}