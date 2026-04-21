import React from 'react';
import { AnalysisStats } from '../types/detection';
import { BarChart3, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface StatsOverviewProps {
  stats: AnalysisStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const threatPercentage = stats.totalScans > 0 
    ? Math.round((stats.threatsDetected / stats.totalScans) * 100)
    : 0;

  const cleanPercentage = stats.totalScans > 0
    ? Math.round((stats.cleanContent / stats.totalScans) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Scans</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalScans}</p>
          </div>
          <BarChart3 className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Threats Detected</p>
            <p className="text-2xl font-bold text-red-600">{stats.threatsDetected}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{threatPercentage}% of scans</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clean Content</p>
            <p className="text-2xl font-bold text-green-600">{stats.cleanContent}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{cleanPercentage}% of scans</p>
          </div>
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Threat Score</p>
            <p className="text-2xl font-bold text-orange-600">
              {stats.avgThreatScore.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Risk assessment</p>
          </div>
          <Shield className="h-8 w-8 text-orange-600" />
        </div>
      </div>
    </div>
  );
}