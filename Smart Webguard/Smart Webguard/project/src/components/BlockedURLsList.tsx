import React, { useState, useEffect } from 'react';
import { Ban, Trash2, Shield, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { getURLBlocker, BlockedURL } from '../utils/urlBlocker';

interface BlockedURLsListProps {
  language: 'en' | 'hi';
}

export function BlockedURLsList({ language }: BlockedURLsListProps) {
  const [blockedURLs, setBlockedURLs] = useState<BlockedURL[]>([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    loadBlockedURLs();
  }, []);

  const loadBlockedURLs = () => {
    const urlBlocker = getURLBlocker();
    setBlockedURLs(urlBlocker.getBlockedList());
  };

  const handleUnblock = (url: string) => {
    if (confirm(language === 'hi'
      ? 'क्या आप वाकई इस वेबसाइट को अनब्लॉक करना चाहते हैं?'
      : 'Are you sure you want to unblock this website?')) {
      const urlBlocker = getURLBlocker();
      urlBlocker.unblockURL(url);
      loadBlockedURLs();
    }
  };

  const handleClearAll = () => {
    if (confirm(language === 'hi'
      ? 'क्या आप सभी ब्लॉक की गई वेबसाइट्स को साफ़ करना चाहते हैं?'
      : 'Are you sure you want to clear all blocked websites?')) {
      const urlBlocker = getURLBlocker();
      urlBlocker.clearAll();
      loadBlockedURLs();
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 85) return 'text-red-600 bg-red-100 dark:bg-red-900/30';
    if (score >= 65) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
    if (score >= 35) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    return 'text-green-600 bg-green-100 dark:bg-green-900/30';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Ban className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'hi' ? 'ब्लॉक की गई वेबसाइट्स' : 'Blocked Websites'}
          </h3>
          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-full font-bold">
            {blockedURLs.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {blockedURLs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              <Trash2 className="h-3 w-3 inline mr-1" />
              {language === 'hi' ? 'सभी साफ़ करें' : 'Clear All'}
            </button>
          )}
          <button
            onClick={() => setShowList(!showList)}
            className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            {showList
              ? (language === 'hi' ? 'छुपाएं' : 'Hide')
              : (language === 'hi' ? 'दिखाएं' : 'Show')
            }
          </button>
        </div>
      </div>

      {showList && (
        <div className="space-y-3">
          {blockedURLs.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-green-600 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'hi'
                  ? 'कोई ब्लॉक की गई वेबसाइट नहीं है। आप सुरक्षित हैं!'
                  : 'No blocked websites. You are safe!'}
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2">
              {blockedURLs.map((blocked, index) => (
                <div
                  key={index}
                  className="border border-red-200 dark:border-red-800 rounded-lg p-3 bg-red-50 dark:bg-red-900/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <ExternalLink className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {blocked.url}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded font-bold ${getRiskColor(blocked.threatScore)}`}>
                          {language === 'hi' ? 'स्कोर' : 'Score'}: {blocked.threatScore}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                          {blocked.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{blocked.reason}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          {language === 'hi' ? 'ब्लॉक किया गया' : 'Blocked'}: {blocked.blockedAt.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnblock(blocked.url)}
                      className="ml-2 p-1 text-red-600 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                      title={language === 'hi' ? 'अनब्लॉक करें' : 'Unblock'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Security Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
        <p className="text-xs text-blue-800 dark:text-blue-300">
          {language === 'hi'
            ? '🛡️ ब्लॉक की गई वेबसाइट्स तब तक एक्सेस नहीं की जा सकतीं जब तक आप उन्हें मैन्युअल रूप से अनब्लॉक नहीं करते।'
            : '🛡️ Blocked websites cannot be accessed until you manually unblock them.'}
        </p>
      </div>
    </div>
  );
}
