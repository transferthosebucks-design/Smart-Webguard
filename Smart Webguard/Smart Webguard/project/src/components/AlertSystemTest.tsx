import React from 'react';
import { TestTube, AlertTriangle } from 'lucide-react';
import { ThreatAnalysis } from '../types/detection';

interface AlertSystemTestProps {
  onGenerateTestThreat: (riskLevel: 'critical' | 'high' | 'medium' | 'low') => void;
  language: 'en' | 'hi';
}

export function AlertSystemTest({ onGenerateTestThreat, language }: AlertSystemTestProps) {
  const testThreats = [
    {
      level: 'critical' as const,
      label: language === 'hi' ? 'गंभीर खतरा' : 'Critical Threat',
      color: 'bg-red-600 hover:bg-red-700',
      textColor: 'text-red-600'
    },
    {
      level: 'high' as const,
      label: language === 'hi' ? 'उच्च खतरा' : 'High Threat',
      color: 'bg-orange-600 hover:bg-orange-700',
      textColor: 'text-orange-600'
    },
    {
      level: 'medium' as const,
      label: language === 'hi' ? 'मध्यम खतरा' : 'Medium Threat',
      color: 'bg-yellow-600 hover:bg-yellow-700',
      textColor: 'text-yellow-600'
    },
    {
      level: 'low' as const,
      label: language === 'hi' ? 'कम खतरा' : 'Low Threat',
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <TestTube className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          {language === 'hi' ? 'अलर्ट सिस्टम टेस्ट' : 'Alert System Test'}
        </h3>
      </div>
      <p className="text-xs text-blue-800 dark:text-blue-300 mb-3">
        {language === 'hi'
          ? 'विभिन्न खतरों के स्तर के लिए अलर्ट सिस्टम का परीक्षण करें:'
          : 'Test the alert system with different threat levels:'}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {testThreats.map((threat) => (
          <button
            key={threat.level}
            onClick={() => onGenerateTestThreat(threat.level)}
            className={`${threat.color} text-white px-3 py-2 rounded text-xs font-medium transition-colors flex items-center justify-center space-x-1`}
          >
            <AlertTriangle className="h-3 w-3" />
            <span>{threat.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/40 rounded text-xs text-blue-800 dark:text-blue-300">
        {language === 'hi'
          ? '💡 नोट: Critical और High खतरे voice alert और auto-blocking ट्रिगर करेंगे'
          : '💡 Note: Critical and High threats will trigger voice alerts and auto-blocking'}
      </div>
    </div>
  );
}
