import React from 'react';
import { ThreatAnalysis } from '../types/detection';
import { Clock, ExternalLink, FileText, Globe, Hash } from 'lucide-react';

interface AnalysisHistoryProps {
  analyses: ThreatAnalysis[];
  onSelectAnalysis: (analysis: ThreatAnalysis) => void;
}

export function AnalysisHistory({ analyses, onSelectAnalysis }: AnalysisHistoryProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'url': return ExternalLink;
      case 'domain': return Globe;
      case 'hash': return Hash;
      default: return FileText;
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

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  const truncateContent = (content: string, maxLength: number = 50) => {
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  if (analyses.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-8 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Analysis History</h3>
        <p className="text-gray-600 dark:text-gray-300">Start analyzing content to see your history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Analyses</h3>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {analyses.map((analysis) => {
          const TypeIcon = getTypeIcon(analysis.type);
          const riskColorClasses = getRiskColor(analysis.riskLevel);
          
          return (
            <div
              key={analysis.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => onSelectAnalysis(analysis)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <TypeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {truncateContent(analysis.content)}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(analysis.timestamp)}</span>
                      </span>
                      <span className="capitalize">{analysis.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${riskColorClasses}`}>
                    {analysis.riskLevel.toUpperCase()}
                  </span>
                  <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    {analysis.overallScore}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}