import React, { useState, useEffect, useRef } from 'react';
import { ThreatAnalysis } from '../types/detection';
import { AlertTriangle, X, Bell, BellOff, Volume2, VolumeX, Settings, Shield, Zap, Eye, Activity, ShieldAlert, Ban } from 'lucide-react';
import { getTranslator } from '../utils/hindiTranslator';
import { getVoiceAssistant } from '../utils/voiceAssistant';
import { getURLBlocker } from '../utils/urlBlocker';

interface AdvancedAlertSystemProps {
  threats: ThreatAnalysis[];
  onDismiss: (threatId: string) => void;
  language: 'en' | 'hi';
}

interface AlertSettings {
  enabled: boolean;
  soundEnabled: boolean;
  criticalOnly: boolean;
  browserNotifications: boolean;
  autoHide: boolean;
  hideDelay: number;
  vibrationEnabled: boolean;
  emailAlerts: boolean;
  alertThreshold: number;
  voiceEnabled: boolean;
  autoBlockEnabled: boolean;
}

interface AlertSound {
  frequency: number;
  duration: number;
  type: OscillatorType;
}

export function AdvancedAlertSystem({ threats, onDismiss, language }: AdvancedAlertSystemProps) {
  const translator = getTranslator();
  const [settings, setSettings] = useState<AlertSettings>({
    enabled: true,
    soundEnabled: true,
    criticalOnly: false,
    browserNotifications: true,
    autoHide: true,
    hideDelay: 5000,
    vibrationEnabled: true,
    emailAlerts: false,
    alertThreshold: 70,
    voiceEnabled: true,
    autoBlockEnabled: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<ThreatAnalysis[]>([]);
  const [alertHistory, setAlertHistory] = useState<ThreatAnalysis[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    translator.setLanguage(language);
  }, [language]);

  useEffect(() => {
    if (!settings.enabled) return;

    const newThreats = threats.filter(threat => {
      const isNewThreat = !activeAlerts.some(alert => alert.id === threat.id);
      const meetsThreshold = threat.overallScore >= settings.alertThreshold;
      const meetsRiskLevel = settings.criticalOnly
        ? threat.riskLevel === 'critical'
        : threat.riskLevel === 'high' || threat.riskLevel === 'critical';

      return isNewThreat && meetsThreshold && meetsRiskLevel;
    });

    if (newThreats.length > 0) {
      setActiveAlerts(prev => [...newThreats, ...prev].slice(0, 10));
      setAlertHistory(prev => [...newThreats, ...prev].slice(0, 50));

      newThreats.forEach(threat => {
        handleNewThreat(threat);
      });
    }
  }, [threats, settings.enabled, settings.alertThreshold, settings.criticalOnly]);

  const handleNewThreat = async (threat: ThreatAnalysis) => {
    // Voice Assistant Alert - Speaks threat details
    if (settings.voiceEnabled) {
      const voiceAssistant = getVoiceAssistant();
      voiceAssistant.setLanguage(language);
      voiceAssistant.speakThreatAlert(
        threat.riskLevel,
        threat.categories[0]?.name || 'Unknown',
        threat.overallScore,
        threat.type === 'url' ? threat.content : undefined
      );
    }

    // Auto-block malicious URLs
    if (settings.autoBlockEnabled && (threat.riskLevel === 'critical' || threat.riskLevel === 'high')) {
      if (threat.type === 'url') {
        const urlBlocker = getURLBlocker();
        urlBlocker.blockURL(
          threat.content,
          `${threat.riskLevel.toUpperCase()} threat detected: ${threat.categories[0]?.name || 'Unknown'}`,
          threat.overallScore,
          threat.categories[0]?.name || 'Unknown'
        );

        // Show blocking notification
        if (settings.browserNotifications && Notification.permission === 'granted') {
          const blockNotification = new Notification(
            language === 'hi' ? '🚫 वेबसाइट ब्लॉक कर दी गई' : '🚫 Website Blocked',
            {
              body: language === 'hi'
                ? `यह वेबसाइट आपकी सुरक्षा के लिए ब्लॉक कर दी गई है। खतरा स्कोर: ${threat.overallScore}`
                : `This website has been blocked for your safety. Threat Score: ${threat.overallScore}`,
              icon: '/vite.svg',
              tag: `block-${threat.id}`,
              requireInteraction: true
            }
          );
          setTimeout(() => blockNotification.close(), 8000);
        }
      }
    }

    // Advanced alert sound
    if (settings.soundEnabled) {
      await playAdvancedAlertSound(threat.riskLevel);
    }

    // Vibration for mobile devices
    if (settings.vibrationEnabled && 'vibrate' in navigator) {
      const pattern = threat.riskLevel === 'critical' ? [200, 100, 200, 100, 200] : [200, 100, 200];
      navigator.vibrate(pattern);
    }

    // Browser notification with Hindi support
    if (settings.browserNotifications && Notification.permission === 'granted') {
      showAdvancedNotification(threat);
    }

    // Auto-hide with custom delay
    if (settings.autoHide) {
      setTimeout(() => {
        onDismiss(threat.id);
        setActiveAlerts(prev => prev.filter(alert => alert.id !== threat.id));
      }, settings.hideDelay);
    }
  };

  const playAdvancedAlertSound = async (riskLevel: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      // Different sound patterns for different risk levels
      const soundConfig: Record<string, AlertSound> = {
        critical: { frequency: 1000, duration: 1000, type: 'sawtooth' },
        high: { frequency: 800, duration: 600, type: 'square' },
        medium: { frequency: 600, duration: 400, type: 'sine' },
        low: { frequency: 400, duration: 200, type: 'triangle' }
      };

      const config = soundConfig[riskLevel] || { frequency: 500, duration: 300, type: 'sine' };

      // Create complex alert sound
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filterNode = audioContext.createBiquadFilter();
      
      oscillator1.connect(filterNode);
      oscillator2.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure oscillators
      oscillator1.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
      oscillator2.frequency.setValueAtTime(config.frequency * 1.5, audioContext.currentTime);
      oscillator1.type = config.type;
      oscillator2.type = 'sine';
      
      // Configure filter
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, audioContext.currentTime);
      
      // Configure gain envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration / 1000);
      
      // Start and stop
      const startTime = audioContext.currentTime;
      const endTime = startTime + config.duration / 1000;
      
      oscillator1.start(startTime);
      oscillator2.start(startTime);
      oscillator1.stop(endTime);
      oscillator2.stop(endTime);
      
      // Add frequency modulation for critical alerts
      if (riskLevel === 'critical') {
        oscillator1.frequency.linearRampToValueAtTime(config.frequency * 1.5, endTime);
      }
      
    } catch (error) {
      console.error('Failed to play alert sound:', error);
    }
  };

  const showAdvancedNotification = (threat: ThreatAnalysis) => {
    const title = translator.translateAlertMessage(threat.riskLevel, threat.categories[0]?.name || 'Unknown');

    let body = `${translator.translate('Risk Score')}: ${threat.overallScore}\n`;
    body += `${language === 'hi' ? 'श्रेणी' : 'Category'}: ${threat.categories[0]?.name || 'Unknown'}\n`;

    // Add threat details
    if (threat.indicators.length > 0) {
      body += `\n${language === 'hi' ? 'खतरे के संकेत' : 'Threat Indicators'}:\n`;
      threat.indicators.slice(0, 3).forEach(indicator => {
        body += `• ${indicator.description}\n`;
      });
    }

    // Show blocked status for high/critical threats
    if (settings.autoBlockEnabled && (threat.riskLevel === 'critical' || threat.riskLevel === 'high')) {
      body += `\n${language === 'hi' ? '⚠️ यह साइट ब्लॉक कर दी गई है' : '⚠️ This site has been blocked'}`;
    }

    const notification = new Notification(title, {
      body,
      icon: '/vite.svg',
      tag: threat.id,
      requireInteraction: threat.riskLevel === 'critical',
      silent: false
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      // Scroll to threat details
      const element = document.getElementById(`threat-${threat.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Auto-close after delay
    setTimeout(() => {
      notification.close();
    }, settings.hideDelay);
  };

  const requestAdvancedPermissions = async () => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setSettings(prev => ({ ...prev, browserNotifications: permission === 'granted' }));
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getAlertIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '🔍';
    }
  };

  const getThreatIcon = (categoryName: string) => {
    switch (categoryName?.toLowerCase()) {
      case 'phishing': return Eye;
      case 'malware': return Zap;
      case 'spam': return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <div className="space-y-4">
      {/* Advanced Alert Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {translator.translate('Alert System')}
            </h3>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full">
              Advanced
            </span>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {showSettings && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {translator.translate('Enable Alerts')}
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {translator.translate('Sound Alerts')}
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.vibrationEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, vibrationEnabled: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {language === 'hi' ? 'कंपन अलर्ट' : 'Vibration Alerts'}
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.browserNotifications}
                  onChange={(e) => {
                    if (e.target.checked) {
                      requestAdvancedPermissions();
                    } else {
                      setSettings(prev => ({ ...prev, browserNotifications: false }));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {translator.translate('Browser Notifications')}
                </span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={(e) => {
                    setSettings(prev => ({ ...prev, voiceEnabled: e.target.checked }));
                    if (e.target.checked) {
                      const voiceAssistant = getVoiceAssistant();
                      voiceAssistant.setLanguage(language);
                      voiceAssistant.testVoice();
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-1">
                  <Volume2 className="h-3 w-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {language === 'hi' ? 'वॉयस अलर्ट' : 'Voice Alerts'}
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.autoBlockEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoBlockEnabled: e.target.checked }))}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <div className="flex items-center space-x-1">
                  <Ban className="h-3 w-3" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {language === 'hi' ? 'ऑटो-ब्लॉक सक्षम' : 'Auto-Block Enabled'}
                  </span>
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  {language === 'hi' ? 'अलर्ट थ्रेशोल्ड:' : 'Alert Threshold:'}
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={settings.alertThreshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, alertThreshold: Number(e.target.value) }))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {settings.alertThreshold}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.autoHide}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoHide: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {translator.translate('Auto-hide alerts')}
                  </span>
                </label>
                
                {settings.autoHide && (
                  <select
                    value={settings.hideDelay}
                    onChange={(e) => setSettings(prev => ({ ...prev, hideDelay: Number(e.target.value) }))}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value={3000}>{language === 'hi' ? '3 सेकंड' : '3 seconds'}</option>
                    <option value={5000}>{language === 'hi' ? '5 सेकंड' : '5 seconds'}</option>
                    <option value={10000}>{language === 'hi' ? '10 सेकंड' : '10 seconds'}</option>
                    <option value={30000}>{language === 'hi' ? '30 सेकंड' : '30 seconds'}</option>
                  </select>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Alert Status Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {language === 'hi' ? 'स्थिति' : 'Status'}
                </p>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  {settings.enabled ? (language === 'hi' ? 'सक्रिय' : 'Active') : (language === 'hi' ? 'निष्क्रिय' : 'Inactive')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {translator.translate('Critical Alerts')}
                </p>
                <p className="text-sm font-bold text-red-700 dark:text-red-300">
                  {threats.filter(t => t.riskLevel === 'critical').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  {translator.translate('High Risk Alerts')}
                </p>
                <p className="text-sm font-bold text-orange-700 dark:text-orange-300">
                  {threats.filter(t => t.riskLevel === 'high').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {translator.translate('Active Alerts')}
                </p>
                <p className="text-sm font-bold text-green-700 dark:text-green-300">
                  {activeAlerts.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts with Enhanced Display */}
      {settings.enabled && activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'hi' ? 'सक्रिय अलर्ट' : 'Active Alerts'}
          </h4>
          {activeAlerts.map((threat) => {
            const ThreatIcon = getThreatIcon(threat.categories[0]?.name || 'Unknown');
            return (
              <div
                key={threat.id}
                id={`threat-${threat.id}`}
                className={`border-l-4 rounded-lg p-4 shadow-lg animate-slide-in ${getRiskColor(threat.riskLevel)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getAlertIcon(threat.riskLevel)}</span>
                      <ThreatIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {translator.translate(`${threat.riskLevel.charAt(0).toUpperCase() + threat.riskLevel.slice(1)} Risk`)}
                        </h4>
                        <span className="px-2 py-1 bg-white bg-opacity-50 text-xs font-medium rounded">
                          {language === 'hi' ? 'स्कोर' : 'Score'}: {threat.overallScore}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {translator.translateThreatDescription(threat.categories[0]?.name || 'Unknown', threat.riskLevel)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                        {threat.content.substring(0, 120)}...
                      </p>

                      {/* Show blocked status */}
                      {settings.autoBlockEnabled && (threat.riskLevel === 'critical' || threat.riskLevel === 'high') && threat.type === 'url' && (
                        <div className="flex items-center space-x-2 mb-3 px-3 py-2 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded">
                          <Ban className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <span className="text-xs font-bold text-red-700 dark:text-red-300">
                            {language === 'hi' ? '⚠️ वेबसाइट ब्लॉक कर दी गई है' : '⚠️ Website Blocked'}
                          </span>
                        </div>
                      )}
                      
                      {/* Enhanced Alert Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <div className="bg-white bg-opacity-30 rounded p-2">
                          <span className="font-medium">{language === 'hi' ? 'समय' : 'Time'}:</span>
                          <br />
                          {threat.timestamp.toLocaleTimeString()}
                        </div>
                        <div className="bg-white bg-opacity-30 rounded p-2">
                          <span className="font-medium">{language === 'hi' ? 'प्रकार' : 'Type'}:</span>
                          <br />
                          {threat.type.toUpperCase()}
                        </div>
                        <div className="bg-white bg-opacity-30 rounded p-2">
                          <span className="font-medium">{language === 'hi' ? 'श्रेणियां' : 'Categories'}:</span>
                          <br />
                          {threat.categories.length}
                        </div>
                        <div className="bg-white bg-opacity-30 rounded p-2">
                          <span className="font-medium">{language === 'hi' ? 'संकेतक' : 'Indicators'}:</span>
                          <br />
                          {threat.indicators.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      onDismiss(threat.id);
                      setActiveAlerts(prev => prev.filter(alert => alert.id !== threat.id));
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Alert History */}
      {alertHistory.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {language === 'hi' ? 'अलर्ट इतिहास' : 'Alert History'}
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {alertHistory.slice(0, 10).map((threat) => (
              <div key={threat.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span>{getAlertIcon(threat.riskLevel)}</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {threat.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="font-medium">
                    {threat.categories[0]?.name || 'Unknown'}
                  </span>
                </div>
                <span className="font-bold">{threat.overallScore}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}