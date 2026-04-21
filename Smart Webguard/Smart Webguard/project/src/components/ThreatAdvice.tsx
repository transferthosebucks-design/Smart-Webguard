import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, ShieldAlert, Info, Ban, Lock, Eye, FileWarning, Globe, Hash, FileText } from 'lucide-react';
import { ThreatAnalysis } from '../types/detection';

interface ThreatAdviceProps {
  analysis: ThreatAnalysis;
  language: 'en' | 'hi';
}

interface AdviceItem {
  icon: React.ReactNode;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  priority: 'urgent' | 'important' | 'recommended';
}

interface PrecautionItem {
  text: string;
  textHi: string;
}

export function ThreatAdvice({ analysis, language }: ThreatAdviceProps) {
  const [expanded, setExpanded] = useState(true);
  const isHi = language === 'hi';

  const isHighRisk = analysis.riskLevel === 'high' || analysis.riskLevel === 'critical';
  const isMediumRisk = analysis.riskLevel === 'medium';

  // Don't show advice for low-risk content
  if (analysis.riskLevel === 'low') return null;

  const getImmediateActions = (): AdviceItem[] => {
    const actions: AdviceItem[] = [];

    // --- URL-specific actions ---
    if (analysis.type === 'url') {
      if (isHighRisk) {
        actions.push({
          icon: <Ban className="h-5 w-5 text-red-500" />,
          title: 'Do NOT visit this URL',
          titleHi: 'इस URL पर न जाएं',
          description: 'This link has been identified as malicious. Opening it could expose your device to malware, phishing attacks, or data theft.',
          descriptionHi: 'इस लिंक को दुर्भावनापूर्ण के रूप में पहचाना गया है। इसे खोलने से आपका डिवाइस मालवेयर, फिशिंग हमलों या डेटा चोरी का शिकार हो सकता है।',
          priority: 'urgent'
        });
        actions.push({
          icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
          title: 'Report the URL',
          titleHi: 'URL की रिपोर्ट करें',
          description: 'Report this URL to Google Safe Browsing (safebrowsing.google.com) and your browser\'s built-in reporting tool to help protect others.',
          descriptionHi: 'इस URL की रिपोर्ट Google Safe Browsing (safebrowsing.google.com) और अपने ब्राउज़र के रिपोर्टिंग टूल पर करें ताकि दूसरों की सुरक्षा हो सके।',
          priority: 'urgent'
        });
        actions.push({
          icon: <Lock className="h-5 w-5 text-orange-500" />,
          title: 'Change passwords if visited',
          titleHi: 'अगर विज़िट किया है तो पासवर्ड बदलें',
          description: 'If you already visited this URL, immediately change passwords for any accounts you may have entered credentials for. Enable 2FA wherever possible.',
          descriptionHi: 'अगर आपने यह URL पहले खोला है, तो तुरंत उन सभी खातों के पासवर्ड बदलें जहां आपने क्रेडेंशियल दर्ज किए हों। जहां संभव हो 2FA सक्षम करें।',
          priority: 'urgent'
        });
      } else {
        actions.push({
          icon: <Eye className="h-5 w-5 text-yellow-500" />,
          title: 'Proceed with caution',
          titleHi: 'सावधानी से आगे बढ़ें',
          description: 'This URL shows some suspicious characteristics. Verify the sender before clicking and ensure your antivirus is active.',
          descriptionHi: 'इस URL में कुछ संदिग्ध विशेषताएं हैं। क्लिक करने से पहले प्रेषक की पुष्टि करें और सुनिश्चित करें कि आपका एंटीवायरस सक्रिय है।',
          priority: 'important'
        });
      }
    }

    // --- Text Content actions ---
    if (analysis.type === 'text') {
      if (isHighRisk) {
        actions.push({
          icon: <Ban className="h-5 w-5 text-red-500" />,
          title: 'Do NOT respond or follow instructions',
          titleHi: 'जवाब न दें या निर्देशों का पालन न करें',
          description: 'This text contains social engineering or phishing tactics. Do not reply, click any links, or share personal/financial information.',
          descriptionHi: 'इस टेक्स्ट में सोशल इंजीनियरिंग या फिशिंग तकनीक है। जवाब न दें, किसी लिंक पर क्लिक न करें, या व्यक्तिगत/वित्तीय जानकारी साझा न करें।',
          priority: 'urgent'
        });
        actions.push({
          icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
          title: 'Report as spam/phishing',
          titleHi: 'स्पैम/फिशिंग के रूप में रिपोर्ट करें',
          description: 'Mark this message as spam or phishing in your email client. If received via SMS, report to your carrier by forwarding to 7726 (SPAM).',
          descriptionHi: 'इस संदेश को अपने ईमेल क्लाइंट में स्पैम या फिशिंग के रूप में चिह्नित करें। अगर SMS से प्राप्त हुआ है, तो 7726 (SPAM) पर फॉरवर्ड करके रिपोर्ट करें।',
          priority: 'urgent'
        });
        actions.push({
          icon: <Info className="h-5 w-5 text-orange-500" />,
          title: 'Verify the sender independently',
          titleHi: 'प्रेषक की स्वतंत्र रूप से पुष्टि करें',
          description: 'If this claims to be from a bank, company, or government agency, contact them directly through their official website — not through any link in the message.',
          descriptionHi: 'अगर यह किसी बैंक, कंपनी या सरकारी एजेंसी से होने का दावा करता है, तो उनसे सीधे उनकी आधिकारिक वेबसाइट के माध्यम से संपर्क करें — संदेश में दिए गए लिंक से नहीं।',
          priority: 'important'
        });
      } else {
        actions.push({
          icon: <Eye className="h-5 w-5 text-yellow-500" />,
          title: 'Review content carefully',
          titleHi: 'सामग्री की सावधानी से समीक्षा करें',
          description: 'This text has some suspicious elements. Be cautious about any links, attachments, or requests for personal information it contains.',
          descriptionHi: 'इस टेक्स्ट में कुछ संदिग्ध तत्व हैं। इसमें मौजूद किसी भी लिंक, अटैचमेंट या व्यक्तिगत जानकारी के अनुरोध से सावधान रहें।',
          priority: 'important'
        });
      }
    }

    // --- Domain actions ---
    if (analysis.type === 'domain') {
      if (isHighRisk) {
        actions.push({
          icon: <Ban className="h-5 w-5 text-red-500" />,
          title: 'Block this domain',
          titleHi: 'इस डोमेन को ब्लॉक करें',
          description: 'Add this domain to your firewall/DNS blocklist. If using a corporate network, notify your IT security team immediately.',
          descriptionHi: 'इस डोमेन को अपने फ़ायरवॉल/DNS ब्लॉकलिस्ट में जोड़ें। अगर कॉर्पोरेट नेटवर्क पर हैं, तो तुरंत अपनी IT सुरक्षा टीम को सूचित करें।',
          priority: 'urgent'
        });
        actions.push({
          icon: <Globe className="h-5 w-5 text-orange-500" />,
          title: 'Check WHOIS information',
          titleHi: 'WHOIS जानकारी जांचें',
          description: 'Look up this domain on whois.domaintools.com to check registration date, registrar, and owner details. Newly registered domains are often malicious.',
          descriptionHi: 'whois.domaintools.com पर इस डोमेन की जांच करें — पंजीकरण तिथि, रजिस्ट्रार और मालिक की जानकारी देखें। नए पंजीकृत डोमेन अक्सर दुर्भावनापूर्ण होते हैं।',
          priority: 'important'
        });
      } else {
        actions.push({
          icon: <Eye className="h-5 w-5 text-yellow-500" />,
          title: 'Verify domain legitimacy',
          titleHi: 'डोमेन की वैधता सत्यापित करें',
          description: 'Check if this domain has a valid SSL certificate and matches the expected brand. Look for typosquatting (e.g., g00gle.com instead of google.com).',
          descriptionHi: 'जांचें कि इस डोमेन के पास वैध SSL प्रमाणपत्र है और यह अपेक्षित ब्रांड से मेल खाता है। टाइपोस्क्वैटिंग की जांच करें (जैसे g00gle.com बजाय google.com).',
          priority: 'important'
        });
      }
    }

    // --- File Hash actions ---
    if (analysis.type === 'hash') {
      if (isHighRisk) {
        actions.push({
          icon: <Ban className="h-5 w-5 text-red-500" />,
          title: 'Do NOT execute this file',
          titleHi: 'इस फ़ाइल को चलाएं नहीं',
          description: 'This file hash matches known malware signatures. Delete the file immediately and do not open or run it under any circumstances.',
          descriptionHi: 'इस फ़ाइल का हैश ज्ञात मालवेयर सिग्नेचर से मेल खाता है। फ़ाइल को तुरंत हटाएं और किसी भी परिस्थिति में इसे न खोलें या चलाएं।',
          priority: 'urgent'
        });
        actions.push({
          icon: <ShieldAlert className="h-5 w-5 text-red-500" />,
          title: 'Run a full system scan',
          titleHi: 'पूरा सिस्टम स्कैन चलाएं',
          description: 'Run a complete antivirus scan on your system using an up-to-date scanner. If the file was already executed, consider a clean OS reinstall.',
          descriptionHi: 'अपने सिस्टम पर अपडेटेड एंटीवायरस स्कैनर से पूरा स्कैन चलाएं। अगर फ़ाइल पहले ही चलाई गई है, तो क्लीन OS रीइंस्टॉल पर विचार करें।',
          priority: 'urgent'
        });
        actions.push({
          icon: <FileWarning className="h-5 w-5 text-orange-500" />,
          title: 'Cross-check on VirusTotal',
          titleHi: 'VirusTotal पर क्रॉस-चेक करें',
          description: 'Submit this hash to virustotal.com for a multi-engine scan. This confirms whether the file is flagged by other antivirus vendors.',
          descriptionHi: 'इस हैश को virustotal.com पर सबमिट करें। इससे पुष्टि होगी कि अन्य एंटीवायरस विक्रेता भी इस फ़ाइल को फ़्लैग करते हैं या नहीं।',
          priority: 'important'
        });
      } else {
        actions.push({
          icon: <Eye className="h-5 w-5 text-yellow-500" />,
          title: 'Scan before opening',
          titleHi: 'खोलने से पहले स्कैन करें',
          description: 'Upload this file to VirusTotal or scan it with your local antivirus before opening. Do not disable security warnings to run it.',
          descriptionHi: 'इस फ़ाइल को खोलने से पहले VirusTotal पर अपलोड करें या अपने लोकल एंटीवायरस से स्कैन करें। इसे चलाने के लिए सुरक्षा चेतावनियां बंद न करें।',
          priority: 'important'
        });
      }
    }

    return actions;
  };

  const getPrecautions = (): PrecautionItem[] => {
    const precautions: PrecautionItem[] = [];

    // General precautions for all types
    precautions.push({
      text: 'Keep your operating system, browser, and antivirus software up to date at all times.',
      textHi: 'अपने ऑपरेटिंग सिस्टम, ब्राउज़र और एंटीवायरस सॉफ़्टवेयर को हमेशा अपडेट रखें।'
    });
    precautions.push({
      text: 'Enable Two-Factor Authentication (2FA) on all important accounts — email, banking, and social media.',
      textHi: 'सभी महत्वपूर्ण खातों — ईमेल, बैंकिंग और सोशल मीडिया पर टू-फैक्टर ऑथेंटिकेशन (2FA) सक्षम करें।'
    });

    // Type-specific precautions
    if (analysis.type === 'url' || analysis.type === 'domain') {
      precautions.push({
        text: 'Always check the full URL before clicking. Look for misspellings, extra characters, or unusual domains.',
        textHi: 'क्लिक करने से पहले हमेशा पूरा URL जांचें। गलत वर्तनी, अतिरिक्त अक्षर या असामान्य डोमेन की तलाश करें।'
      });
      precautions.push({
        text: 'Look for HTTPS (padlock icon) in the address bar. Avoid entering sensitive data on HTTP-only sites.',
        textHi: 'एड्रेस बार में HTTPS (ताले का आइकन) देखें। केवल HTTP वाली साइटों पर संवेदनशील डेटा दर्ज करने से बचें।'
      });
      precautions.push({
        text: 'Use a DNS filter like Cloudflare (1.1.1.2) or OpenDNS to automatically block known malicious domains.',
        textHi: 'Cloudflare (1.1.1.2) या OpenDNS जैसे DNS फ़िल्टर का उपयोग करें ताकि ज्ञात दुर्भावनापूर्ण डोमेन स्वचालित रूप से ब्लॉक हो जाएं।'
      });
      precautions.push({
        text: 'Never enter passwords or financial details on sites accessed through email or SMS links.',
        textHi: 'ईमेल या SMS लिंक के माध्यम से खोली गई साइटों पर कभी भी पासवर्ड या वित्तीय जानकारी दर्ज न करें।'
      });
    }

    if (analysis.type === 'text') {
      precautions.push({
        text: 'Be skeptical of any message that creates urgency — "Act now!", "Account suspended!", "Limited time!".',
        textHi: 'किसी भी संदेश पर संदेह करें जो तत्काल कार्रवाई की मांग करे — "अभी करें!", "खाता निलंबित!", "सीमित समय!".'
      });
      precautions.push({
        text: 'Never share OTP, PIN, passwords, or bank account details over email, SMS, or phone calls.',
        textHi: 'ईमेल, SMS या फोन कॉल पर कभी भी OTP, PIN, पासवर्ड या बैंक खाते की जानकारी साझा न करें।'
      });
      precautions.push({
        text: 'Legitimate organizations will never ask for sensitive information through unsolicited messages.',
        textHi: 'वैध संगठन कभी भी अनचाहे संदेशों के माध्यम से संवेदनशील जानकारी नहीं मांगते।'
      });
    }

    if (analysis.type === 'hash') {
      precautions.push({
        text: 'Only download software from official sources — vendor websites, App Store, Google Play, or trusted repositories.',
        textHi: 'सॉफ़्टवेयर केवल आधिकारिक स्रोतों — विक्रेता वेबसाइट, App Store, Google Play या विश्वसनीय रिपॉज़िटरी से डाउनलोड करें।'
      });
      precautions.push({
        text: 'Verify file hashes before installing critical software. Compare them against the publisher\'s listed checksums.',
        textHi: 'महत्वपूर्ण सॉफ़्टवेयर इंस्टॉल करने से पहले फ़ाइल हैश सत्यापित करें। उन्हें प्रकाशक के दिए गए चेकसम से मिलाएं।'
      });
      precautions.push({
        text: 'Never disable your antivirus or Windows Defender to install a file. That is a major red flag.',
        textHi: 'किसी फ़ाइल को इंस्टॉल करने के लिए कभी भी अपना एंटीवायरस या Windows Defender बंद न करें। यह एक बड़ा खतरे का संकेत है।'
      });
    }

    // High risk additional precautions
    if (isHighRisk) {
      precautions.push({
        text: 'Monitor your bank statements and credit reports for the next 30 days for any unauthorized activity.',
        textHi: 'अगले 30 दिनों तक किसी भी अनधिकृत गतिविधि के लिए अपने बैंक स्टेटमेंट और क्रेडिट रिपोर्ट की निगरानी करें।'
      });
      precautions.push({
        text: 'Consider using a password manager to generate and store unique, strong passwords for every account.',
        textHi: 'हर खाते के लिए अद्वितीय, मजबूत पासवर्ड बनाने और स्टोर करने के लिए पासवर्ड मैनेजर का उपयोग करें।'
      });
    }

    return precautions;
  };

  const getCategoryAdvice = (): { label: string; labelHi: string; advice: string; adviceHi: string }[] => {
    const categoryAdvice: { label: string; labelHi: string; advice: string; adviceHi: string }[] = [];

    analysis.categories.forEach(cat => {
      const name = cat.name.toLowerCase();
      if (name.includes('phishing') || name.includes('account compromise')) {
        categoryAdvice.push({
          label: 'Phishing',
          labelHi: 'फिशिंग',
          advice: 'This is designed to steal your login credentials. Change your passwords immediately if you interacted with this content.',
          adviceHi: 'यह आपके लॉगिन क्रेडेंशियल चुराने के लिए डिज़ाइन किया गया है। अगर आपने इस सामग्री से इंटरैक्ट किया है तो तुरंत अपने पासवर्ड बदलें।'
        });
      }
      if (name.includes('malware') || name.includes('system infection')) {
        categoryAdvice.push({
          label: 'Malware',
          labelHi: 'मालवेयर',
          advice: 'This may install harmful software on your device. Run a full antivirus scan and check for any unfamiliar programs recently installed.',
          adviceHi: 'यह आपके डिवाइस पर हानिकारक सॉफ़्टवेयर इंस्टॉल कर सकता है। पूरा एंटीवायरस स्कैन चलाएं और हाल ही में इंस्टॉल किए गए अपरिचित प्रोग्राम जांचें।'
        });
      }
      if (name.includes('spam') || name.includes('fraud')) {
        categoryAdvice.push({
          label: 'Spam / Fraud',
          labelHi: 'स्पैम / धोखाधड़ी',
          advice: 'Do not engage with offers that seem too good to be true. Block the sender and report the message.',
          adviceHi: 'ऐसे ऑफ़र से न जुड़ें जो सच होने के लिए बहुत अच्छे लगते हैं। प्रेषक को ब्लॉक करें और संदेश की रिपोर्ट करें।'
        });
      }
      if (name.includes('crypto')) {
        categoryAdvice.push({
          label: 'Crypto Fraud',
          labelHi: 'क्रिप्टो धोखाधड़ी',
          advice: 'Never share your wallet seed phrase or private keys. Legitimate crypto platforms will never ask for them.',
          adviceHi: 'अपनी वॉलेट सीड फ़्रेज़ या प्राइवेट कीज़ कभी साझा न करें। वैध क्रिप्टो प्लेटफ़ॉर्म कभी इनकी मांग नहीं करते।'
        });
      }
      if (name.includes('romance')) {
        categoryAdvice.push({
          label: 'Romance Scam',
          labelHi: 'रोमांस घोटाला',
          advice: 'Never send money to someone you have only met online. Verify identities through video calls and be wary of urgent financial requests.',
          adviceHi: 'किसी ऐसे व्यक्ति को पैसे न भेजें जिससे आप केवल ऑनलाइन मिले हैं। वीडियो कॉल से पहचान सत्यापित करें और तत्काल वित्तीय अनुरोधों से सावधान रहें।'
        });
      }
      if (name.includes('business email') || name.includes('advanced persistent')) {
        categoryAdvice.push({
          label: 'Advanced Threat',
          labelHi: 'उन्नत खतरा',
          advice: 'Verify any unusual payment or wire-transfer requests by calling the person directly. Do not rely on email alone for financial approvals.',
          adviceHi: 'किसी भी असामान्य भुगतान या वायर-ट्रांसफर अनुरोध को सीधे फोन करके सत्यापित करें। वित्तीय अनुमोदन के लिए केवल ईमेल पर निर्भर न रहें।'
        });
      }
    });

    // Deduplicate by label
    const seen = new Set<string>();
    return categoryAdvice.filter(item => {
      if (seen.has(item.label)) return false;
      seen.add(item.label);
      return true;
    });
  };

  const actions = getImmediateActions();
  const precautions = getPrecautions();
  const categoryAdvice = getCategoryAdvice();

  const getContentTypeIcon = () => {
    switch (analysis.type) {
      case 'url': return <Globe className="h-5 w-5" />;
      case 'text': return <FileText className="h-5 w-5" />;
      case 'domain': return <Globe className="h-5 w-5" />;
      case 'hash': return <Hash className="h-5 w-5" />;
    }
  };

  const getPriorityBadge = (priority: 'urgent' | 'important' | 'recommended') => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {isHi ? 'तत्काल' : 'URGENT'}
          </span>
        );
      case 'important':
        return (
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
            {isHi ? 'महत्वपूर्ण' : 'IMPORTANT'}
          </span>
        );
      case 'recommended':
        return (
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {isHi ? 'अनुशंसित' : 'RECOMMENDED'}
          </span>
        );
    }
  };

  return (
    <div className={`rounded-lg shadow-sm border overflow-hidden ${
      isHighRisk
        ? 'border-red-300 dark:border-red-800'
        : 'border-yellow-300 dark:border-yellow-800'
    }`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full px-6 py-4 flex items-center justify-between ${
          isHighRisk
            ? 'bg-red-50 dark:bg-red-900/20'
            : 'bg-yellow-50 dark:bg-yellow-900/20'
        }`}
      >
        <div className="flex items-center space-x-3">
          <ShieldCheck className={`h-6 w-6 ${isHighRisk ? 'text-red-600' : 'text-yellow-600'}`} />
          <div className="text-left">
            <h3 className={`text-lg font-semibold ${isHighRisk ? 'text-red-800 dark:text-red-300' : 'text-yellow-800 dark:text-yellow-300'}`}>
              {isHi ? '🛡️ सुरक्षा सलाह और सावधानियां' : '🛡️ Security Advice & Precautions'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isHi
                ? `${analysis.type.toUpperCase()} विश्लेषण के आधार पर ${analysis.riskLevel === 'critical' ? 'गंभीर' : analysis.riskLevel === 'high' ? 'उच्च' : 'मध्यम'} जोखिम सलाह`
                : `${analysis.riskLevel.charAt(0).toUpperCase() + analysis.riskLevel.slice(1)} risk advice based on ${analysis.type.toUpperCase()} analysis`
              }
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>

      {expanded && (
        <div className="bg-white dark:bg-gray-800 px-6 py-5 space-y-6">

          {/* Immediate Actions */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className={`h-5 w-5 ${isHighRisk ? 'text-red-500' : 'text-yellow-500'}`} />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {isHi ? 'तुरंत क्या करें' : 'What To Do Right Now'}
              </h4>
            </div>
            <div className="space-y-3">
              {actions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="mt-0.5">{action.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {isHi ? action.titleHi : action.title}
                      </p>
                      {getPriorityBadge(action.priority)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isHi ? action.descriptionHi : action.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category-Specific Advice */}
          {categoryAdvice.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                {getContentTypeIcon()}
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {isHi ? 'खतरे के प्रकार के अनुसार सलाह' : 'Threat-Specific Advice'}
                </h4>
              </div>
              <div className="space-y-2">
                {categoryAdvice.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-300 text-sm">
                        {isHi ? item.labelHi : item.label}
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-0.5">
                        {isHi ? item.adviceHi : item.advice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Precautions */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Lock className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {isHi ? 'सावधानियां और सुझाव' : 'Precautions & Tips'}
              </h4>
            </div>
            <ul className="space-y-2">
              {precautions.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1 text-sm">✓</span>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {isHi ? item.textHi : item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Contact Info for Critical threats */}
          {analysis.riskLevel === 'critical' && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                {isHi ? '🚨 आपातकालीन संपर्क' : '🚨 Emergency Resources'}
              </h4>
              <ul className="space-y-1 text-sm text-red-700 dark:text-red-400">
                <li>• <strong>{isHi ? 'भारतीय साइबर क्राइम:' : 'Indian Cyber Crime:'}</strong> cybercrime.gov.in | 1930</li>
                <li>• <strong>{isHi ? 'गूगल सेफ ब्राउज़िंग:' : 'Google Safe Browsing:'}</strong> safebrowsing.google.com/safebrowsing/report_phish/</li>
                <li>• <strong>{isHi ? 'फिशिंग रिपोर्ट:' : 'Report Phishing:'}</strong> reportphishing@apwg.org</li>
                <li>• <strong>VirusTotal:</strong> virustotal.com</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
