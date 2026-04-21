import React, { useState, useEffect } from 'react';
import { ThreatAnalysis } from '../types/detection';
import { AlertTriangle, X, Bell, BellOff, Volume2, VolumeX, Settings } from 'lucide-react';

interface AlertSystemProps {
  threats: ThreatAnalysis[];
  onDismiss: (threatId: string) => void;
}

interface AlertSettings {
  enabled: boolean;
  soundEnabled: boolean;
  criticalOnly: boolean;
  browserNotifications: boolean;
  autoHide: boolean;
  hideDelay: number;
}

export function AlertSystem({ threats, onDismiss }: AlertSystemProps) {
  const [settings, setSettings] = useState<AlertSettings>({
    enabled: true,
    soundEnabled: true,
    criticalOnly: false,
    browserNotifications: true,
    autoHide: true,
    hideDelay: 5000
  });
  const [showSettings, setShowSettings] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<ThreatAnalysis[]>([]);

  useEffect(() => {
    if (!settings.enabled) return;

    const newThreats = threats.filter(threat => {
      const isNewThreat = !activeAlerts.some(alert => alert.id === threat.id);
      const meetsThreshold = settings.criticalOnly 
        ? threat.riskLevel === 'critical' 
        : threat.riskLevel === 'high' || threat.riskLevel === 'critical';
      
      return isNewThreat && meetsThreshold;
    });

    if (newThreats.length > 0) {
      setActiveAlerts(prev => [...newThreats, ...prev].slice(0, 5));
      
      newThreats.forEach(threat => {
        // Play alert sound
        if (settings.soundEnabled) {
          playAlertSound(threat.riskLevel);
        }
        
        // Show browser notification
        if (settings.browserNotifications && Notification.permission === 'granted') {
          showBrowserNotification(threat);
        }
        
        // Auto-hide alert
        if (settings.autoHide) {
          setTimeout(() => {
            onDismiss(threat.id);
            setActiveAlerts(prev => prev.filter(alert => alert.id !== threat.id));
          }, settings.hideDelay);
        }
      });
    }
  }, [threats, settings]);

  const playAlertSound = (riskLevel: string) => {
    // Create audio context for alert sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different risk levels
    const frequency = riskLevel === 'critical' ? 800 : 600;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const showBrowserNotification = (threat: ThreatAnalysis) => {
    const notification = new Notification(`🚨 ${threat.riskLevel.toUpperCase()} Threat Detected!`, {
      body: `${threat.categories[0]?.name || 'Unknown threat'}: ${threat.content.substring(0, 100)}...`,
      icon: '/vite.svg',
      tag: threat.id,
      requireInteraction: threat.riskLevel === 'critical'
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setSettings(prev => ({ ...prev, browserNotifications: permission === 'granted' }));
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getAlertIcon = (riskLevel: string) => {
    return riskLevel === 'critical' ? '🚨' : '⚠️';
  };

  return (
    <div className="space-y-4">
      {/* Alert Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Alert System</h3>
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
                <span className="text-sm text-gray-700 dark:text-gray-300">Enable Alerts</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sound Alerts</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.criticalOnly}
                  onChange={(e) => setSettings(prev => ({ ...prev, criticalOnly: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Critical Only</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.browserNotifications}
                  onChange={(e) => {
                    if (e.target.checked) {
                      requestNotificationPermission();
                    } else {
                      setSettings(prev => ({ ...prev, browserNotifications: false }));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Browser Notifications</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.autoHide}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoHide: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Auto-hide alerts</span>
              </label>
              
              {settings.autoHide && (
                <select
                  value={settings.hideDelay}
                  onChange={(e) => setSettings(prev => ({ ...prev, hideDelay: Number(e.target.value) }))}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value={3000}>3 seconds</option>
                  <option value={5000}>5 seconds</option>
                  <option value={10000}>10 seconds</option>
                  <option value={30000}>30 seconds</option>
                </select>
              )}
            </div>
          </div>
        )}

        {/* Alert Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {settings.enabled ? (
              <Bell className="h-4 w-4 text-green-600" />
            ) : (
              <BellOff className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {settings.enabled ? 'Alerts Active' : 'Alerts Disabled'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {settings.soundEnabled ? (
              <Volume2 className="h-4 w-4 text-blue-600" />
            ) : (
              <VolumeX className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-xs text-gray-500">
              {activeAlerts.length} active alerts
            </span>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {settings.enabled && activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map((threat) => (
            <div
              key={threat.id}
              className={`border-l-4 rounded-lg p-4 shadow-lg animate-slide-in ${getRiskColor(threat.riskLevel)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getAlertIcon(threat.riskLevel)}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {threat.riskLevel.toUpperCase()} Threat Detected
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {threat.categories[0]?.name || 'Unknown threat type'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {threat.content.substring(0, 80)}...
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Score: {threat.overallScore}</span>
                      <span>Time: {threat.timestamp.toLocaleTimeString()}</span>
                      <span>Categories: {threat.categories.length}</span>
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
          ))}
        </div>
      )}

      {/* Alert Statistics */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Alert Statistics</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-red-600">{threats.filter(t => t.riskLevel === 'critical').length}</p>
            <p className="text-xs text-gray-500">Critical Alerts</p>
          </div>
          <div>
            <p className="text-lg font-bold text-orange-600">{threats.filter(t => t.riskLevel === 'high').length}</p>
            <p className="text-xs text-gray-500">High Risk Alerts</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-600">{activeAlerts.length}</p>
            <p className="text-xs text-gray-500">Active Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
}