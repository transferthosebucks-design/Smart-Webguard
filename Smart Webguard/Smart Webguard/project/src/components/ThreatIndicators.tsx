import React from 'react';
import { ThreatIndicator } from '../types/detection';
import { Info, AlertTriangle, XCircle } from 'lucide-react';

interface ThreatIndicatorsProps {
  indicators: ThreatIndicator[];
}

export function ThreatIndicators({ indicators }: ThreatIndicatorsProps) {
  const getIndicatorIcon = (severity: string) => {
    switch (severity) {
      case 'danger': return XCircle;
      case 'warning': return AlertTriangle;
      default: return Info;
    }
  };

  const getIndicatorColor = (severity: string) => {
    switch (severity) {
      case 'danger': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (indicators.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6 text-center">
        <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-300">No specific threat indicators detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Threat Indicators</h3>
      {indicators.map((indicator, index) => {
        const Icon = getIndicatorIcon(indicator.severity);
        const colorClasses = getIndicatorColor(indicator.severity);
        
        return (
          <div key={index} className={`border rounded-lg p-4 ${colorClasses}`}>
            <div className="flex items-start space-x-3">
              <Icon className="h-5 w-5 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold">{indicator.type}</h4>
                <p className="text-sm opacity-80 mt-1">{indicator.description}</p>
              </div>
              {indicator.matched && (
                <span className="px-2 py-1 text-xs font-medium bg-white bg-opacity-50 rounded">
                  Detected
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}