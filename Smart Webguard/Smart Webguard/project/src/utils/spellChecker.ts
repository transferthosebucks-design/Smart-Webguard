// Advanced Spell Checker and Content Validation System
export interface SpellCheckResult {
  isValid: boolean;
  errors: SpellError[];
  suggestions: string[];
  confidence: number;
  correctedText: string;
}

export interface SpellError {
  word: string;
  position: number;
  suggestions: string[];
  type: 'spelling' | 'grammar' | 'suspicious';
}

export class AdvancedSpellChecker {
  private dictionary: Set<string>;
  private suspiciousWords: Set<string>;
  private commonMisspellings: Map<string, string>;

  constructor() {
    this.dictionary = new Set();
    this.suspiciousWords = new Set();
    this.commonMisspellings = new Map();
    this.initializeDictionary();
    this.initializeSuspiciousWords();
    this.initializeCommonMisspellings();
  }

  private initializeDictionary() {
    // Common English words dictionary
    const commonWords = [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
      'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if',
      'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just',
      'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see',
      'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
      'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want',
      'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'water', 'long', 'find', 'here',
      'thing', 'great', 'man', 'world', 'life', 'still', 'public', 'human', 'read', 'keep', 'write',
      'become', 'show', 'large', 'again', 'different', 'home', 'move', 'try', 'kind', 'hand', 'picture',
      'change', 'off', 'play', 'spell', 'air', 'away', 'animal', 'house', 'point', 'page', 'letter',
      'mother', 'answer', 'found', 'study', 'learn', 'should', 'america', 'high', 'every', 'near',
      'add', 'food', 'between', 'own', 'below', 'country', 'plant', 'last', 'school', 'father', 'tree',
      'never', 'start', 'city', 'earth', 'eye', 'light', 'thought', 'head', 'under', 'story', 'saw',
      'left', 'few', 'while', 'along', 'might', 'close', 'something', 'seem', 'next', 'hard', 'open',
      'example', 'begin', 'always', 'those', 'both', 'paper', 'together', 'got', 'group', 'often',
      'run', 'important', 'until', 'children', 'side', 'feet', 'car', 'mile', 'night', 'walk', 'white',
      'sea', 'began', 'grow', 'took', 'river', 'four', 'carry', 'state', 'once', 'book', 'hear', 'stop',
      'without', 'second', 'later', 'miss', 'idea', 'enough', 'eat', 'face', 'watch', 'far', 'indian',
      'really', 'almost', 'let', 'above', 'girl', 'sometimes', 'mountain', 'cut', 'young', 'talk',
      'soon', 'list', 'song', 'being', 'leave', 'family', 'body', 'music', 'color', 'stand', 'sun',
      'questions', 'fish', 'area', 'mark', 'dog', 'horse', 'birds', 'problem', 'complete', 'room',
      'knew', 'since', 'ever', 'piece', 'told', 'usually', 'friends', 'easy', 'heard', 'order', 'red',
      'door', 'sure', 'top', 'ship', 'across', 'today', 'during', 'short', 'better', 'best', 'however',
      'low', 'hours', 'black', 'products', 'happened', 'whole', 'measure', 'remember', 'early', 'waves',
      'reached', 'listen', 'wind', 'rock', 'space', 'covered', 'fast', 'several', 'hold', 'himself',
      'toward', 'five', 'step', 'morning', 'passed', 'vowel', 'true', 'hundred', 'against', 'pattern',
      'numeral', 'table', 'north', 'slowly', 'money', 'map', 'farm', 'pulled', 'draw', 'voice', 'seen',
      'cold', 'cried', 'plan', 'notice', 'south', 'sing', 'war', 'ground', 'fall', 'king', 'town',
      'unit', 'figure', 'certain', 'field', 'travel', 'wood', 'fire', 'upon', 'done', 'english',
      'road', 'half', 'ten', 'fly', 'gave', 'box', 'finally', 'wait', 'correct', 'oh', 'quickly',
      'person', 'became', 'shown', 'minutes', 'strong', 'verb', 'stars', 'eat', 'test', 'direction',
      'center', 'farmers', 'ready', 'anything', 'divided', 'general', 'energy', 'subject', 'europe',
      'moon', 'region', 'return', 'believe', 'dance', 'members', 'picked', 'simple', 'cells', 'paint',
      'mind', 'love', 'cause', 'rain', 'exercise', 'eggs', 'train', 'blue', 'wish', 'drop', 'developed',
      'window', 'difference', 'distance', 'heart', 'site', 'summer', 'wall', 'forest', 'probably',
      'legs', 'sat', 'main', 'winter', 'wide', 'written', 'length', 'reason', 'kept', 'interest',
      'arms', 'brother', 'race', 'present', 'beautiful', 'store', 'job', 'edge', 'past', 'sign',
      'record', 'finished', 'discovered', 'wild', 'happy', 'beside', 'gone', 'sky', 'grass', 'million',
      'west', 'lay', 'weather', 'root', 'instruments', 'meet', 'third', 'months', 'paragraph', 'raised',
      'represent', 'soft', 'whether', 'clothes', 'flowers', 'shall', 'teacher', 'held', 'describe',
      'drive', 'cross', 'speak', 'force', 'ocean', 'fall', 'base', 'town', 'fine', 'certain', 'fly',
      'unit', 'lead', 'cry', 'dark', 'machine', 'note', 'wait', 'plan', 'figure', 'star', 'box',
      'noun', 'field', 'rest', 'correct', 'able', 'pound', 'done', 'beauty', 'drive', 'stood',
      'contain', 'front', 'teach', 'week', 'final', 'gave', 'green', 'oh', 'quick', 'develop',
      'sleep', 'warm', 'free', 'minute', 'strong', 'special', 'mind', 'behind', 'clear', 'tail',
      'produce', 'fact', 'street', 'inch', 'lot', 'nothing', 'course', 'stay', 'wheel', 'full',
      'force', 'blue', 'object', 'decide', 'surface', 'deep', 'moon', 'island', 'foot', 'yet',
      'busy', 'test', 'record', 'boat', 'common', 'gold', 'possible', 'plane', 'age', 'dry',
      'wonder', 'laugh', 'thousands', 'ago', 'ran', 'check', 'game', 'shape', 'yes', 'hot',
      'miss', 'brought', 'heat', 'snow', 'bed', 'bring', 'sit', 'perhaps', 'fill', 'east',
      'weight', 'language', 'among'
    ];

    // Technical and cybersecurity terms
    const techWords = [
      'cybersecurity', 'malware', 'phishing', 'spam', 'virus', 'trojan', 'ransomware', 'spyware',
      'adware', 'rootkit', 'backdoor', 'keylogger', 'botnet', 'ddos', 'firewall', 'antivirus',
      'encryption', 'decryption', 'authentication', 'authorization', 'vulnerability', 'exploit',
      'patch', 'update', 'security', 'privacy', 'breach', 'compromise', 'attack', 'threat',
      'detection', 'prevention', 'protection', 'monitoring', 'analysis', 'intelligence',
      'artificial', 'machine', 'learning', 'neural', 'network', 'algorithm', 'model',
      'training', 'prediction', 'classification', 'regression', 'clustering', 'validation',
      'accuracy', 'precision', 'recall', 'confidence', 'probability', 'statistics',
      'dataset', 'features', 'patterns', 'anomaly', 'behavior', 'signature', 'heuristic',
      'sandbox', 'quarantine', 'whitelist', 'blacklist', 'reputation', 'scoring',
      'url', 'domain', 'subdomain', 'protocol', 'https', 'http', 'ssl', 'tls',
      'certificate', 'hash', 'checksum', 'signature', 'fingerprint', 'metadata',
      'header', 'payload', 'packet', 'traffic', 'network', 'internet', 'web',
      'browser', 'client', 'server', 'database', 'application', 'software',
      'hardware', 'system', 'operating', 'windows', 'linux', 'macos', 'android',
      'mobile', 'desktop', 'laptop', 'tablet', 'smartphone', 'device', 'endpoint',
      'enterprise', 'corporate', 'business', 'organization', 'company', 'industry',
      'government', 'military', 'financial', 'banking', 'healthcare', 'education',
      'retail', 'ecommerce', 'social', 'media', 'platform', 'service', 'cloud',
      'infrastructure', 'architecture', 'framework', 'library', 'api', 'interface',
      'protocol', 'standard', 'compliance', 'regulation', 'policy', 'procedure',
      'incident', 'response', 'forensics', 'investigation', 'evidence', 'report',
      'documentation', 'training', 'awareness', 'education', 'certification',
      'assessment', 'audit', 'review', 'evaluation', 'testing', 'penetration',
      'vulnerability', 'scanning', 'reconnaissance', 'enumeration', 'exploitation',
      'privilege', 'escalation', 'lateral', 'movement', 'persistence', 'exfiltration',
      'command', 'control', 'communication', 'channel', 'infrastructure', 'campaign',
      'actor', 'group', 'nation', 'state', 'criminal', 'hacker', 'attacker',
      'adversary', 'threat', 'intelligence', 'indicator', 'compromise', 'tactics',
      'techniques', 'procedures', 'mitre', 'attack', 'framework', 'kill', 'chain',
      'diamond', 'model', 'pyramid', 'pain', 'cyber', 'warfare', 'espionage',
      'sabotage', 'terrorism', 'activism', 'hacktivism', 'crime', 'fraud', 'scam',
      'identity', 'theft', 'financial', 'loss', 'reputation', 'damage', 'business',
      'continuity', 'disaster', 'recovery', 'backup', 'restore', 'redundancy',
      'availability', 'integrity', 'confidentiality', 'triad', 'principle',
      'governance', 'risk', 'management', 'compliance', 'framework', 'control',
      'objective', 'requirement', 'specification', 'implementation', 'deployment',
      'maintenance', 'support', 'lifecycle', 'development', 'secure', 'coding',
      'practices', 'guidelines', 'standards', 'best', 'practices', 'methodology'
    ];

    // Add all words to dictionary
    [...commonWords, ...techWords].forEach(word => {
      this.dictionary.add(word.toLowerCase());
    });
  }

