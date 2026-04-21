interface ConversationContext {
  topics: Set<string>;
  previousQuestions: string[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
}

const securityKeywords = {
  phishing: ['phishing', 'email', 'fake', 'login', 'credential', 'trick'],
  malware: ['malware', 'virus', 'ransomware', 'trojan', 'worm', 'spyware'],
  url: ['url', 'link', 'website', 'domain', 'site', 'address'],
  password: ['password', 'passphrase', 'authentication', 'login', 'credential'],
  ransomware: ['ransomware', 'encrypt', 'payment', 'bitcoin', 'hostage'],
  ddos: ['ddos', 'attack', 'crash', 'down', 'overload', 'flood'],
  social: ['social engineering', 'pretexting', 'baiting', 'tailgating', 'trick'],
  breach: ['breach', 'leak', 'data', 'exposed', 'compromised', 'hacked'],
  mfa: ['mfa', 'two-factor', '2fa', 'authenticator', 'verification'],
  vpn: ['vpn', 'proxy', 'encrypted', 'private network', 'tunnel']
};

const responses: Record<string, Record<'en' | 'hi', string>> = {
  phishing_what: {
    en: 'Phishing is a social engineering attack where attackers try to trick you into revealing sensitive information like passwords or financial details. They typically do this through:\n• Deceptive emails that look legitimate\n• Fake login pages that steal credentials\n• Urgent or threatening messages designed to make you act quickly\n• Suspicious links that direct you to malicious sites\n\nAlways verify sender addresses, hover over links to see their true destination, and never share passwords via email.',
    hi: 'फिशिंग एक सामाजिक इंजीनियरिंग हमला है जहां हमलावर आपको पासवर्ड या वित्तीय विवरण जैसी संवेदनशील जानकारी का खुलासा करने के लिए धोखा देने की कोशिश करते हैं। वे आमतौर पर इसे इसके माध्यम से करते हैं:\n• धोखाधड़ी वाले ईमेल जो वैध दिखते हैं\n• नकली लॉगिन पेज जो क्रेडेंशियल चोरी करते हैं\n• आपको जल्दी कार्य करने के लिए डिज़ाइन किए गए जरूरी या धमकी भरे संदेश\n• संदिग्ध लिंक जो आपको दुर्भावनापूर्ण साइटों पर निर्देशित करते हैं\n\nहमेशा प्रेषक के पते की पुष्टि करें, उनके सच्चे गंतव्य को देखने के लिए लिंक पर होवर करें, और कभी भी ईमेल के माध्यम से पासवर्ड साझा न करें।'
  },
  malware_what: {
    en: 'Malware is malicious software designed to harm your device or steal your data. Common types include:\n• Viruses: Self-replicating programs that corrupt files\n• Trojans: Programs disguised as legitimate software\n• Ransomware: Encrypts your files and demands payment\n• Spyware: Secretly monitors your activity\n• Adware: Displays unwanted advertisements\n• Worms: Self-replicating across networks\n\nOur ML-powered system detects malware through signature analysis, behavioral patterns, and sandboxing techniques.',
    hi: 'मालवेयर दुर्भावनापूर्ण सॉफ़्टवेयर है जो आपके डिवाइस को नुकसान पहुंचाने या आपके डेटा चोरी करने के लिए डिज़ाइन किया गया है। सामान्य प्रकार में शामिल हैं:\n• वायरस: स्व-प्रतिलिपि करने वाले प्रोग्राम जो फाइलें खराब करते हैं\n• ट्रोजन: वैध सॉफ़्टवेयर के रूप में प्रच्छन्न प्रोग्राम\n• रैनसमवेयर: आपकी फाइलों को एन्क्रिप्ट करता है और भुगतान मांगता है\n• स्पाइवेयर: आपकी गतिविधि की गुप्त निगरानी करता है\n• एडवेयर: अवांछित विज्ञापन प्रदर्शित करता है\n• वर्म्स: नेटवर्क में स्व-प्रतिलिपि करते हैं\n\nहमारी एमएल-संचालित प्रणाली हस्ताक्षर विश्लेषण, व्यवहारिक पैटर्न और सैंडबॉक्सिंग तकनीकों के माध्यम से मालवेयर का पता लगाती है।'
  },
  url_safe: {
    en: 'To check if a URL is safe:\n• Look at the domain name carefully - scammers use similar-looking domains\n• Check for HTTPS (the padlock icon) - it indicates encrypted connection\n• Hover over links to see the actual destination\n• Use our Content Analysis tool - enter the URL and get instant analysis\n• Check the sender\'s address if it\'s from an email\n• Look for suspicious elements like poor grammar, unusual requests, or urgency\n\nOur system analyzes URLs for malicious patterns, phishing indicators, and known dangerous sites.',
    hi: 'यह जांचने के लिए कि क्या URL सुरक्षित है:\n• डोमेन नाम को ध्यान से देखें - स्कैमर समान दिखने वाले डोमेन का उपयोग करते हैं\n• HTTPS (पैडलॉक आइकन) की जांच करें - यह एन्क्रिप्टेड कनेक्शन को दर्शाता है\n• वास्तविक गंतव्य को देखने के लिए लिंक पर होवर करें\n• हमारे सामग्री विश्लेषण उपकरण का उपयोग करें - URL दर्ज करें और तुरंत विश्लेषण प्राप्त करें\n• यदि यह ईमेल से है तो प्रेषक के पते की जांच करें\n• खराब व्याकरण, असामान्य अनुरोध या जरूरी चीजों जैसे संदिग्ध तत्वों को देखें\n\nहमारी प्रणाली दुर्भावनापूर्ण पैटर्न, फिशिंग संकेतकों और ज्ञात खतरनाक साइटों के लिए URL का विश्लेषण करती है।'
  },
  password_strong: {
    en: 'A strong password should:\n• Be at least 12-16 characters long\n• Include uppercase letters (A-Z), lowercase (a-z), numbers (0-9), and symbols (!@#$%)\n• Avoid common words, names, or dates\n• Not reuse passwords across different accounts\n• Be changed regularly (every 90 days)\n• Use a password manager for secure storage\n\nDon\'t share passwords via email, messages, or with anyone. Enable multi-factor authentication (MFA) for extra security.',
    hi: 'एक मजबूत पासवर्ड को यह करना चाहिए:\n• कम से कम 12-16 वर्ण लंबा हो\n• बड़े अक्षर (A-Z), छोटे अक्षर (a-z), संख्याएं (0-9) और प्रतीक (!@#$%) शामिल करें\n• सामान्य शब्दों, नामों या तारीखों से बचें\n• विभिन्न खातों में पासवर्ड दोबारा उपयोग न करें\n• नियमित रूप से बदलें (हर 90 दिन में)\n• सुरक्षित भंडारण के लिए पासवर्ड मैनेजर का उपयोग करें\n\nपासवर्ड को ईमेल, संदेशों के माध्यम से साझा न करें या किसी के साथ न करें। अतिरिक्त सुरक्षा के लिए दो-कारक प्रमाणीकरण (MFA) सक्षम करें।'
  },
  ransomware_what: {
    en: 'Ransomware is malicious software that encrypts your files and locks you out of your device, then demands payment (ransom) for decryption. Prevention:\n• Keep your OS and software updated\n• Use reliable antivirus and anti-malware tools\n• Regular backups of important files (keep offline)\n• Don\'t open suspicious email attachments\n• Be cautious of links from unknown sources\n• Use strong passwords and MFA\n\nIf infected:\n• Disconnect from the internet immediately\n• Don\'t pay the ransom\n• Report to law enforcement\n• Contact a professional for recovery attempts',
    hi: 'रैनसमवेयर दुर्भावनापूर्ण सॉफ़्टवेयर है जो आपकी फाइलों को एन्क्रिप्ट करता है और आपको अपने डिवाइस से लॉक करता है, फिर डिक्रिप्शन के लिए भुगतान (फिरौती) मांगता है। रोकथाम:\n• अपने OS और सॉफ़्टवेयर को अपडेट रखें\n• विश्वसनीय एंटीवायरस और एंटी-मालवेयर टूल का उपयोग करें\n• महत्वपूर्ण फाइलों का नियमित बैकअप (ऑफलाइन रखें)\n• संदिग्ध ईमेल अनुलग्नक न खोलें\n• अज्ञात स्रोतों से लिंक से सावधान रहें\n• मजबूत पासवर्ड और MFA का उपयोग करें\n\nयदि संक्रमित है:\n• तुरंत इंटरनेट से डिस्कनेक्ट करें\n• फिरौती का भुगतान न करें\n• कानून प्रवर्तन को रिपोर्ट करें\n• पुनर्प्राप्ति प्रयासों के लिए पेशेवर से संपर्क करें'
  },
  ddos_what: {
    en: 'A DDoS (Distributed Denial of Service) attack overwhelms a server with massive traffic from multiple sources, making the service unavailable. Types:\n• Volume-based: Floods the network with huge amounts of traffic\n• Protocol-based: Exploits weaknesses in network protocols\n• Application-based: Targets web applications\n\nIf your site is under attack:\n• Contact your hosting provider immediately\n• Implement DDoS mitigation services\n• Monitor traffic patterns\n• Use rate limiting\n• Have a recovery plan ready',
    hi: 'एक DDoS (वितरित सेवा से इनकार) हमला कई स्रोतों से विशाल ट्रैफिक के साथ एक सर्वर को अभिभूत करता है, जिससे सेवा उपलब्ध नहीं होती। प्रकार:\n• वॉल्यूम-आधारित: नेटवर्क को बड़ी मात्रा में ट्रैफिक से भरता है\n• प्रोटोकॉल-आधारित: नेटवर्क प्रोटोकॉल में कमजोरियों का दुरुपयोग करता है\n• एप्लिकेशन-आधारित: वेब एप्लिकेशन को लक्षित करता है\n\nयदि आपकी साइट हमले के अधीन है:\n• तुरंत अपने होस्टिंग प्रदाता से संपर्क करें\n• DDoS शमन सेवाएं लागू करें\n• ट्रैफिक पैटर्न की निगरानी करें\n• दर सीमा का उपयोग करें\n• पुनर्प्राप्ति योजना तैयार रखें'
  },
  mfa_benefit: {
    en: 'Multi-Factor Authentication (MFA) adds an extra layer of security:\n• Something you know (password)\n• Something you have (phone, security key)\n• Something you are (fingerprint, face recognition)\n\nBenefits:\n• Protects against stolen passwords\n• Prevents unauthorized account access\n• Reduces security breaches by up to 99%\n• Industry standard for important accounts\n\nTypes:\n• SMS codes (less secure but easy)\n• Authenticator apps (Google Authenticator, Microsoft Authenticator)\n• Hardware security keys (most secure)\n• Biometric authentication\n\nEnable MFA on all important accounts now!',
    hi: 'मल्टी-फैक्टर प्रमाणीकरण (MFA) सुरक्षा की एक अतिरिक्त परत जोड़ता है:\n• जो आप जानते हैं (पासवर्ड)\n• जो आपके पास है (फोन, सुरक्षा कुंजी)\n• जो आप हैं (फिंगरप्रिंट, चेहरा पहचान)\n\nलाभ:\n• चोरी किए गए पासवर्ड से सुरक्षा\n• अनाधिकृत खाता पहुंच को रोकता है\n• सुरक्षा उल्लंघन को 99% तक कम करता है\n• महत्वपूर्ण खातों के लिए उद्योग मानक\n\nप्रकार:\n• SMS कोड (कम सुरक्षित लेकिन आसान)\n• प्रमाणक ऐप्स (गूगल प्रमाणक, माइक्रोसॉफ्ट प्रमाणक)\n• हार्डवेयर सुरक्षा कुंजी (सबसे सुरक्षित)\n• बायोमेट्रिक प्रमाणीकरण\n\nअब सभी महत्वपूर्ण खातों पर MFA सक्षम करें!'
  },
  threat_score: {
    en: 'Our threat score (0-100) helps you understand risk levels:\n\n⚠️ LOW (0-34): Safe to visit\n• Minimal malicious indicators\n• Trusted domain\n• Proper security certificates\n\n⚠️ MEDIUM (35-64): Caution recommended\n• Some suspicious patterns\n• Unknown reputation\n• Requires further investigation\n\n⚠️ HIGH (65-84): Potentially dangerous\n• Multiple malicious indicators\n• Known phishing/malware signatures\n• Strong recommendation to avoid\n\n⚠️ CRITICAL (85-100): Extremely dangerous\n• Confirmed malicious\n• Active threat\n• Blocked immediately\n\nOur ML model uses 28+ features for accurate detection.',
    hi: 'हमारा खतरा स्कोर (0-100) आपको जोखिम स्तर समझने में मदद करता है:\n\n⚠️ कम (0-34): देखने के लिए सुरक्षित\n• न्यूनतम दुर्भावनापूर्ण संकेतक\n• विश्वसनीय डोमेन\n• उचित सुरक्षा प्रमाणपत्र\n\n⚠️ माध्यम (35-64): सावधानी की सिफारिश की जाती है\n• कुछ संदिग्ध पैटर्न\n• अज्ञात प्रतिष्ठा\n• आगे की जांच की आवश्यकता है\n\n⚠️ उच्च (65-84): संभावित रूप से खतरनाक\n• कई दुर्भावनापूर्ण संकेतक\n• ज्ञात फिशिंग/मालवेयर हस्ताक्षर\n• बचने के लिए मजबूत सिफारिश\n\n⚠️ गंभीर (85-100): अत्यंत खतरनाक\n• पुष्टि की गई दुर्भावनापूर्ण\n• सक्रिय खतरा\n• तुरंत अवरुद्ध\n\nहमारा एमएल मॉडल सटीक पहचान के लिए 28+ विशेषताओं का उपयोग करता है।'
  },
  safe_practices: {
    en: 'Best practices for staying safe online:\n\n1. Use Strong Passwords\n   • 12+ characters, mixed case, numbers, symbols\n   • Use password managers\n\n2. Enable MFA\n   • Protect important accounts\n   • Use authenticator apps\n\n3. Be Cautious of Links & Attachments\n   • Verify sender before opening\n   • Hover over links to check destination\n   • Don\'t trust emails asking for passwords\n\n4. Keep Software Updated\n   • OS patches and updates\n   • Application updates\n   • Browser extensions\n\n5. Regular Backups\n   • Keep offline copies\n   • Test recovery procedures\n\n6. Use VPN\n   • Especially on public WiFi\n   • Encrypts your traffic\n\n7. Monitor Accounts\n   • Check statements regularly\n   • Review login history\n\n8. Educate Yourself\n   • Stay updated on threats\n   • Know common scams',
    hi: 'ऑनलाइन सुरक्षित रहने के लिए सर्वोत्तम प्रथाएं:\n\n1. मजबूत पासवर्ड का उपयोग करें\n   • 12+ वर्ण, मिश्रित केस, संख्याएं, प्रतीक\n   • पासवर्ड मैनेजर का उपयोग करें\n\n2. MFA सक्षम करें\n   • महत्वपूर्ण खातों की सुरक्षा करें\n   • प्रमाणक ऐप्स का उपयोग करें\n\n3. लिंक और अनुलग्नक के प्रति सावधान रहें\n   • खोलने से पहले प्रेषक की पुष्टि करें\n   • गंतव्य की जांच करने के लिए लिंक पर होवर करें\n   • पासवर्ड मांगने वाले ईमेल पर विश्वास न करें\n\n4. सॉफ़्टवेयर को अपडेट रखें\n   • OS पैच और अपडेट\n   • एप्लिकेशन अपडेट\n   • ब्राउज़र एक्सटेंशन\n\n5. नियमित बैकअप\n   • ऑफलाइन प्रतियां रखें\n   • पुनर्प्राप्ति प्रक्रियाओं का परीक्षण करें\n\n6. VPN का उपयोग करें\n   • विशेष रूप से सार्वजनिक WiFi पर\n   • आपके ट्रैफिक को एन्क्रिप्ट करता है\n\n7. खातों की निगरानी करें\n   • विवरण नियमित रूप से जांचें\n   • लॉगिन इतिहास की समीक्षा करें\n\n8. अपने आप को शिक्षित करें\n   • खतरों पर अपडेट रहें\n   • सामान्य घोटालों को जानें'
  }
};

export const generateSmartResponse = (
  userMessage: string,
  language: 'en' | 'hi',
  context: ConversationContext
): string => {
  const lowerMessage = userMessage.toLowerCase();
  let bestMatch = null;
  let maxScore = 0;

  for (const [topic, keywords] of Object.entries(securityKeywords)) {
    const score = keywords.filter(k => lowerMessage.includes(k)).length;
    if (score > maxScore) {
      maxScore = score;
      bestMatch = topic;
    }
  }

  const responseKey = bestMatch
    ? `${bestMatch}_${getDetailLevel(lowerMessage)}`
    : 'safe_practices';

  const selectedResponse = responses[responseKey] || responses.safe_practices;

  return selectedResponse[language] || selectedResponse.en;
};

const getDetailLevel = (message: string): string => {
  if (
    message.includes('how') ||
    message.includes('explain') ||
    message.includes('tell') ||
    message.includes('how to') ||
    message.includes('कैसे') ||
    message.includes('समझाएं')
  ) {
    return 'what';
  }
  if (
    message.includes('prevent') ||
    message.includes('protect') ||
    message.includes('safe') ||
    message.includes('बचाव') ||
    message.includes('सुरक्षित')
  ) {
    return 'safe';
  }
  if (
    message.includes('benefit') ||
    message.includes('advantage') ||
    message.includes('why') ||
    message.includes('लाभ') ||
    message.includes('क्यों')
  ) {
    return 'benefit';
  }

  return 'what';
};

export const getFollowUpQuestions = (
  language: 'en' | 'hi',
  context: ConversationContext
): string[] => {
  const questions: Record<'en' | 'hi', string[]> = {
    en: [
      'What makes a URL safe or dangerous?',
      'How can I protect my passwords?',
      'What is ransomware and how to prevent it?',
      'Explain multi-factor authentication',
      'How does phishing work?',
      'What should I do after a breach?'
    ],
    hi: [
      'कौन सा URL सुरक्षित या खतरनाक है?',
      'मैं अपने पासवर्ड की सुरक्षा कैसे कर सकता हूं?',
      'रैनसमवेयर क्या है और इसे कैसे रोकें?',
      'दो-कारक प्रमाणीकरण समझाएं',
      'फिशिंग कैसे काम करती है?',
      'डेटा ब्रीच के बाद मुझे क्या करना चाहिए?'
    ]
  };

  return questions[language];
};
