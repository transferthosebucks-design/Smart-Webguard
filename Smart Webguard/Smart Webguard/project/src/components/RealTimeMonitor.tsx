import { useState, useEffect } from 'react';
import { Shield, Eye, AlertTriangle, Activity, Globe, Clock } from 'lucide-react';
import { getRealTimeMonitor, URLMonitoringEvent } from '../utils/realTimeURLMonitor';
import { ThreatAnalysis } from '../types/detection';
import { getTranslator } from '../utils/hindiTranslator';

interface RealTimeMonitorProps {
  isActive: boolean;
  onToggle: () => void;
  onThreatDetected: (threat: ThreatAnalysis) => void;
  language: 'en' | 'hi';
  onURLBlocked?: (url: string, analysis: ThreatAnalysis) => void;
}

interface MonitoringStats {
  urlsScanned: number;
  threatsBlocked: number;
  activeTime: number;
  lastThreat: Date | null;
}

export function RealTimeMonitor({ isActive, onToggle, onThreatDetected, language, onURLBlocked }: RealTimeMonitorProps) {
  const translator = getTranslator();
  const [stats, setStats] = useState<MonitoringStats>({
    urlsScanned: 0,
    threatsBlocked: 0,
    activeTime: 0,
    lastThreat: null
  });
  const [currentUrl, setCurrentUrl] = useState('');
  const [recentThreats, setRecentThreats] = useState<ThreatAnalysis[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [realTimeMonitor] = useState(() => getRealTimeMonitor());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      // Start real-time URL monitoring
      realTimeMonitor.startMonitoring();
      
      // Update active time counter
      interval = setInterval(() => {
        setStats(prev => ({ ...prev, activeTime: prev.activeTime + 1 }));
      }, 1000);
    } else {
      // Stop real-time URL monitoring
      realTimeMonitor.stopMonitoring();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, realTimeMonitor]);

  // Set up event listeners for the real-time monitor
  useEffect(() => {
    const handleThreatDetected = (event: URLMonitoringEvent) => {
      if (event.type === 'threat_detected' && event.analysis) {
        const analysis = event.analysis;
        
        setStats(prev => ({
          ...prev,
          urlsScanned: prev.urlsScanned + 1,
          threatsBlocked: analysis.riskLevel === 'high' || analysis.riskLevel === 'critical' 
            ? prev.threatsBlocked + 1 
            : prev.threatsBlocked,
          lastThreat: analysis.riskLevel === 'high' || analysis.riskLevel === 'critical' 
            ? new Date() 
            : prev.lastThreat
        }));

        if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
          setRecentThreats(prev => [analysis, ...prev].slice(0, 5));
          onThreatDetected(analysis);
          
          // Show browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification(translator.translate('Threat Detected!'), {
              body: `${analysis.riskLevel.toUpperCase()} ${translator.translate('risk detected')}: ${analysis.content.substring(0, 50)}...`,
              icon: '/vite.svg'
            });
          }
        }
      }
    };

    const handleURLBlocked = (event: URLMonitoringEvent) => {
      if (event.type === 'url_blocked' && event.analysis && onURLBlocked) {
        onURLBlocked(event.url, event.analysis);
      }
    };

    const handleMonitoringEvent = (event: URLMonitoringEvent) => {
      if (event.type === 'monitoring_started' || event.type === 'monitoring_stopped') {
        setIsScanning(event.type === 'monitoring_started');
      }
    };

    // Add event listeners
    realTimeMonitor.addEventListener('threat_detected', handleThreatDetected);
    realTimeMonitor.addEventListener('url_blocked', handleURLBlocked);
    realTimeMonitor.addEventListener('monitoring_started', handleMonitoringEvent);
    realTimeMonitor.addEventListener('monitoring_stopped', handleMonitoringEvent);

    // Update current URL periodically
    const urlInterval = setInterval(() => {
      setCurrentUrl(realTimeMonitor.getCurrentURL());
    }, 1000);

    return () => {
      // Clean up event listeners
      realTimeMonitor.removeEventListener('threat_detected', handleThreatDetected);
      realTimeMonitor.removeEventListener('url_blocked', handleURLBlocked);
      realTimeMonitor.removeEventListener('monitoring_started', handleMonitoringEvent);
      realTimeMonitor.removeEventListener('monitoring_stopped', handleMonitoringEvent);
      
      if (urlInterval) clearInterval(urlInterval);
    };
  }, [realTimeMonitor, onThreatDetected, onURLBlocked, translator]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
            <Eye className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {translator.translate('Real-Time Monitoring')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isActive 
                ? translator.translate('Actively monitoring browsing activity')
                : translator.translate('Monitoring disabled')
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isScanning && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-sm">{translator.translate('scanning')}</span>
            </div>
          )}
          <button
            onClick={() => {
              onToggle();
              if (!isActive) {
                requestNotificationPermission();
              }
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isActive 
              ? translator.translate('Stop Monitoring') 
              : translator.translate('Start Monitoring')
            }
          </button>
        </div>
      </div>

      {/* Monitoring Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {translator.translate('URLs Scanned')}
              </p>
              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{stats.urlsScanned}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm text-red-600 dark:text-red-400">
                {translator.translate('Threats Blocked')}
              </p>
              <p className="text-xl font-bold text-red-700 dark:text-red-300">{stats.threatsBlocked}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">
                {translator.translate('Active Time')}
              </p>
              <p className="text-xl font-bold text-green-700 dark:text-green-300">{formatTime(stats.activeTime)}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                {translator.translate('Last Threat')}
              </p>
              <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                {stats.lastThreat ? stats.lastThreat.toLocaleTimeString() : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current URL Being Scanned */}
      {isActive && currentUrl && (
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {translator.translate('Currently Scanning:')}
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono break-all">
              {currentUrl}
            </span>
          </div>
        </div>
      )}

      {/* Recent Threats */}
      {recentThreats.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">
            {language === 'hi' ? 'हाल में पाए गए खतरे' : 'Recent Threats Detected'}
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentThreats.map((threat) => (
              <div key={threat.id} className={`border rounded-lg p-3 ${getRiskColor(threat.riskLevel)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {translator.translate(`${threat.riskLevel.charAt(0).toUpperCase() + threat.riskLevel.slice(1)} Risk`)}
                    </span>
                  </div>
                  <span className="text-xs">{threat.timestamp.toLocaleTimeString()}</span>
                </div>
                <p className="text-xs mt-1 opacity-80">
                  {threat.content.substring(0, 60)}...
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs">
                    {language === 'hi' ? 'स्कोर' : 'Score'}: {threat.overallScore}
                  </span>
                  <span className="text-xs">
                    {threat.categories.length} {language === 'hi' ? 'श्रेणियां पाईं' : 'categories detected'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monitoring Status */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-gray-600 dark:text-gray-400">
              {language === 'hi' ? 'स्थिति' : 'Status'}: {isActive 
                ? (language === 'hi' ? 'सक्रिय सुरक्षा' : 'Active Protection')
                : (language === 'hi' ? 'निगरानी अक्षम' : 'Monitoring Disabled')
              }
            </span>
          </div>
          <span className="text-gray-500 dark:text-gray-400">
            {language === 'hi' ? 'अगला स्कैन' : 'Next scan in'}: {isActive ? '2s' : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}