  private initializeSuspiciousWords() {
    const suspicious = [
      'urgent', 'immediate', 'verify', 'suspended', 'click', 'download', 'free', 'winner',
      'prize', 'lottery', 'bitcoin', 'guaranteed', 'profit', 'money', 'fast', 'easy',
      'virus', 'infected', 'trojan', 'malware', 'security', 'alert', 'warning',
      'account', 'password', 'login', 'credentials', 'unauthorized', 'access',
      'locked', 'restore', 'validate', 'authenticate', 'breach', 'compromise',
      'payment', 'billing', 'expired', 'renewal', 'update', 'confirm', 'identity'
    ];

    suspicious.forEach(word => {
      this.suspiciousWords.add(word.toLowerCase());
    });
  }

  private initializeCommonMisspellings() {
    const misspellings = [
      ['recieve', 'receive'], ['seperate', 'separate'], ['definately', 'definitely'],
      ['occured', 'occurred'], ['begining', 'beginning'], ['writting', 'writing'],
      ['comming', 'coming'], ['runing', 'running'], ['geting', 'getting'],
      ['payed', 'paid'], ['layed', 'laid'], ['alot', 'a lot'], ['cant', 'cannot'],
      ['wont', 'will not'], ['dont', 'do not'], ['isnt', 'is not'], ['arent', 'are not'],
      ['wasnt', 'was not'], ['werent', 'were not'], ['hasnt', 'has not'],
      ['havent', 'have not'], ['hadnt', 'had not'], ['wouldnt', 'would not'],
      ['couldnt', 'could not'], ['shouldnt', 'should not'], ['mustnt', 'must not'],
      ['neednt', 'need not'], ['darent', 'dare not'], ['oughtnt', 'ought not'],
      ['mightnt', 'might not'], ['shant', 'shall not'], ['thats', 'that is'],
      ['whats', 'what is'], ['whos', 'who is'], ['wheres', 'where is'],
      ['whens', 'when is'], ['whys', 'why is'], ['hows', 'how is'],
      ['heres', 'here is'], ['theres', 'there is'], ['youre', 'you are'],
      ['theyre', 'they are'], ['were', 'we are'], ['its', 'it is'],
      ['lets', 'let us'], ['im', 'I am'], ['youll', 'you will'],
      ['hell', 'he will'], ['shell', 'she will'], ['well', 'we will'],
      ['theyll', 'they will'], ['itll', 'it will'], ['thatll', 'that will'],
      ['youve', 'you have'], ['weve', 'we have'], ['theyve', 'they have'],
      ['ive', 'I have'], ['youve', 'you have'], ['hes', 'he has'],
      ['shes', 'she has'], ['its', 'it has'], ['thats', 'that has']
    ];

    misspellings.forEach(([wrong, correct]) => {
      this.commonMisspellings.set(wrong.toLowerCase(), correct);
    });
  }

