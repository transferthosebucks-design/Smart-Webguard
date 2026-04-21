export interface ThreatAnalysis {
  id: string;
  content: string;
  type: 'url' | 'text' | 'domain' | 'hash';
  timestamp: Date;
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categories: ThreatCategory[];
  indicators: ThreatIndicator[];
  analysisVersion?: string;
  uniqueFactors?: string[];
}

export interface ThreatCategory {
  name: string;
  score: number;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  dynamicBoost?: number;
}

export interface ThreatIndicator {
  type: string;
  description: string;
  severity: 'info' | 'warning' | 'danger';
  matched: boolean;
  confidence?: number;
  timestamp?: Date;
}

export interface AnalysisStats {
  totalScans: number;
  threatsDetected: number;
  cleanContent: number;
  avgThreatScore: number;
}