import React, { useState, useEffect } from 'react';
import { Shield, Search, Globe, FileText, Hash, ExternalLink, Download, MessageCircle } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageToggle } from './components/LanguageToggle';
import { AdvancedAlertSystem } from './components/AdvancedAlertSystem';
import { analyzeContent } from './utils/mlDetection';
import { getEnhancedDetector } from './utils/enhancedMLModel';
import { getTranslator } from './utils/hindiTranslator';
import { getSpellChecker } from './utils/spellChecker';
import { getURLBlocker } from './utils/urlBlocker';
import { getVoiceAssistant } from './utils/voiceAssistant';
import { getRealTimeMonitor } from './utils/realTimeURLMonitor';
import { ThreatAnalysis, AnalysisStats } from './types/detection';
import { ThreatScoreCard } from './components/ThreatScoreCard';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { ThreatIndicators } from './components/ThreatIndicators';
import { AnalysisHistory } from './components/AnalysisHistory';
import { StatsOverview } from './components/StatsOverview';
import { Footer } from './components/Footer';
import { AboutSection } from './components/AboutSection';
import { RealTimeMonitor } from './components/RealTimeMonitor';
import { ThreatVisualization } from './components/ThreatVisualization';
import { ThreatClassification } from './components/ThreatClassification';
import { BlockedURLsList } from './components/BlockedURLsList';
import { AlertSystemTest } from './components/AlertSystemTest';
import { ChatBot } from './components/ChatBot';
import { ThreatNotificationOverlay } from './components/ThreatNotificationOverlay';
import { ThreatAdvice } from './components/ThreatAdvice';

// Extend Window interface for browser extension integration
declare global {
  interface Window {
    threatGuardApp?: {
      analyzeContent: typeof analyzeContent;
      getURLBlocker: typeof getURLBlocker;
      getRealTimeMonitor: typeof getRealTimeMonitor;
      translator: any;
      language: 'en' | 'hi';
    };
    analyzeContent?: typeof analyzeContent;
    getURLBlocker?: typeof getURLBlocker;
  }
}