  checkSpelling(text: string): SpellCheckResult {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const errors: SpellError[] = [];
    let correctedText = text;
    let suspiciousCount = 0;

    words.forEach((word, index) => {
      const position = text.toLowerCase().indexOf(word);
      
      // Check for misspellings
      if (this.commonMisspellings.has(word)) {
        const correction = this.commonMisspellings.get(word)!;
        errors.push({
          word,
          position,
          suggestions: [correction],
          type: 'spelling'
        });
        correctedText = correctedText.replace(new RegExp(`\\b${word}\\b`, 'gi'), correction);
      }
      // Check if word is in dictionary
      else if (!this.dictionary.has(word) && word.length > 2) {
        const suggestions = this.getSuggestions(word);
        errors.push({
          word,
          position,
          suggestions,
          type: 'spelling'
        });
      }
      
      // Check for suspicious words
      if (this.suspiciousWords.has(word)) {
        suspiciousCount++;
        errors.push({
          word,
          position,
          suggestions: [],
          type: 'suspicious'
        });
      }
    });

    const confidence = Math.max(0, 100 - (errors.length * 10) - (suspiciousCount * 5));
    const isValid = errors.filter(e => e.type === 'spelling').length === 0;

    return {
      isValid,
      errors,
      suggestions: this.generateSuggestions(text, errors),
      confidence,
      correctedText
    };
  }

