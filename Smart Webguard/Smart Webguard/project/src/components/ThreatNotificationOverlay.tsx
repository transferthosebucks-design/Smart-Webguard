import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, X, AlertTriangle, Ban, Volume2, VolumeX } from 'lucide-react';
import { ThreatAnalysis } from '../types/detection';
import { getTranslator } from '../utils/hindiTranslator';

interface ThreatNotificationOverlayProps {
  threat: ThreatAnalysis | null;
  onDismiss: () => void;
  language: 'en' | 'hi';
}

export function ThreatNotificationOverlay({ threat, onDismiss, language }: ThreatNotificationOverlayProps) {
  const translator = getTranslator();
  const [countdown, setCountdown] = useState(15);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const originalTitleRef = useRef(document.title);
  const flashIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!threat) return;

    // Start countdown auto-dismiss
    setCountdown(15);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Play alarm sound
    if (!isMuted) {
      playAlarmSound(threat.riskLevel);
    }

    // Flash browser tab title
    startTitleFlash(threat.riskLevel);

    // Show browser notification as well
    if ('Notification' in window && Notification.permission === 'granted') {
      const notif = new Notification(
        language === 'hi' ? '🚨 खतरनाक वेबसाइट पाई गई!' : '🚨 Malicious Website Detected!',
        {
          body: language === 'hi'
            ? `${threat.riskLevel === 'critical' ? 'गंभीर' : 'उच्च'} जोखिम! स्कोर: ${threat.overallScore}% - ${threat.content.substring(0, 60)}`
            : `${threat.riskLevel.toUpperCase()} RISK! Score: ${threat.overallScore}% - ${threat.content.substring(0, 60)}`,
          icon: '/vite.svg',
          tag: `overlay-${threat.id}`,
          requireInteraction: true
        }
      );
      setTimeout(() => notif.close(), 15000);
    }

    return () => {
      clearInterval(timer);
      stopTitleFlash();
    };
  }, [threat?.id]);

  const startTitleFlash = (riskLevel: string) => {
    const warning = riskLevel === 'critical'
      ? (language === 'hi' ? '🚨 गंभीर खतरा!' : '🚨 CRITICAL THREAT!')
      : (language === 'hi' ? '⚠️ उच्च जोखिम!' : '⚠️ HIGH RISK!');

    let isWarning = false;
    flashIntervalRef.current = setInterval(() => {
      document.title = isWarning ? originalTitleRef.current : warning;
      isWarning = !isWarning;
    }, 800);
  };

  const stopTitleFlash = () => {
    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
    }
    document.title = originalTitleRef.current;
  };

  const playAlarmSound = async (riskLevel: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      const playBeep = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, startTime);
        osc.type = riskLevel === 'critical' ? 'sawtooth' : 'square';
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Play a series of alarm beeps
      const now = ctx.currentTime;
      if (riskLevel === 'critical') {
        // Urgent siren pattern
        for (let i = 0; i < 4; i++) {
          playBeep(1000, now + i * 0.4, 0.2);
          playBeep(800, now + i * 0.4 + 0.2, 0.2);
        }
      } else {
        // Warning beeps
        for (let i = 0; i < 3; i++) {
          playBeep(800, now + i * 0.5, 0.25);
        }
      }
    } catch (error) {
      console.error('Failed to play alarm:', error);
    }
  };

  if (!threat) return null;

  const isCritical = threat.riskLevel === 'critical';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop with pulsing effect */}
      <div
        className={`absolute inset-0 ${
          isCritical
            ? 'bg-red-900/80 animate-pulse'
            : 'bg-orange-900/70'
        }`}
        onClick={onDismiss}
      />

      {/* Notification Card */}
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl border-4 ${
          isCritical
            ? 'border-red-500 bg-white dark:bg-gray-900'
            : 'border-orange-500 bg-white dark:bg-gray-900'
        } overflow-hidden`}
        style={{ animation: 'shake 0.5s ease-in-out' }}
      >
        {/* Flashing top bar */}
        <div
          className={`h-2 ${
            isCritical ? 'bg-red-500 animate-pulse' : 'bg-orange-500 animate-pulse'
          }`}
        />

        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between ${
          isCritical ? 'bg-red-50 dark:bg-red-900/30' : 'bg-orange-50 dark:bg-orange-900/30'
        }`}>
          <div className="flex items-center space-x-3">
            <ShieldAlert className={`h-8 w-8 ${isCritical ? 'text-red-600 animate-bounce' : 'text-orange-600'}`} />
            <div>
              <h2 className={`text-xl font-bold ${isCritical ? 'text-red-700 dark:text-red-400' : 'text-orange-700 dark:text-orange-400'}`}>
                {isCritical
                  ? (language === 'hi' ? '🚨 गंभीर खतरा पाया गया!' : '🚨 CRITICAL THREAT DETECTED!')
                  : (language === 'hi' ? '⚠️ उच्च जोखिम पाया गया!' : '⚠️ HIGH RISK DETECTED!')
                }
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'hi' ? 'रीयल-टाइम मॉनिटरिंग अलर्ट' : 'Real-Time Monitoring Alert'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted && audioContextRef.current) {
                  audioContextRef.current.close();
                  audioContextRef.current = null;
                }
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <button
              onClick={() => { stopTitleFlash(); onDismiss(); }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Threat Score */}
          <div className="flex items-center justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
              isCritical
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
            }`}>
              <div className="text-center">
                <p className={`text-3xl font-bold ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
                  {threat.overallScore}%
                </p>
                <p className={`text-xs font-medium ${isCritical ? 'text-red-500' : 'text-orange-500'}`}>
                  {language === 'hi' ? 'जोखिम' : 'RISK'}
                </p>
              </div>
            </div>
          </div>

          {/* Malicious URL */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {language === 'hi' ? 'खतरनाक URL पाया गया:' : 'Malicious URL Detected:'}
            </p>
            <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
              {threat.content}
            </p>
          </div>

          {/* Threat Categories */}
          {threat.categories.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {language === 'hi' ? 'पहचानी गई श्रेणियां:' : 'Detected Categories:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {threat.categories.slice(0, 4).map((cat, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isCritical
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}
                  >
                    {cat.name} ({cat.score}%)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className={`flex items-start space-x-3 p-3 rounded-lg ${
            isCritical ? 'bg-red-50 dark:bg-red-900/20' : 'bg-orange-50 dark:bg-orange-900/20'
          }`}>
            <Ban className={`h-5 w-5 mt-0.5 ${isCritical ? 'text-red-600' : 'text-orange-600'}`} />
            <p className={`text-sm ${isCritical ? 'text-red-700 dark:text-red-300' : 'text-orange-700 dark:text-orange-300'}`}>
              {language === 'hi'
                ? 'इस वेबसाइट को खतरनाक के रूप में चिह्नित किया गया है। कृपया इसे विज़िट न करें और अपनी जानकारी सुरक्षित रखें।'
                : 'This website has been flagged as malicious. Do NOT visit this site or share any personal information.'
              }
            </p>
          </div>
        </div>

        {/* Footer with dismiss and countdown */}
        <div className={`px-6 py-4 flex items-center justify-between border-t ${
          isCritical ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10'
        }`}>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {language === 'hi'
              ? `${countdown} सेकंड में स्वतः बंद हो जाएगा`
              : `Auto-dismiss in ${countdown}s`
            }
          </p>
          <button
            onClick={() => { stopTitleFlash(); onDismiss(); }}
            className={`px-5 py-2 rounded-lg font-medium text-white transition-colors ${
              isCritical
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {language === 'hi' ? 'समझ गया' : 'Dismiss'}
          </button>
        </div>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