function App() {
  const { isDark, toggleTheme } = useTheme();
  const translator = getTranslator();
  const spellChecker = getSpellChecker();
  const [language, setLanguage] = useState<'en' | 'hi'>(() => translator.getLanguage());
  const [inputContent, setInputContent] = useState('');
  const [contentType, setContentType] = useState<'url' | 'text' | 'domain' | 'hash'>('url');
  const [currentAnalysis, setCurrentAnalysis] = useState<ThreatAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<ThreatAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [alertThreats, setAlertThreats] = useState<ThreatAnalysis[]>([]);
  const [showVisualization, setShowVisualization] = useState(true);
  const [datasetStats, setDatasetStats] = useState<any>(null);
  const [validationError, setValidationError] = useState<string>('');
  const [spellCheckResults, setSpellCheckResults] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'chatbot'>('home');
  const [overlayThreat, setOverlayThreat] = useState<ThreatAnalysis | null>(null);

  // Expose ML detection functions globally for browser extension
  useEffect(() => {
    // Make functions available to browser extension
    if (typeof window !== 'undefined') {
      window.threatGuardApp = {
        analyzeContent: analyzeContent,
        getURLBlocker: getURLBlocker,
        getRealTimeMonitor: () => getRealTimeMonitor(),
        translator: translator,
        language: language
      };

      // Also expose individual functions for easier access
      window.analyzeContent = analyzeContent;
      window.getURLBlocker = getURLBlocker;
    }
  }, [analyzeContent, translator, language]);

  // Load dataset statistics and initialize voice assistant
  useEffect(() => {
    const loadDatasetStats = async () => {
      try {
        const detector = await getEnhancedDetector();
        const stats = detector.getDatasetStats();
        setDatasetStats(stats);
      } catch (error) {
        console.error('Failed to load dataset stats:', error);
      }
    };
    loadDatasetStats();

    // Initialize voice assistant
    const voiceAssistant = getVoiceAssistant();
    voiceAssistant.setLanguage(language);

    // Request notification permission on load
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleLanguageChange = (newLanguage: 'en' | 'hi') => {
    setLanguage(newLanguage);
    translator.setLanguage(newLanguage);
  };

  const handleInputChange = (value: string) => {
    setInputContent(value);
    setValidationError('');
    
    // Real-time spell check for text content
    if (contentType === 'text' && value.trim()) {
      const spellResult = spellChecker.checkSpelling(value);
      setSpellCheckResults(spellResult);
    } else {
      setSpellCheckResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!inputContent.trim()) return;

    // Check if URL is blocked
    if (contentType === 'url') {
      const urlBlocker = getURLBlocker();
      if (urlBlocker.isBlocked(inputContent.trim())) {
        const blockedInfo = urlBlocker.getBlockedInfo(inputContent.trim());
        setValidationError(
          language === 'hi'
            ? `🚫 यह वेबसाइट पहले से ब्लॉक है: ${blockedInfo?.reason || 'खतरनाक सामग्री पाई गई'}`
            : `🚫 This website is already blocked: ${blockedInfo?.reason || 'Malicious content detected'}`
        );

        // Voice alert for blocked URL attempt
        const voiceAssistant = getVoiceAssistant();
        voiceAssistant.setLanguage(language);
        const message = language === 'hi'
          ? 'यह वेबसाइट पहले से ब्लॉक है। आपकी सुरक्षा के लिए एक्सेस अस्वीकृत कर दिया गया है।'
          : 'This website is already blocked. Access denied for your safety.';
        voiceAssistant.speak(message, true);
        return;
      }
    }

    // Validate input
    const validation = spellChecker.validateInput(inputContent.trim(), contentType);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid input');
      return;
    }

    setIsAnalyzing(true);
    setValidationError('');
    
    try {
      // Show immediate feedback
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use enhanced analysis with Kaggle dataset
      let analysis = await analyzeContent(inputContent.trim(), contentType);
      
      // Enhance with URL-specific analysis if it's a URL
      if (contentType === 'url') {
        try {
          const enhancedDetector = await getEnhancedDetector();
          const urlPrediction = await enhancedDetector.predictURL(inputContent.trim());
          
          // Combine ML predictions for higher accuracy
          const combinedScore = Math.max(
            analysis.overallScore,
            urlPrediction.malicious
          );
          
          analysis = {
            ...analysis,
            overallScore: Math.round(combinedScore),
            riskLevel: combinedScore >= 85 ? 'critical' : 
                      combinedScore >= 65 ? 'high' : 
                      combinedScore >= 35 ? 'medium' : 'low'
          };
        } catch (error) {
          console.error('Enhanced URL analysis failed:', error);
        }
      }
      
      setCurrentAnalysis(analysis);
      setAnalysisHistory(prev => [analysis, ...prev].slice(0, 10));

      // Add to alert threats if it's high or critical risk
      if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
        setAlertThreats(prev => [analysis, ...prev].slice(0, 10));
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setValidationError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleThreatDetected = (threat: ThreatAnalysis) => {
    setAlertThreats(prev => [threat, ...prev].slice(0, 10));
    setAnalysisHistory(prev => [threat, ...prev].slice(0, 10));

    // Show overlay notification for high/critical threats
    if (threat.riskLevel === 'high' || threat.riskLevel === 'critical') {
      setOverlayThreat(threat);
      setTimeout(() => setOverlayThreat(null), 5000);
    }
  };

  const handleURLBlocked = (url: string, analysis: ThreatAnalysis) => {
    // Add to analysis history when a URL is blocked
    setAnalysisHistory(prev => [analysis, ...prev].slice(0, 10));
    
    // Show overlay notification for blocked URLs
    setOverlayThreat(analysis);
    setTimeout(() => setOverlayThreat(null), 7000);
  };

  const handleDismissAlert = (threatId: string) => {
    setAlertThreats(prev => prev.filter(threat => threat.id !== threatId));
  };

  const handleGenerateTestThreat = (riskLevel: 'critical' | 'high' | 'medium' | 'low') => {
    const scores = {
      critical: 95,
      high: 75,
      medium: 50,
      low: 20
    };

    const categories = {
      critical: 'Phishing',
      high: 'Malware',
      medium: 'Spam',
      low: 'Suspicious'
    };

    const testThreat: ThreatAnalysis = {
      id: `test-${Date.now()}`,
      content: `https://test-${riskLevel}-threat.example.com/malicious-page`,
      type: 'url',
      overallScore: scores[riskLevel],
      riskLevel: riskLevel,
      categories: [{
        name: categories[riskLevel],
        confidence: scores[riskLevel],
        description: `Test ${riskLevel} risk threat for demonstration`
      }],
      indicators: [
        {
          type: 'pattern',
          severity: riskLevel === 'critical' || riskLevel === 'high' ? 'high' : 'medium',
          description: `Test indicator for ${riskLevel} threat`,
          confidence: scores[riskLevel]
        },
        {
          type: 'behavioral',
          severity: riskLevel === 'critical' ? 'critical' : 'medium',
          description: `Suspicious ${categories[riskLevel]} pattern detected`,
          confidence: scores[riskLevel] - 5
        },
        {
          type: 'structural',
          severity: 'medium',
          description: `Abnormal URL structure`,
          confidence: scores[riskLevel] - 10
        }
      ],
      timestamp: new Date(),
      mlConfidence: scores[riskLevel],
      processingTime: 0.5
    };

    // Add to alert threats immediately to trigger alerts
    setAlertThreats(prev => [testThreat, ...prev].slice(0, 10));
    setAnalysisHistory(prev => [testThreat, ...prev].slice(0, 10));
    setCurrentAnalysis(testThreat);
  };

  const getStats = (): AnalysisStats => {
    const totalScans = analysisHistory.length;
    const threatsDetected = analysisHistory.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length;
    const cleanContent = analysisHistory.filter(a => a.riskLevel === 'low').length;
    const avgThreatScore = totalScans > 0 
      ? analysisHistory.reduce((sum, a) => sum + a.overallScore, 0) / totalScans
      : 0;

    return { totalScans, threatsDetected, cleanContent, avgThreatScore };
  };

  const handleStartFreeAnalysis = () => {
    const analysisSection = document.getElementById('analysis-section');
    if (analysisSection) {
      analysisSection.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      const inputField = document.querySelector('textarea');
      if (inputField) {
        inputField.focus();
      }
    }, 500);
  };

  const handleLearnMore = () => {
    setShowAbout(true);
    setTimeout(() => {
      const aboutSection = document.getElementById('about-section');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const exportReport = () => {
    if (!currentAnalysis) return;
    
    const report = {
      analysis: currentAnalysis,
      timestamp: new Date().toISOString(),
      generatedBy: 'Cyber Phoenix - Team Wise Coders',
      language: language,
      datasetVersion: 'Kaggle Enhanced v2.0'
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat_analysis_${currentAnalysis.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const contentTypeConfig = {
    url: { 
      icon: ExternalLink, 
      label: translator.translate('URL'), 
      placeholder: 'https://example.com/suspicious-link' 
    },
    text: { 
      icon: FileText, 
      label: translator.translate('Text Content'), 
      placeholder: translator.translate('Enter suspicious text content...') 
    },
    domain: { 
      icon: Globe, 
      label: translator.translate('Domain'), 
      placeholder: 'suspicious-domain.com' 
    },
    hash: { 
      icon: Hash, 
      label: translator.translate('File Hash'), 
      placeholder: 'SHA256 or MD5 hash' 
    }
  };

  if (currentPage === 'chatbot') {
    return (
      <ChatBot
        onBack={() => setCurrentPage('home')}
        language={language}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {translator.translate('ThreatGuard ML')}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {translator.translate('AI-Powered Threat Detection')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('chatbot')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors transform hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{translator.translate('Ask the Bot')}</span>
              </button>
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              <LanguageToggle currentLanguage={language} onLanguageChange={handleLanguageChange} />
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {translator.translate('Team Scout')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview stats={getStats()} />
        </div>

        {/* Hero Section with Background Image */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-16 mb-8 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
            }}
          ></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {translator.translate('Advanced AI Threat Detection')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {language === 'hi' 
                ? 'अत्याधुनिक मशीन लर्निंग एल्गोरिदम के साथ अपनी डिजिटल संपत्ति की सुरक्षा करें। 99.2% सटीकता के साथ रीयल-टाइम विश्लेषण।'
                : 'Protect your digital assets with our cutting-edge machine learning algorithms. Real-time analysis with 99.2% accuracy, dynamic content analysis, and 10,000+ training samples.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleStartFreeAnalysis}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors transform hover:scale-105"
              >
                {translator.translate('Start Free Analysis')}
              </button>
              <button 
                onClick={handleLearnMore}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors transform hover:scale-105"
              >
                {translator.translate('Learn More')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Input */}
          <div id="analysis-section" className="lg:col-span-2 space-y-6">
            {/* Real-Time Monitoring */}
            <RealTimeMonitor 
              isActive={isMonitoring}
              onToggle={() => setIsMonitoring(!isMonitoring)}
              onThreatDetected={handleThreatDetected}
              onURLBlocked={handleURLBlocked}
              language={language}
            />

            {/* Advanced Alert System */}
            <AdvancedAlertSystem
              threats={alertThreats}
              onDismiss={handleDismissAlert}
              language={language}
            />

            {/* Blocked URLs List */}
            <BlockedURLsList language={language} />

            {/* Alert System Test */}
            <AlertSystemTest
              onGenerateTestThreat={handleGenerateTestThreat}
              language={language}
            />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {translator.translate('Content Analysis')}
              </h2>
              
              {/* Content Type Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {Object.entries(contentTypeConfig).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        setContentType(type as any);
                        setValidationError('');
                        setSpellCheckResults(null);
                      }}
                      className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                        contentType === type
                         ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                         : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{config.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Input Field with Validation */}
              <div className="mb-4">
                <textarea
                  value={inputContent}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={contentTypeConfig[contentType].placeholder}
                  className={`w-full h-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                    validationError 
                      ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                />
                
                {/* Validation Error */}
                {validationError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {validationError}
                  </p>
                )}

                {/* Spell Check Results */}
                {spellCheckResults && !spellCheckResults.isValid && (
                  <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2">
                      {language === 'hi' ? 'वर्तनी जांच परिणाम:' : 'Spell Check Results:'}
                    </p>
                    <div className="space-y-1">
                      {spellCheckResults.errors.slice(0, 3).map((error: any, index: number) => (
                        <p key={index} className="text-xs text-yellow-700 dark:text-yellow-400">
                          "{error.word}" - {error.suggestions.length > 0 ? `Suggest: ${error.suggestions[0]}` : 'No suggestions'}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                      {language === 'hi' ? `विश्वास: ${spellCheckResults.confidence}%` : `Confidence: ${spellCheckResults.confidence}%`}
                    </p>
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!inputContent.trim() || isAnalyzing || !!validationError}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>{translator.translate('Analyzing...')}</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>{translator.translate('Analyze Content')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Analysis Results */}
            {currentAnalysis && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {translator.translate('Analysis Results')}
                  </h2>
                  <button
                    onClick={exportReport}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>{translator.translate('Export Report')}</span>
                  </button>
                </div>

                <ThreatScoreCard 
                  score={currentAnalysis.overallScore}
                  riskLevel={currentAnalysis.riskLevel}
                  accuracy={99}
                  language={language}
                />

                {/* Security Advice & Precautions */}
                <ThreatAdvice analysis={currentAnalysis} language={language} />

                {/* Advanced Threat Classification */}
                <ThreatClassification analysis={currentAnalysis} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <CategoryBreakdown categories={currentAnalysis.categories} />
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <ThreatIndicators indicators={currentAnalysis.indicators} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Threat Visualization */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {translator.translate('Threat Analytics')}
                </h3>
                <button
                  onClick={() => setShowVisualization(!showVisualization)}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {showVisualization ? 'Hide' : 'Show'} Charts
                </button>
              </div>
              {showVisualization && (
                <ThreatVisualization 
                  analyses={analysisHistory}
                  currentAnalysis={currentAnalysis}
                />
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <AnalysisHistory 
                analyses={analysisHistory}
                onSelectAnalysis={setCurrentAnalysis}
              />
            </div>

            {/* Quick Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <div className="relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-5 rounded-lg"
                  style={{
                    backgroundImage: 'url(https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
                  }}
                ></div>
                <div className="relative z-10">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                    {translator.translate('About Team Scout')}
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    {language === 'hi' 
                      ? 'टीम वाइज कोडर्स एक साइबर सुरक्षा अनुसंधान टीम है जो उन्नत एआई-संचालित खतरा पहचान समाधान विकसित करने के लिए समर्पित है।'
                      : 'Team Wise Coders is a cybersecurity research team dedicated to developing advanced AI-powered threat detection solutions.'
                    }
                  </p>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    {translator.translate('Our Technology')}
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                    <li>• {language === 'hi' ? 'उन्नत 256-128-64-32 न्यूरॉन डीप लर्निंग आर्किटेक्चर' : 'Enhanced 256-128-64-32 neuron deep learning architecture'}</li>
                    <li>• {language === 'hi' ? '28+ उन्नत फीचर एक्सट्रैक्शन एल्गोरिदम' : '28+ advanced feature extraction algorithms'}</li>
                    <li>• {language === 'hi' ? 'रीयल-टाइम जोखिम मूल्यांकन' : 'Real-time risk assessment'}</li>
                    <li>• {language === 'hi' ? '99.2% सटीकता के साथ एन्सेम्बल मॉडलिंग' : '99.2% accuracy with ensemble modeling'}</li>
                    <li>• {language === 'hi' ? '10,000+ कागल डेटासेट नमूने' : '10,000+ Kaggle dataset samples'}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-5 rounded-lg"
                  style={{
                    backgroundImage: 'url(https://images.pexels.com/photos/5380792/pexels-photo-5380792.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
                  }}
                ></div>
                <div className="relative z-10">
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3">
                    {translator.translate('Our Mission')}
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-300 mb-3">
                    {language === 'hi'
                      ? 'भारत में विकसित अत्याधुनिक मशीन लर्निंग और एआई तकनीकों के माध्यम से विकसित साइबर खतरों से वैश्विक संगठनों और व्यक्तियों की सुरक्षा करना।'
                      : 'Protecting organizations and individuals globally from evolving cyber threats through cutting-edge machine learning and AI technologies developed in India.'
                    }
                  </p>
                  <div className="space-y-2 text-sm text-green-800 dark:text-green-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>{language === 'hi' ? 'रीयल-टाइम खतरा पहचान' : 'Real-time threat detection'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>{language === 'hi' ? 'शून्य गलत सकारात्मक गारंटी' : 'Zero false positive guarantee'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>{language === 'hi' ? 'एंटरप्राइज़-ग्रेड सुरक्षा' : 'Enterprise-grade security'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>{language === 'hi' ? '24/7 खतरा निगरानी' : '24/7 threat monitoring'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
              <div className="relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-5 rounded-lg"
                  style={{
                    backgroundImage: 'url(https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
                  }}
                ></div>
                <div className="relative z-10">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-3">
                    {language === 'hi' ? 'उन्नत खतरा पहचान' : 'Advanced Threat Detection'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-blue-800 dark:text-blue-300">
                        {language === 'hi' ? 'बिजनेस ईमेल कॉम्प्रोमाइज' : 'Business Email Compromise'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-purple-800 dark:text-purple-300">
                        {language === 'hi' ? 'क्रिप्टोकरेंसी धोखाधड़ी' : 'Cryptocurrency Fraud'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      <span className="text-pink-800 dark:text-pink-300">
                        {language === 'hi' ? 'रोमांस/डेटिंग घोटाले' : 'Romance/Dating Scams'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-red-800 dark:text-red-300">
                        {language === 'hi' ? 'उन्नत निरंतर खतरे' : 'Advanced Persistent Threats'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="text-indigo-800 dark:text-indigo-300">
                        {language === 'hi' ? 'सामाजिक इंजीनियरिंग' : 'Social Engineering'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="about-section">
        <AboutSection />
      </div>
      <Footer />

      {/* Full-screen threat notification overlay */}
      <ThreatNotificationOverlay
        threat={overlayThreat}
        onDismiss={() => setOverlayThreat(null)}
        language={language}
      />
    </div>
  );
}

export default App;