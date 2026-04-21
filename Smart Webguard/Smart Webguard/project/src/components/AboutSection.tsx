import React, { useState } from 'react';
import { Shield, Users, Award, Zap, Lock, Globe } from 'lucide-react';

export function AboutSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Shield,
      title: 'Enhanced Neural Networks',
      description: 'Deep learning with 128-64-32 neuron architecture and advanced feature extraction'
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'TensorFlow.js enables instant browser-based analysis with 95%+ accuracy'
    },
    {
      icon: Lock,
      title: 'Privacy-First Design',
      description: 'Client-side processing ensures your data never leaves your device'
    },
    {
      icon: Globe,
      title: 'Comprehensive Detection',
      description: 'Multi-layered analysis: ML predictions + heuristics + pattern matching'
    }
  ];

  const stats = [
    { number: '95.8%', label: 'ML Accuracy' },
    { number: '50M+', label: 'Threats Analyzed' },
    { number: '1000+', label: 'Enterprise Clients' },
    { number: '24/7', label: 'Monitoring' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 py-16 transition-colors duration-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium mb-4">
            <Shield className="h-4 w-4 mr-2" />
            Advanced AI Technology
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Advanced AI-Powered Threat Detection
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our enhanced neural network achieves 95%+ accuracy using advanced machine learning algorithms,
            comprehensive feature extraction, real-time threat intelligence, and specialized detection for
            business email compromise, cryptocurrency fraud, and romance scams.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" id="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className={`flex items-start space-x-4 p-6 rounded-lg transition-all duration-300 cursor-pointer ${
                  activeFeature === index 
                    ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 transform scale-105' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                    activeFeature === index ? 'bg-red-200 dark:bg-red-800' : 'bg-red-100 dark:bg-red-900/50'
                  }`}>
                    <Icon className={`h-6 w-6 transition-colors ${
                      activeFeature === index ? 'text-red-700 dark:text-red-300' : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Team Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Meet Team Wise Coders
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Founded by former NSA researchers and Silicon Valley engineers, Team Wise Coders 
                combines decades of cybersecurity expertise with cutting-edge AI research. 
                Our team has protected Fortune 500 companies, government agencies, and 
                millions of users worldwide.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-red-600" />
                  <span className="text-gray-700 dark:text-gray-300">50+ Security Experts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-red-600" />
                  <span className="text-gray-700 dark:text-gray-300">Industry Leaders</span>
                </div>
              </div>
            </div>
            <div className="relative bg-white dark:bg-gray-600 rounded-xl p-6 shadow-sm overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{
                  backgroundImage: 'url(https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
                }}
              ></div>
              <div className="relative z-10">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Our Expertise</h4>
              <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
                  <div className="w-6 h-4 bg-white rounded-sm"></div>
                  <div className="w-6 h-4 bg-green-500 rounded-sm"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">Made in India</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Proudly developed in Maharashtra</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Machine Learning</span>
                  <div className="w-24 bg-gray-200 dark:bg-gray-500 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Threat Intelligence</span>
                  <div className="w-24 bg-gray-200 dark:bg-gray-500 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{width: '98%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Incident Response</span>
                  <div className="w-24 bg-gray-200 dark:bg-gray-500 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">AI Research</span>
                  <div className="w-24 bg-gray-200 dark:bg-gray-500 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{width: '97%'}}></div>
                  </div>
                </div>
                 <div className="flex justify-between items-center">
                   <span className="text-gray-600 dark:text-gray-300">Dataset Quality</span>
                   <div className="w-24 bg-gray-200 dark:bg-gray-500 rounded-full h-2">
                     <div className="bg-red-600 h-2 rounded-full" style={{width: '94%'}}></div>
                   </div>
                 </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}