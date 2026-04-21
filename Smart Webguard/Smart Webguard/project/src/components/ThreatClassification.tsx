import React, { useState } from 'react';
import { ThreatAnalysis } from '../types/detection';
import { Shield, Zap, Eye, AlertCircle, Brain, Target, Lock, Globe } from 'lucide-react';

interface ThreatClassificationProps {
  analysis: ThreatAnalysis;
}

export function ThreatClassification({ analysis }: ThreatClassificationProps) {
  const [activeTab, setActiveTab] = useState<'classification' | 'techniques' | 'mitigation'>('classification');

  const getClassificationData = () => {
    const classifications = [
      {
        category: 'Primary Threat Vector',
        value: analysis.categories[0]?.name || 'Unknown',
        confidence: analysis.categories[0]?.confidence || 0,
        icon: Shield,
        color: 'text-red-600 bg-red-50'
      },
      {
        category: 'Attack Sophistication',
        value: analysis.overallScore > 80 ? 'Advanced' : analysis.overallScore > 50 ? 'Intermediate' : 'Basic',
        confidence: Math.min(analysis.overallScore + 10, 100),
        icon: Brain,
        color: 'text-purple-600 bg-purple-50'
      },
      {
        category: 'Target Audience',
        value: getTargetAudience(analysis),
        confidence: 85,
        icon: Target,
        color: 'text-blue-600 bg-blue-50'
      },
      {
        category: 'Delivery Method',
        value: getDeliveryMethod(analysis),
        confidence: 90,
        icon: Globe,
        color: 'text-green-600 bg-green-50'
      }
    ];

    return classifications;
  };

  const getTargetAudience = (analysis: ThreatAnalysis) => {
    const content = analysis.content.toLowerCase();
    if (content.includes('business') || content.includes('ceo') || content.includes('invoice')) return 'Business Users';
    if (content.includes('elderly') || content.includes('senior') || content.includes('retirement')) return 'Senior Citizens';
    if (content.includes('student') || content.includes('education') || content.includes('scholarship')) return 'Students';
    if (content.includes('crypto') || content.includes('bitcoin') || content.includes('trading')) return 'Crypto Investors';
    return 'General Public';
  };

  const getDeliveryMethod = (analysis: ThreatAnalysis) => {
    if (analysis.type === 'url') return 'Malicious Website';
    if (analysis.content.includes('email') || analysis.content.includes('message')) return 'Email/SMS';
    if (analysis.content.includes('social') || analysis.content.includes('facebook')) return 'Social Media';
    if (analysis.content.includes('download') || analysis.content.includes('exe')) return 'File Download';
    return 'Direct Communication';
  };

  const getAttackTechniques = () => {
    const techniques = [];
    const content = analysis.content.toLowerCase();

    if (content.includes('urgent') || content.includes('immediate')) {
      techniques.push({
        name: 'Urgency Manipulation',
        description: 'Creates false sense of urgency to bypass rational thinking',
        severity: 'high',
        icon: Zap
      });
    }

    if (content.includes('verify') || content.includes('confirm')) {
      techniques.push({
        name: 'Credential Harvesting',
        description: 'Attempts to steal login credentials and personal information',
        severity: 'critical',
        icon: Lock
      });
    }

    if (content.includes('winner') || content.includes('prize') || content.includes('free')) {
      techniques.push({
        name: 'Reward Manipulation',
        description: 'Uses false rewards to entice victims into compliance',
        severity: 'medium',
        icon: Target
      });
    }

    if (content.includes('microsoft') || content.includes('apple') || content.includes('google')) {
      techniques.push({
        name: 'Brand Impersonation',
        description: 'Impersonates trusted brands to gain credibility',
        severity: 'high',
        icon: Eye
      });
    }

    if (content.includes('download') || content.includes('exe') || content.includes('install')) {
      techniques.push({
        name: 'Malware Distribution',
        description: 'Attempts to install malicious software on target systems',
        severity: 'critical',
        icon: AlertCircle
      });
    }

    return techniques;
  };

  const getMitigationStrategies = () => {
    const strategies = [];
    const riskLevel = analysis.riskLevel;

    if (riskLevel === 'critical' || riskLevel === 'high') {
      strategies.push({
        priority: 'Immediate',
        action: 'Block and Quarantine',
        description: 'Immediately block access and quarantine the threat',
        color: 'text-red-600 bg-red-50'
      });
    }

    strategies.push({
      priority: 'Short-term',
      action: 'User Education',
      description: 'Educate users about this specific threat pattern',
      color: 'text-orange-600 bg-orange-50'
    });

    strategies.push({
      priority: 'Long-term',
      action: 'Policy Update',
      description: 'Update security policies to prevent similar threats',
      color: 'text-blue-600 bg-blue-50'
    });

    if (analysis.type === 'url') {
      strategies.push({
        priority: 'Technical',
        action: 'DNS Filtering',
        description: 'Add domain to DNS blacklist for organization-wide protection',
        color: 'text-purple-600 bg-purple-50'
      });
    }

    return strategies;
  };

  const classifications = getClassificationData();
  const techniques = getAttackTechniques();
  const mitigations = getMitigationStrategies();

  const tabs = [
    { id: 'classification', label: 'Classification', icon: Shield },
    { id: 'techniques', label: 'Attack Techniques', icon: Zap },
    { id: 'mitigation', label: 'Mitigation', icon: Lock }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Advanced Threat Classification</h3>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'classification' && (
        <div className="space-y-4">
          {classifications.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className={`border rounded-lg p-4 ${item.color}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <span className="text-sm font-bold">{item.confidence}%</span>
                </div>
                <p className="text-lg font-semibold">{item.value}</p>
                <div className="w-full bg-white bg-opacity-50 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 bg-current rounded-full transition-all duration-1000"
                    style={{ width: `${item.confidence}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'techniques' && (
        <div className="space-y-4">
          {techniques.length > 0 ? techniques.map((technique, index) => {
            const Icon = technique.icon;
            const severityColor = technique.severity === 'critical' ? 'text-red-600 bg-red-50' :
                                 technique.severity === 'high' ? 'text-orange-600 bg-orange-50' :
                                 'text-yellow-600 bg-yellow-50';
            
            return (
              <div key={index} className={`border rounded-lg p-4 ${severityColor}`}>
                <div className="flex items-start space-x-3">
                  <Icon className="h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">{technique.name}</h4>
                    <p className="text-sm opacity-80 mt-1">{technique.description}</p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded mt-2 ${
                      technique.severity === 'critical' ? 'bg-red-200 text-red-800' :
                      technique.severity === 'high' ? 'bg-orange-200 text-orange-800' :
                      'bg-yellow-200 text-yellow-800'
                    }`}>
                      {technique.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No specific attack techniques identified</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'mitigation' && (
        <div className="space-y-4">
          {mitigations.map((strategy, index) => (
            <div key={index} className={`border rounded-lg p-4 ${strategy.color}`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{strategy.action}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  strategy.priority === 'Immediate' ? 'bg-red-200 text-red-800' :
                  strategy.priority === 'Short-term' ? 'bg-orange-200 text-orange-800' :
                  strategy.priority === 'Long-term' ? 'bg-blue-200 text-blue-800' :
                  'bg-purple-200 text-purple-800'
                }`}>
                  {strategy.priority}
                </span>
              </div>
              <p className="text-sm opacity-80">{strategy.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}