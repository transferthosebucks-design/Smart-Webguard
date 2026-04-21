// Voice Assistant - Hindi aur English mein voice alerts

export class VoiceAssistant {
  private synth: SpeechSynthesis | null = null;
  private isEnabled: boolean = true;
  private language: 'en' | 'hi' = 'en';

  constructor() {
    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  setLanguage(language: 'en' | 'hi') {
    this.language = language;
  }

  private getVoiceMessage(
    riskLevel: string,
    category: string,
    score: number,
    language: 'en' | 'hi'
  ): string {
    const messages = {
      critical: {
        en: `Critical security threat detected! This is a ${category} attack with threat score ${score}. Access has been blocked immediately. Do not proceed.`,
        hi: `गंभीर सुरक्षा खतरा पाया गया! यह ${category} हमला है जिसका खतरा स्कोर ${score} है। एक्सेस तुरंत ब्लॉक कर दिया गया है। आगे न बढ़ें।`
      },
      high: {
        en: `High risk threat detected! This appears to be a ${category} with score ${score}. This website has been blocked for your safety.`,
        hi: `उच्च जोखिम खतरा पाया गया! यह ${category} प्रतीत होता है जिसका स्कोर ${score} है। आपकी सुरक्षा के लिए यह वेबसाइट ब्लॉक कर दी गई है।`
      },
      medium: {
        en: `Caution! Medium risk detected. This content shows ${category} characteristics with score ${score}. Proceed with extreme care.`,
        hi: `सावधान! मध्यम जोखिम पाया गया। यह सामग्री ${category} विशेषताएं दिखाती है जिसका स्कोर ${score} है। अत्यधिक सावधानी से आगे बढ़ें।`
      },
      low: {
        en: `Low risk alert. Possible ${category} detected with score ${score}. Stay vigilant.`,
        hi: `कम जोखिम अलर्ट। संभावित ${category} पाया गया जिसका स्कोर ${score} है। सतर्क रहें।`
      }
    };

    return messages[riskLevel as keyof typeof messages]?.[language] || messages.high[language];
  }

  speak(text: string, urgent: boolean = false) {
    if (!this.isEnabled || !this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set voice parameters based on urgency
    utterance.rate = urgent ? 1.1 : 0.95;
    utterance.pitch = urgent ? 1.2 : 1.0;
    utterance.volume = urgent ? 1.0 : 0.85;

    // Try to use appropriate language voice
    const voices = this.synth.getVoices();
    if (voices.length > 0) {
      const languageCode = this.language === 'hi' ? 'hi-IN' : 'en-US';
      const preferredVoice = voices.find(voice => voice.lang.startsWith(languageCode));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.lang = this.language === 'hi' ? 'hi-IN' : 'en-US';

    this.synth.speak(utterance);
  }

  speakThreatAlert(
    riskLevel: string,
    category: string,
    score: number,
    url?: string
  ) {
    if (!this.isEnabled || !this.synth) return;

    const message = this.getVoiceMessage(riskLevel, category, score, this.language);
    const urgent = riskLevel === 'critical' || riskLevel === 'high';

    // Speak the main threat message
    this.speak(message, urgent);

    // If URL is provided and it's critical, mention blocking
    if (url && urgent) {
      setTimeout(() => {
        const blockMessage = this.language === 'hi'
          ? 'वेबसाइट एक्सेस ब्लॉक कर दिया गया है।'
          : 'Website access has been blocked.';
        this.speak(blockMessage, true);
      }, 3000);
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  testVoice() {
    const testMessage = this.language === 'hi'
      ? 'वॉयस असिस्टेंट सक्रिय है। आपकी सुरक्षा हमारी प्राथमिकता है।'
      : 'Voice assistant is active. Your security is our priority.';
    this.speak(testMessage, false);
  }
}

// Singleton instance
let voiceAssistant: VoiceAssistant | null = null;

export function getVoiceAssistant(): VoiceAssistant {
  if (!voiceAssistant) {
    voiceAssistant = new VoiceAssistant();
  }
  return voiceAssistant;
}
