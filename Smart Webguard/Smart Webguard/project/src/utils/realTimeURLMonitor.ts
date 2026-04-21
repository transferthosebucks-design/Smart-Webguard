import { ThreatAnalysis } from '../types/detection';
import { analyzeContent } from './mlDetection';
import { getURLBlocker } from './urlBlocker';

export interface URLMonitoringConfig {
  enabled: boolean;
  checkInterval: number; // milliseconds
  threatThreshold: number; // score above which to block
  enableBlocking: boolean;
  enableAlerts: boolean;
}

export interface URLMonitoringEvent {
  type: 'threat_detected' | 'url_blocked' | 'monitoring_started' | 'monitoring_stopped';
  url: string;
  analysis?: ThreatAnalysis;
  timestamp: Date;
}

export class RealTimeURLMonitor {
  private config: URLMonitoringConfig;
  private isMonitoring: boolean = false;
  private currentURL: string = '';
  private lastCheckedURL: string = '';
  private monitoringInterval: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, ((event: URLMonitoringEvent) => void)[]> = new Map();

  constructor(config: Partial<URLMonitoringConfig> = {}) {
    this.config = {
      enabled: true,
      checkInterval: 2000, // Check every 2 seconds
      threatThreshold: 70,
      enableBlocking: true,
      enableAlerts: true,
      ...config
    };
  }

  // Start monitoring the current browser URL
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.emitEvent({
      type: 'monitoring_started',
      url: '',
      timestamp: new Date()
    });

    // Start periodic URL checking
    this.monitoringInterval = setInterval(async () => {
      await this.checkCurrentURL();
    }, this.config.checkInterval);

    // Initial check
    await this.checkCurrentURL();
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.emitEvent({
      type: 'monitoring_stopped',
      url: '',
      timestamp: new Date()
    });
  }

  // Check the current browser URL for threats
  private async checkCurrentURL(): Promise<void> {
    try {
      const currentURL = this.getCurrentBrowserURL();
      
      // Skip if URL hasn't changed or is invalid
      if (!currentURL || currentURL === this.lastCheckedURL || !this.isValidURL(currentURL)) {
        return;
      }

      this.currentURL = currentURL;
      this.lastCheckedURL = currentURL;

      // Check if URL is already blocked
      const urlBlocker = getURLBlocker();
      if (urlBlocker.isBlocked(currentURL)) {
        return;
      }

      // Analyze the URL for threats
      const analysis = await analyzeContent(currentURL, 'url');

      // Emit threat detected event
      this.emitEvent({
        type: 'threat_detected',
        url: currentURL,
        analysis,
        timestamp: new Date()
      });

      // Block URL if threat score exceeds threshold
      if (analysis.overallScore >= this.config.threatThreshold && this.config.enableBlocking) {
        this.blockURL(currentURL, analysis);
      }

    } catch (error) {
      console.error('Error checking current URL:', error);
    }
  }

  // Get the current browser URL
  private getCurrentBrowserURL(): string {
    try {
      // Get the current page URL
      if (typeof window !== 'undefined' && window.location) {
        return window.location.href;
      }
    } catch (error) {
      console.warn('Could not access window.location:', error);
    }
    
    return '';
  }

  // Validate URL format
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Block a malicious URL
  private blockURL(url: string, analysis: ThreatAnalysis): void {
    const urlBlocker = getURLBlocker();
    const category = analysis.categories[0]?.name || 'Unknown Threat';
    const reason = `${category} - Risk Score: ${analysis.overallScore}`;

    urlBlocker.blockURL(url, reason, analysis.overallScore, category);

    this.emitEvent({
      type: 'url_blocked',
      url,
      analysis,
      timestamp: new Date()
    });

    // Redirect to warning page if blocking is enabled
    if (this.config.enableBlocking) {
      this.redirectToWarningPage(url, analysis);
    }
  }

  // Redirect to warning page
  private redirectToWarningPage(url: string, analysis: ThreatAnalysis): void {
    // Create warning page URL with analysis data
    const warningData = {
      blockedUrl: url,
      threatScore: analysis.overallScore,
      riskLevel: analysis.riskLevel,
      category: analysis.categories[0]?.name || 'Unknown',
      timestamp: analysis.timestamp.toISOString()
    };

    const warningURL = `/warning-page?data=${encodeURIComponent(JSON.stringify(warningData))}`;
    
    // In a real browser extension, this would redirect the current tab
    // For this demo, we'll just show an alert
    this.showWarningPopup(url, analysis);
  }

  // Show warning popup
  private showWarningPopup(url: string, analysis: ThreatAnalysis): void {
    // Create a custom warning modal
    const warningModal = document.createElement('div');
    warningModal.id = 'malicious-url-warning';
    warningModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    warningModal.innerHTML = `
      <div style="background: white; border-radius: 12px; padding: 32px; max-width: 500px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <div style="width: 48px; height: 48px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
            <svg width="24" height="24" fill="none" stroke="#dc2626" stroke-width="2">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h2 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 700;">⚠️ Malicious Website Detected</h2>
            <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 14px;">This website has been blocked for your safety</p>
          </div>
        </div>
        
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">Threat Details:</div>
          <div style="font-size: 14px; color: #78350f;">
            <div><strong>URL:</strong> ${url.substring(0, 60)}${url.length > 60 ? '...' : ''}</div>
            <div><strong>Risk Level:</strong> ${analysis.riskLevel.toUpperCase()}</div>
            <div><strong>Threat Score:</strong> ${analysis.overallScore}/100</div>
            <div><strong>Category:</strong> ${analysis.categories[0]?.name || 'Unknown'}</div>
          </div>
        </div>
        
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button id="ignore-warning" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">
            Ignore Warning
          </button>
          <button id="go-back" style="background: #dc2626; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">
            Go Back to Safety
          </button>
        </div>
      </div>
    `;

    // Add event listeners
    const ignoreBtn = warningModal.querySelector('#ignore-warning') as HTMLButtonElement;
    const goBackBtn = warningModal.querySelector('#go-back') as HTMLButtonElement;

    ignoreBtn.addEventListener('click', () => {
      document.body.removeChild(warningModal);
    });

    goBackBtn.addEventListener('click', () => {
      document.body.removeChild(warningModal);
      // In a real extension, this would go back to the previous page
      window.history.back();
    });

    // Add to page
    document.body.appendChild(warningModal);
  }

  // Event listener management
  addEventListener(event: string, callback: (event: URLMonitoringEvent) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: (event: URLMonitoringEvent) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emitEvent(event: URLMonitoringEvent): void {
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  // Configuration management
  updateConfig(newConfig: Partial<URLMonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart monitoring if interval changed
    if (this.isMonitoring && newConfig.checkInterval) {
      this.stopMonitoring();
      this.startMonitoring();
    }
  }

  getConfig(): URLMonitoringConfig {
    return { ...this.config };
  }

  // Status methods
  isActive(): boolean {
    return this.isMonitoring;
  }

  getCurrentURL(): string {
    return this.currentURL;
  }

  // Cleanup
  destroy(): void {
    this.stopMonitoring();
    this.eventListeners.clear();
  }
}

// Singleton instance
let realTimeMonitor: RealTimeURLMonitor | null = null;

export function getRealTimeMonitor(config?: Partial<URLMonitoringConfig>): RealTimeURLMonitor {
  if (!realTimeMonitor) {
    realTimeMonitor = new RealTimeURLMonitor(config);
  }
  return realTimeMonitor;
}