  private getSuggestions(word: string): string[] {
    const suggestions: string[] = [];
    const maxDistance = 2;

    // Find similar words in dictionary
    for (const dictWord of this.dictionary) {
      if (Math.abs(word.length - dictWord.length) <= maxDistance) {
        const distance = this.levenshteinDistance(word, dictWord);
        if (distance <= maxDistance) {
          suggestions.push(dictWord);
        }
      }
    }

    return suggestions.slice(0, 3);
  }

  private levenshteinDistance(a: string, b: string): number {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[b.length][a.length];
  }

  private generateSuggestions(text: string, errors: SpellError[]): string[] {
    const suggestions: string[] = [];

    if (errors.some(e => e.type === 'suspicious')) {
      suggestions.push('Content contains suspicious keywords that may indicate threats');
    }

    if (errors.some(e => e.type === 'spelling')) {
      suggestions.push('Check spelling and grammar before analysis');
    }

    if (text.length < 10) {
      suggestions.push('Content is very short - consider providing more context');
    }

    if (text.length > 1000) {
      suggestions.push('Content is very long - consider breaking into smaller parts');
    }

    return suggestions;
  }

  validateInput(input: string, type: 'url' | 'text' | 'domain' | 'hash'): { isValid: boolean; error?: string } {
    if (!input.trim()) {
      return { isValid: false, error: 'Input cannot be empty' };
    }

    switch (type) {
      case 'url':
        return this.validateURL(input);
      case 'domain':
        return this.validateDomain(input);
      case 'hash':
        return this.validateHash(input);
      case 'text':
        return this.validateText(input);
      default:
        return { isValid: true };
    }
  }

  private validateURL(url: string): { isValid: boolean; error?: string } {
    try {
      new URL(url);
      return { isValid: true };
    } catch {
      // Try adding protocol
      try {
        new URL(`https://${url}`);
        return { isValid: true };
      } catch {
        return { isValid: false, error: 'Invalid URL format. Please include http:// or https://' };
      }
    }
  }

  private validateDomain(domain: string): { isValid: boolean; error?: string } {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return { isValid: false, error: 'Invalid domain format. Example: example.com' };
    }
    return { isValid: true };
  }

  private validateHash(hash: string): { isValid: boolean; error?: string } {
    const md5Regex = /^[a-fA-F0-9]{32}$/;
    const sha1Regex = /^[a-fA-F0-9]{40}$/;
    const sha256Regex = /^[a-fA-F0-9]{64}$/;

    if (!md5Regex.test(hash) && !sha1Regex.test(hash) && !sha256Regex.test(hash)) {
      return { isValid: false, error: 'Invalid hash format. Must be MD5 (32), SHA1 (40), or SHA256 (64) characters' };
    }
    return { isValid: true };
  }

  private validateText(text: string): { isValid: boolean; error?: string } {
    if (text.length < 3) {
      return { isValid: false, error: 'Text must be at least 3 characters long' };
    }
    if (text.length > 10000) {
      return { isValid: false, error: 'Text is too long. Maximum 10,000 characters allowed' };
    }
    return { isValid: true };
  }
}

// Singleton instance
let spellChecker: AdvancedSpellChecker | null = null;

export function getSpellChecker(): AdvancedSpellChecker {
  if (!spellChecker) {
    spellChecker = new AdvancedSpellChecker();
  }
  return spellChecker;
}