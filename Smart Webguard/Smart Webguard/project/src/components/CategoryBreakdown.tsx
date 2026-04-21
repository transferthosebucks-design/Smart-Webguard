import React from 'react';
import { ThreatCategory } from '../types/detection';
import { AlertCircle, Shield, Zap, Eye } from 'lucide-react';

interface CategoryBreakdownProps {
  categories: ThreatCategory[];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'phishing': return Eye;
      case 'malware': return Zap;
      case 'spam': return AlertCircle;
      default: return Shield;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (categories.length === 0) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <Shield className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-300">No Threats Detected</h3>
            <p className="text-sm text-green-600 dark:text-green-400">Content appears to be safe</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Threat Categories</h3>
      {categories.map((category, index) => {
        const Icon = getCategoryIcon(category.name);
        const colorClasses = getSeverityColor(category.severity);
        
        return (
          <div key={index} className={`border rounded-lg p-4 ${colorClasses}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <div>
                  <h4 className="font-semibold">{category.name}</h4>
                  <p className="text-sm opacity-80">{category.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{category.score}</div>
                <div className="text-xs opacity-75">{category.confidence}% confidence</div>
              </div>
            </div>
            
            <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  category.severity === 'critical' ? 'bg-red-500' :
                  category.severity === 'high' ? 'bg-orange-500' :
                  category.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${category.score}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}