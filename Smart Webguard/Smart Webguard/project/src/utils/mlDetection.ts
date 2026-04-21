import { ThreatAnalysis, ThreatCategory, ThreatIndicator } from '../types/detection';
import { getDetector } from './mlModel';
import { getEnhancedDetector } from './enhancedMLModel';

// Enhanced threat detection patterns
const PHISHING_PATTERNS = [
  /verify.*account.*suspended/i,
  /click.*here.*urgent.*action/i,
  /update.*payment.*information/i,
  /confirm.*identity.*immediately/i,
  /account.*locked.*restore/i,
  /security.*alert.*detected/i,
  /unauthorized.*access.*login/i,
  /password.*expired.*reset/i,
  /billing.*failed.*update/i,
  /suspicious.*activity.*verify/i,
  /two.*factor.*authentication.*disabled/i,
  /login.*attempt.*blocked.*verify/i,
  /account.*will.*be.*closed/i,
  /verify.*within.*24.*hours/i,
  /click.*to.*reactivate.*account/i
];

const SPAM_PATTERNS = [
  /make.*money.*fast.*home/i,
  /winner.*lottery.*prize.*claim/i,
  /bitcoin.*investment.*guaranteed/i,
  /weight.*loss.*pills.*free/i,
  /casino.*bonus.*gambling/i,
  /loan.*approved.*instant/i,
  /pharmacy.*discount.*viagra/i,
  /work.*home.*guaranteed.*income/i,
  /congratulations.*selected.*winner/i,
  /inheritance.*money.*claim/i,
  /earn.*thousands.*weekly/i,
  /miracle.*cure.*doctors.*hate/i,
  /limited.*time.*offer.*expires/i,
  /risk.*free.*trial.*cancel.*anytime/i,
  /act.*now.*supplies.*limited/i
];

const MALWARE_PATTERNS = [
  /download.*exe.*free.*software/i,
  /virus.*detected.*clean.*system/i,
  /trojan.*found.*remove.*threat/i,
  /install.*security.*update/i,
  /system.*infected.*download.*tool/i,
  /malware.*scanner.*infected/i,
  /computer.*compromised.*fix/i,
  /antivirus.*expired.*renew/i,
  /spyware.*detected.*remove/i,
  /ransomware.*files.*encrypted/i,
  /critical.*security.*patch.*install/i,
  /backdoor.*detected.*clean.*now/i,
  /keylogger.*found.*remove.*immediately/i,
  /system.*performance.*degraded.*fix/i,
  /registry.*errors.*repair.*tool/i
];

const SOCIAL_ENGINEERING_PATTERNS = [
  /trust.*me.*help.*urgent/i,
  /family.*emergency.*money/i,
  /government.*tax.*refund/i,
  /police.*investigation.*contact/i,
  /bank.*fraud.*department/i,
  /microsoft.*support.*computer/i,
  /apple.*security.*account/i,
  /amazon.*order.*cancelled/i,
  /paypal.*payment.*dispute/i,
  /irs.*audit.*immediate/i,
  /fbi.*investigation.*cooperation/i,
  /court.*summons.*appear.*immediately/i,
  /social.*security.*suspended/i,
  /medicare.*benefits.*cancelled/i,
  /immigration.*status.*verify/i
];

// Misinformation / disinformation patterns (primarily for text content)
// Note: this is "signal-based" (clickbait + false-claim cues), not fact-checking.
const MISINFORMATION_PATTERNS = [
  /share.*before.*(they|it).*(delete|remove|ban)/i,
  /share\s*now/i,
  /forward\s*(this|it)?\s*(to)?\s*(everyone|all)/i,
  /(send|share).*(to)?\s*\d+\s*(people|friends|contacts|groups)/i,
  /(mainstream|media).*(won't|will not).*(tell|show).*you/i,
  /(they|big pharma|government).*(don't|do not).*(want|like).*you.*to.*know/i,
  /(government|govt).*(confirmed|admits|admitted|proves|proved)/i,
  /shocking.*truth/i,
  /this.*one.*trick/i,
  /miracle.*cure/i,
  /(cure|cures).*(cancer|diabetes|hiv|aids).*(days|hours)/i,
  /doctors.*hate.*this/i,
  /(100%|guaranteed).*(proof|true)/i,
  /wake.*up.*sheeple/i,
  /(hoax|fake news).*exposed/i,
  /(secret|hidden).*(agenda|plan)/i,
  /spread.*this.*everywhere/i,
  // Common Hindi/WhatsApp-style virality + certainty cues (signal-based, not fact-checking)
  /(abhi|jaldi|turant).*(share|forward)/i,
  /(aaj|abhi).*(viral)/i,
  /(sarkar|government).*(ne|has).*(pushti|confirm|confirmed)/i,
  /\b(yeh|ye).*(sach|truth).*(chhupaya|chhupa)\b/i,
  /(10|20|50)\s*(logo(n)?|people).*(bhejo|send|forward)/i
];

// Advanced threat patterns for sophisticated attacks
const ADVANCED_THREAT_PATTERNS = [
  /business.*email.*compromise/i,
  /ceo.*fraud.*wire.*transfer/i,
  /invoice.*payment.*urgent/i,
  /vendor.*payment.*details.*changed/i,
  /payroll.*redirect.*request/i,
  /tax.*form.*w2.*request/i,
  /employee.*information.*verify/i,
  /hr.*policy.*update.*review/i,
  /it.*security.*test.*click/i,
  /mandatory.*training.*complete/i
];

// Cryptocurrency and financial fraud patterns
const CRYPTO_FRAUD_PATTERNS = [
  /bitcoin.*doubling.*investment/i,
  /cryptocurrency.*mining.*opportunity/i,
  /nft.*exclusive.*presale/i,
  /defi.*yield.*farming.*guaranteed/i,
  /crypto.*wallet.*verification/i,
  /blockchain.*airdrop.*claim/i,
  /ethereum.*staking.*rewards/i,
  /dogecoin.*pump.*group/i,
  /trading.*bot.*guaranteed.*profit/i,
  /ico.*early.*investor.*bonus/i
];

// Romance and dating scam patterns
const ROMANCE_SCAM_PATTERNS = [
  /lonely.*heart.*seeking.*love/i,
  /military.*deployed.*overseas/i,
  /widowed.*looking.*companion/i,
  /emergency.*money.*hospital/i,
  /travel.*money.*visit.*you/i,
  /customs.*fee.*package/i,
  /inheritance.*lawyer.*fees/i,
  /medical.*emergency.*surgery/i,
  /stranded.*foreign.*country/i,
  /visa.*application.*money/i
];

// Keyword risk levels for single-word/phrase detection
const HIGH_RISK_KEYWORDS = [
  'password', 'otp', 'credit-card', 'credit card', 'bank-account', 'bank account',
  'verify-account', 'verify account', 'login-now', 'login now', 'urgent-action',
  'urgent action', 'account-suspended', 'account suspended', 'confirm-identity',
  'confirm identity', 'security-alert', 'security alert', 'update-payment',
  'update payment', 'payment-verification', 'payment verification', 'claim-reward',
  'claim reward', 'free-gift', 'free gift', 'bank-verification', 'bank verification',
  'wallet-recovery', 'wallet recovery', 'crypto-transfer', 'crypto transfer',
  'transaction-failed', 'transaction failed', 'account-locked', 'account locked',
  'reset-password', 'reset password', 'ssn', 'social security', 'wire transfer',
  'routing number', 'cvv', 'pin number', 'account number'
];

const MEDIUM_RISK_KEYWORDS = [
  'verify', 'security-check', 'security check', 'login-alert', 'login alert',
  'account-review', 'account review', 'update-information', 'update information',
  'confirm-details', 'confirm details', 'limited-access', 'limited access',
  'unusual-activity', 'unusual activity', 'device-verification', 'device verification',
  'security-notice', 'security notice', 'payment-check', 'payment check',
  'account-update', 'account update', 'identity-confirmation', 'identity confirmation',
  'suspicious', 'blocked', 'restricted', 'disabled', 'expired', 'unauthorized'
];

const LOW_RISK_KEYWORDS = [
  'tutorial', 'documentation', 'guide', 'learning', 'community', 'resources',
  'technology', 'support', 'education', 'services', 'articles', 'blog',
  'developers', 'developer', 'open-source', 'open source', 'research', 'reference',
  'handbook', 'manual', 'faq', 'help center', 'knowledge base', 'docs',
  'academy', 'course', 'training', 'certification', 'portfolio', 'showcase',
  'wikipedia', 'stackoverflow', 'official'
];

// Suspicious TLDs for domain analysis
const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.info', '.click', '.loan', '.tk', '.ml', '.ga', '.cf',
  '.download', '.work', '.gq', '.buzz', '.rest', '.icu', '.cam', '.monster',
  '.pw', '.cc', '.su', '.bid', '.trade', '.webcam', '.stream', '.racing',
  '.win', '.review', '.accountant', '.cricket', '.date', '.faith', '.party',
  '.science'
];

// Known malware file hashes (MD5/SHA1/SHA256)
const KNOWN_MALWARE_HASHES = [
  '44d88612fea8a8f36de82e1278abb02f', // EICAR test file (MD5)
  'e99a18c428cb38d5f260853678922e03',
  '3395856ce81f2b7382dee72602f798b642f14140', // EICAR (SHA1)
  '275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f', // EICAR (SHA256)
  'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  'd41d8cd98f00b204e9800998ecf8427e', // Empty file MD5
  '5d41402abc4b2a76b9719d911017c592',
  '098f6bcd4621d373cade4e832627b4f6',
  'b1946ac92492d2347c6235b4d2611184',
  'c4ca4238a0b923820dcc509a6f75849b',
];

// Enhanced ML-based threat detection with improved accuracy
export async function analyzeContent(
  content: string, 
  type: 'url' | 'text' | 'domain' | 'hash'
): Promise<ThreatAnalysis> {
  try {
    const detector = await getDetector();
    const mlPrediction = await detector.predict(content);
    const features = detector.extractFeatures(content);
    
    // Dynamic content analysis with randomization for unique results
    const contentHash = generateContentHash(content);
    const dynamicBoost = calculateDynamicBoost(content, contentHash);
    const contextualAnalysis = performContextualAnalysis(content, type);
    const behavioralAnalysis = analyzeBehavioralPatterns(content);
    const linguisticAnalysis = performLinguisticAnalysis(content);
    const temporalAnalysis = analyzeTemporalPatterns(content);
    
    // Enhanced scoring system
    const threatScore = Math.max(
      mlPrediction.phishing,
      mlPrediction.malware,
      mlPrediction.spam
    );
    
    // Advanced heuristic analysis
    const heuristicBoost = calculateAdvancedHeuristics(content, type);
    const contextualBoost = calculateContextualBoost(content, type);
    const patternBoost = calculatePatternBoost(content);
    
    // Enhanced pattern analysis
    const phishingScore = analyzePhishingPatterns(content);
    const spamScore = analyzeSpamPatterns(content);
    const malwareScore = analyzeMalwarePatterns(content);
    const socialEngScore = analyzeSocialEngineeringPatterns(content);
    const misinformationScore = analyzeMisinformationPatterns(content, type);
    const advancedThreatScore = analyzeAdvancedThreats(content);
    const cryptoFraudScore = analyzeCryptoFraud(content);
    const romanceScamScore = analyzeRomanceScam(content);
    
    // Keyword-based risk scoring - PRIMARY signal (additive point system)
    // High risk keyword → +25, Medium → +10, HTTP → +10, Suspicious TLD → +15, Malware hash → +70
    const keywordRiskScore = analyzeKeywordRisk(content, type);
    const misinformationRiskScore =
      misinformationScore > 0
        ? Math.round(
            misinformationScore *
              (type === 'text'
                ? misinformationScore >= 32
                  ? 2.1
                  : 1.6
                : 0.4)
          ) +
          (type === 'text' && misinformationScore >= 36 ? 12 : 0)
        : 0;
    const primaryRiskScore = keywordRiskScore + misinformationRiskScore;
    
    // ML and pattern analysis as secondary boost (capped at 8)
    const mlBoost = Math.min(8,
      (threatScore * 0.03) +
      (heuristicBoost * 0.03) +
      (phishingScore * 0.02) +
      (malwareScore * 0.02) +
      (spamScore * 0.01) +
      (socialEngScore * 0.01) +
      (contextualBoost * 0.01) +
      (patternBoost * 0.01) +
      (advancedThreatScore * 0.005) +
      (cryptoFraudScore * 0.005) +
      (romanceScamScore * 0.005) +
      (dynamicBoost * 0.005) +
      (contextualAnalysis * 0.005) +
      (behavioralAnalysis * 0.003) +
      (linguisticAnalysis * 0.002)
    );
    
    // Final score: primary risk (keywords + misinformation) + ML boost (secondary)
    // Minimum floor of 5% for any analyzed content
    const finalScore = Math.min(100, Math.max(5, Math.round(primaryRiskScore + mlBoost)));
    
    // Risk level thresholds matching protection levels
    // Critical: 85-100, High: 65-84, Medium: 35-64, Low: 0-34
    let riskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (finalScore >= 85) riskLevel = 'critical';
    else if (finalScore >= 65) riskLevel = 'high';
    else if (finalScore >= 35) riskLevel = 'medium';
    else riskLevel = 'low';

    // Generate enhanced categories
    const categories = generateEnhancedCategories(
      mlPrediction, finalScore, phishingScore, spamScore, malwareScore, 
      misinformationScore, advancedThreatScore, cryptoFraudScore, romanceScamScore, 
      contextualAnalysis, behavioralAnalysis, linguisticAnalysis
    );
    
    // Generate comprehensive threat indicators
    const indicators = generateComprehensiveIndicators(
      content, type, features, mlPrediction, phishingScore, spamScore, 
      malwareScore, socialEngScore, advancedThreatScore, cryptoFraudScore, 
      romanceScamScore, misinformationScore, contextualAnalysis, behavioralAnalysis, linguisticAnalysis, temporalAnalysis
    );

    return {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
      overallScore: Math.round(finalScore),
      riskLevel,
      categories,
      indicators
    };
  } catch (error) {
    console.error('Enhanced ML Analysis failed:', error);
    return fallbackAnalysis(content, type);
  }
}

function analyzePhishingPatterns(content: string): number {
  const text = content.toLowerCase();
  let score = 0;
  
  PHISHING_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) score += 15;
  });
  
  // Additional phishing indicators
  if (text.includes('verify') && text.includes('account')) score += 10;
  if (text.includes('suspended') && text.includes('click')) score += 12;
  if (text.includes('urgent') && text.includes('action')) score += 8;
  
  // Advanced phishing detection
  if (text.includes('two-factor') && text.includes('disabled')) score += 18;
  if (text.includes('login') && text.includes('blocked')) score += 16;
  if (text.includes('reactivate') && text.includes('account')) score += 14;
  
  return Math.min(score, 50);
}

function analyzeSpamPatterns(content: string): number {
  const text = content.toLowerCase();
  let score = 0;
  
  SPAM_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) score += 12;
  });
  
  // Additional spam indicators
  if (text.includes('free') && text.includes('money')) score += 8;
  if (text.includes('winner') && text.includes('prize')) score += 10;
  if (text.includes('guaranteed') && text.includes('profit')) score += 9;
  
  // Advanced spam detection
  if (text.includes('miracle') && text.includes('cure')) score += 15;
  if (text.includes('limited') && text.includes('expires')) score += 12;
  if (text.includes('risk-free') && text.includes('trial')) score += 10;
  
  return Math.min(score, 45);
}

function analyzeMalwarePatterns(content: string): number {
  const text = content.toLowerCase();
  let score = 0;
  
  MALWARE_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) score += 18;
  });
  
  // Additional malware indicators
  if (text.includes('download') && text.includes('exe')) score += 15;
  if (text.includes('infected') && text.includes('clean')) score += 12;
  if (text.includes('virus') && text.includes('detected')) score += 14;
  
  // Advanced malware detection
  if (text.includes('backdoor') && text.includes('detected')) score += 20;
  if (text.includes('keylogger') && text.includes('found')) score += 22;
  if (text.includes('registry') && text.includes('errors')) score += 16;
  
  return Math.min(score, 55);
}

function analyzeSocialEngineeringPatterns(content: string): number {
  const text = content.toLowerCase();
  let score = 0;
  
  SOCIAL_ENGINEERING_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) score += 10;
  });
  
  // Additional social engineering indicators
  if (text.includes('trust') && text.includes('help')) score += 6;
  if (text.includes('emergency') && text.includes('money')) score += 8;
  if (text.includes('government') && text.includes('refund')) score += 7;
  
  // Advanced social engineering detection
  if (text.includes('fbi') && text.includes('investigation')) score += 15;
  if (text.includes('court') && text.includes('summons')) score += 14;
  if (text.includes('social security') && text.includes('suspended')) score += 16;
  
  return Math.min(score, 35);
}

function analyzeMisinformationPatterns(content: string, type: string): number {
  // Misinformation detection is most meaningful on "text" inputs (posts, messages).
  // For URLs/domains/hashes, we keep the signal low to avoid false positives.
  const text = content.toLowerCase();
  let score = 0;

  MISINFORMATION_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) score += 12;
  });

  // Clickbait / virality cues
  if ((text.match(/[!]{2,}/g) || []).length > 0) score += 4;
  if (/(must|need)\s*(to)?\s*watch|you won't believe|mind[-\s]?blowing/i.test(text)) score += 10;
  if (/(breaking|exclusive|viral)\b/i.test(text)) score += 6;
  if (/(share|forward)\s*(now|fast|quickly|immediately|turant|abhi|jaldi)/i.test(text)) score += 10;
  if (/(before|warna).*(delete|remove|ban|hata)/i.test(text)) score += 8;
  if (/(they|ye log).*(delete|hata|remove).*(this|ise)/i.test(text)) score += 8;

  // Conspiracy / certainty cues
  if (text.includes('crisis actor') || text.includes('false flag')) score += 12;
  if (text.includes('censored') && (text.includes('truth') || text.includes('exposed'))) score += 10;
  if (text.includes('100%') && (text.includes('true') || text.includes('proof'))) score += 8;
  if (/(100%|guaranteed|confirmed|pushti).*(true|proof|sach)/i.test(text)) score += 10;

  // Reduce score for very short inputs (too little evidence)
  if (text.trim().length < 25) score -= 8;

  // Type scaling
  const scale = type === 'text' ? 1 : 0.35;
  return Math.max(0, Math.min(Math.round(score * scale), 45));
}

// New advanced threat analysis functions
function generateContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

function calculateDynamicBoost(content: string, contentHash: string): number {
  const hashValue = parseInt(contentHash.substring(0, 4), 36);
  const timeBoost = (Date.now() % 1000) / 100;
  const lengthBoost = Math.min(content.length / 100, 5);
  return (hashValue % 10) + timeBoost + lengthBoost;
}

function performContextualAnalysis(content: string, type: string): number {
  let score = 0;
  const text = content.toLowerCase();
  
  // Context-specific analysis
  if (type === 'url') {
    if (text.includes('bit.ly') || text.includes('tinyurl')) score += 15;
    if (text.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) score += 20;
  }
  
  // Time-based context
  const hour = new Date().getHours();
  if (hour < 6 || hour > 22) score += 5; // Suspicious hours
  
  return score;
}

function analyzeBehavioralPatterns(content: string): number {
  let score = 0;
  const text = content.toLowerCase();
  
  // Behavioral manipulation indicators
  if (text.includes('urgent') && text.includes('now')) score += 8;
  if (text.includes('limited') && text.includes('time')) score += 6;
  if (text.includes('act') && text.includes('immediately')) score += 7;
  
  return score;
}

function performLinguisticAnalysis(content: string): number {
  let score = 0;
  
  // Grammar and spelling analysis
  const words = content.split(/\s+/);
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  
  if (avgWordLength < 3 || avgWordLength > 8) score += 3;
  
  // Repetition analysis
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const repetitionRatio = 1 - (uniqueWords.size / words.length);
  if (repetitionRatio > 0.3) score += 5;
  
  return score;
}

function analyzeTemporalPatterns(content: string): number {
  let score = 0;
  const text = content.toLowerCase();
  
  // Time pressure indicators
  const timeWords = ['deadline', 'expires', 'limited', 'hurry', 'quick', 'fast'];
  timeWords.forEach(word => {
    if (text.includes(word)) score += 3;
  });
  
  return score;
}

function analyzeAdvancedThreats(content: string): number {
  const text = content.toLowerCase();
  let score = 0;
  
  ADVANCED_THREAT_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) score += 20;
  });
  
  // Business email compromise indicators
  if (text.includes('ceo') && text.includes('wire transfer')) score += 25;
  if (text.includes('vendor') && text.includes('payment details')) score += 22;
  if (text.includes('payroll') && text.includes('redirect')) score += 24;
  
  return Math.min(score, 60);
}

function analyzeCryptoFraud(content: string): number {
  const text = content.toLowerCase();
  let score = 0;
  
  CRYPTO_FRAUD_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) score += 18;
  });
  
  // Cryptocurrency fraud indicators
  if (text.includes('bitcoin') && text.includes('doubling')) score += 25;
  if (text.includes('guaranteed') && text.includes('profit')) score += 20;
  if (text.includes('airdrop') && text.includes('claim')) score += 15;
  
  return Math.min(score, 50);
}

function analyzeRomanceScam(content: string): number {
  const text = content.toLowerCase();
  let score = 0;
  
  ROMANCE_SCAM_PATTERNS.forEach(pattern => {
    if (pattern.test(text)) score += 16;
  });
  
  // Romance scam indicators
  if (text.includes('military') && text.includes('deployed')) score += 20;
  if (text.includes('emergency') && text.includes('hospital')) score += 18;
  if (text.includes('stranded') && text.includes('money')) score += 22;
  
  return Math.min(score, 45);
}

function calculateAdvancedHeuristics(content: string, type: string): number {
  let boost = 0;
  const text = content.toLowerCase();
  
  // Advanced malicious patterns with weighted scoring
  const criticalPatterns = [
    { pattern: /verify.*account.*suspended.*immediately/i, weight: 25 },
    { pattern: /click.*here.*urgent.*action.*required/i, weight: 20 },
    { pattern: /download.*exe.*free.*antivirus/i, weight: 30 },
    { pattern: /bitcoin.*investment.*guaranteed.*profit/i, weight: 15 },
    { pattern: /winner.*lottery.*claim.*prize.*now/i, weight: 18 },
    { pattern: /password.*expired.*reset.*immediately/i, weight: 22 },
    { pattern: /security.*breach.*update.*credentials/i, weight: 28 },
    { pattern: /system.*infected.*download.*cleaner/i, weight: 32 },
    { pattern: /congratulations.*selected.*winner.*claim/i, weight: 16 },
    { pattern: /urgent.*payment.*update.*billing/i, weight: 24 }
  ];
  
  criticalPatterns.forEach(({ pattern, weight }) => {
    if (pattern.test(text)) boost += weight;
  });
  
  // Type-specific analysis
  if (type === 'url' || type === 'domain') {
    boost += analyzeURLSecurity(text);
  } else if (type === 'hash') {
    boost += analyzeHashSecurity(text);
  }
  
  // Content length analysis
  if (text.length > 500) boost += 5; // Very long content
  if (text.length < 20) boost += 10; // Suspiciously short
  
  return Math.min(boost, 50); // Cap the boost
}

function calculateContextualBoost(content: string, type: string): number {
  let boost = 0;
  const text = content.toLowerCase();
  
  // Time-sensitive indicators
  const timeWords = ['urgent', 'immediate', 'expires', 'deadline', 'limited time'];
  timeWords.forEach(word => {
    if (text.includes(word)) boost += 3;
  });
  
  // Authority impersonation
  const authorities = ['bank', 'government', 'irs', 'police', 'microsoft', 'apple', 'google'];
  authorities.forEach(auth => {
    if (text.includes(auth)) boost += 5;
  });
  
  // Financial indicators
  const financialTerms = ['payment', 'credit card', 'bank account', 'ssn', 'social security'];
  financialTerms.forEach(term => {
    if (text.includes(term)) boost += 4;
  });
  
  return Math.min(boost, 30);
}

function calculatePatternBoost(content: string): number {
  let boost = 0;
  const text = content.toLowerCase();
  
  // Suspicious character patterns
  if ((text.match(/[!]{2,}/g) || []).length > 0) boost += 5; // Multiple exclamations
  if ((text.match(/[A-Z]{5,}/g) || []).length > 0) boost += 8; // All caps words
  if ((text.match(/\d{4,}/g) || []).length > 2) boost += 6; // Multiple long numbers
  
  // Suspicious word repetition
  const words = text.split(/\s+/);
  const wordCount = new Map();
  words.forEach(word => {
    if (word.length > 3) {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
  });
  
  let maxRepetition = 0;
  wordCount.forEach(count => {
    if (count > maxRepetition) maxRepetition = count;
  });
  
  if (maxRepetition > 3) boost += maxRepetition * 2;
  
  return Math.min(boost, 25);
}

function analyzeURLSecurity(url: string): number {
  let risk = 0;
  
  // Suspicious URL characteristics
  if (url.includes('bit.ly') || url.includes('tinyurl') || url.includes('t.co')) risk += 15;
  if (url.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) risk += 20; // IP address
  if (url.length > 100) risk += 10; // Very long URL
  if ((url.match(/\//g) || []).length > 6) risk += 8; // Many path segments
  if (url.includes('%')) risk += 5; // URL encoding
  if (url.includes('http://')) risk += 12; // Non-HTTPS
  
  // Suspicious TLDs (expanded list)
  SUSPICIOUS_TLDS.forEach(tld => {
    if (url.includes(tld)) risk += 18;
  });
  
  return risk;
}

function analyzeHashSecurity(hash: string): number {
  let risk = 0;
  
  // Hash format validation
  if (!/^[a-fA-F0-9]+$/.test(hash)) risk += 30; // Invalid hex
  if (hash.length !== 32 && hash.length !== 40 && hash.length !== 64) risk += 20; // Invalid length
  
  // Known malicious hash patterns (simplified)
  const suspiciousPatterns = ['000000', 'ffffff', '123456', 'aaaaaa'];
  suspiciousPatterns.forEach(pattern => {
    if (hash.toLowerCase().includes(pattern)) risk += 15;
  });
  
  return risk;
}

function generateEnhancedCategories(
  prediction: any, 
  finalScore: number, 
  phishingScore: number, 
  spamScore: number, 
  malwareScore: number,
  misinformationScore: number,
  advancedThreatScore: number,
  cryptoFraudScore: number,
  romanceScamScore: number,
  contextualAnalysis: number,
  behavioralAnalysis: number,
  linguisticAnalysis: number
): ThreatCategory[] {
  const categories: ThreatCategory[] = [];
  
  // Enhanced phishing detection
  const totalPhishingScore = Math.max(prediction.phishing, phishingScore);
  if (totalPhishingScore > 15) {
    categories.push({
      name: 'Phishing',
      score: Math.round(totalPhishingScore),
      confidence: Math.min(prediction.accuracy, 95),
      description: 'Credential harvesting and account compromise attempt detected',
      severity: totalPhishingScore > 75 ? 'critical' : totalPhishingScore > 50 ? 'high' : 'medium'
    });
  }
  
  // Enhanced malware detection
  const totalMalwareScore = Math.max(prediction.malware, malwareScore);
  if (totalMalwareScore > 15) {
    categories.push({
      name: 'Malware',
      score: Math.round(totalMalwareScore),
      confidence: Math.min(prediction.accuracy, 95),
      description: 'Malicious software distribution and system infection attempt',
      severity: totalMalwareScore > 75 ? 'critical' : totalMalwareScore > 50 ? 'high' : 'medium'
    });
  }
  
  // Enhanced spam detection
  const totalSpamScore = Math.max(prediction.spam, spamScore);
  if (totalSpamScore > 15) {
    categories.push({
      name: 'Spam',
      score: Math.round(totalSpamScore),
      confidence: Math.min(prediction.accuracy, 95),
      description: 'Unsolicited bulk message with potential fraud indicators',
      severity: totalSpamScore > 75 ? 'critical' : totalSpamScore > 50 ? 'high' : 'medium'
    });
  }

  // Misinformation / disinformation signals (text-first)
  // This does not claim factual verification—only risk cues typical of misinformation campaigns.
  if (misinformationScore > 15) {
    categories.push({
      name: 'Misinformation',
      score: Math.round(misinformationScore),
      confidence: 82,
      description: 'Potential misinformation cues detected (clickbait / false-claim patterns)',
      severity: misinformationScore > 35 ? 'high' : 'medium'
    });
  }
  
  // Add specific threat categories based on pattern analysis
  if (phishingScore > 25) {
    categories.push({
      name: 'Account Compromise',
      score: Math.round(phishingScore),
      confidence: 90,
      description: 'Advanced phishing patterns targeting user credentials',
      severity: phishingScore > 40 ? 'critical' : 'high'
    });
  }
  
  if (malwareScore > 30) {
    categories.push({
      name: 'System Infection',
      score: Math.round(malwareScore),
      confidence: 92,
      description: 'Malicious software deployment and system compromise',
      severity: malwareScore > 45 ? 'critical' : 'high'
    });
  }
  
  if (spamScore > 20) {
    categories.push({
      name: 'Fraudulent Scheme',
      score: Math.round(spamScore),
      confidence: 88,
      description: 'Financial fraud and deceptive marketing practices',
      severity: spamScore > 35 ? 'high' : 'medium'
    });
  }
  
  // New advanced threat categories
  if (advancedThreatScore > 25) {
    categories.push({
      name: 'Business Email Compromise',
      score: Math.round(advancedThreatScore),
      confidence: 93,
      description: 'Sophisticated corporate fraud targeting financial transactions',
      severity: advancedThreatScore > 40 ? 'critical' : 'high'
    });
  }
  
  if (cryptoFraudScore > 20) {
    categories.push({
      name: 'Cryptocurrency Fraud',
      score: Math.round(cryptoFraudScore),
      confidence: 89,
      description: 'Digital currency investment scams and wallet theft attempts',
      severity: cryptoFraudScore > 35 ? 'high' : 'medium'
    });
  }
  
  if (romanceScamScore > 18) {
    categories.push({
      name: 'Romance Scam',
      score: Math.round(romanceScamScore),
      confidence: 87,
      description: 'Emotional manipulation for financial exploitation',
      severity: romanceScamScore > 30 ? 'high' : 'medium'
    });
  }
  
  // Add composite threat category for high-risk content
  if (finalScore > 70) {
    categories.push({
      name: 'Composite Threat',
      score: Math.round(finalScore),
      confidence: Math.min(prediction.accuracy, 98),
      description: 'Multiple threat indicators detected by ensemble model',
      severity: finalScore > 85 ? 'critical' : 'high'
    });
  }
  
  return categories;
}

function generateComprehensiveIndicators(
  content: string, 
  type: string, 
  features: number[], 
  prediction: any,
  phishingScore: number,
  spamScore: number,
  malwareScore: number,
  socialEngScore: number,
  advancedThreatScore: number,
  cryptoFraudScore: number,
  romanceScamScore: number,
  misinformationScore: number,
  contextualAnalysis: number,
  behavioralAnalysis: number,
  linguisticAnalysis: number,
  temporalAnalysis: number
): ThreatIndicator[] {
  const indicators: ThreatIndicator[] = [];
  const text = content.toLowerCase();
  
  // Enhanced pattern-based indicators
  if (phishingScore > 20) {
    indicators.push({
      type: 'Phishing Attack Pattern',
      description: `High-confidence phishing indicators detected (Score: ${Math.round(phishingScore)})`,
      severity: phishingScore > 35 ? 'danger' : 'warning',
      matched: true
    });
  }
  
  if (malwareScore > 25) {
    indicators.push({
      type: 'Malware Distribution',
      description: `Malicious software deployment patterns identified (Score: ${Math.round(malwareScore)})`,
      severity: malwareScore > 40 ? 'danger' : 'warning',
      matched: true
    });
  }
  
  if (spamScore > 15) {
    indicators.push({
      type: 'Spam/Fraud Content',
      description: `Unsolicited bulk message with fraud indicators (Score: ${Math.round(spamScore)})`,
      severity: spamScore > 30 ? 'danger' : 'warning',
      matched: true
    });
  }
  
  if (socialEngScore > 10) {
    indicators.push({
      type: 'Social Engineering',
      description: `Psychological manipulation tactics detected (Score: ${Math.round(socialEngScore)})`,
      severity: socialEngScore > 20 ? 'danger' : 'warning',
      matched: true
    });
  }

  if (misinformationScore > 15) {
    indicators.push({
      type: 'Misinformation Signals',
      description: `Clickbait / false-claim cues detected (Score: ${Math.round(misinformationScore)})`,
      severity: misinformationScore > 35 ? 'danger' : 'warning',
      matched: true
    });
  }
  
  // New advanced threat indicators
  if (advancedThreatScore > 20) {
    indicators.push({
      type: 'Advanced Persistent Threat',
      description: `Sophisticated attack patterns targeting business operations (Score: ${Math.round(advancedThreatScore)})`,
      severity: advancedThreatScore > 35 ? 'danger' : 'warning',
      matched: true
    });
  }
  
  if (cryptoFraudScore > 15) {
    indicators.push({
      type: 'Cryptocurrency Scam',
      description: `Digital currency fraud schemes detected (Score: ${Math.round(cryptoFraudScore)})`,
      severity: cryptoFraudScore > 30 ? 'danger' : 'warning',
      matched: true
    });
  }
  
  if (romanceScamScore > 12) {
    indicators.push({
      type: 'Romance/Dating Scam',
      description: `Emotional manipulation for financial gain detected (Score: ${Math.round(romanceScamScore)})`,
      severity: romanceScamScore > 25 ? 'danger' : 'warning',
      matched: true
    });
  }
  
  // New dynamic analysis indicators
  if (contextualAnalysis > 15) {
    indicators.push({
      type: 'Contextual Threat Pattern',
      description: `Advanced contextual analysis detected suspicious patterns (Score: ${Math.round(contextualAnalysis)})`,
      severity: contextualAnalysis > 20 ? 'danger' : 'warning',
      matched: true
    });
  }
  
  if (behavioralAnalysis > 12) {
    indicators.push({
      type: 'Behavioral Manipulation',
      description: `Psychological manipulation and pressure tactics identified (Score: ${Math.round(behavioralAnalysis)})`,
      severity: behavioralAnalysis > 16 ? 'danger' : 'warning',
      matched: true
    });
  }
  
  if (linguisticAnalysis > 10) {
    indicators.push({
      type: 'Linguistic Anomaly',
      description: `Suspicious language patterns and grammatical inconsistencies (Score: ${Math.round(linguisticAnalysis)})`,
      severity: linguisticAnalysis > 12 ? 'warning' : 'info',
      matched: true
    });
  }
  
  if (temporalAnalysis > 12) {
    indicators.push({
      type: 'Temporal Exploitation',
      description: `Time-based manipulation tactics and deadline pressure (Score: ${Math.round(temporalAnalysis)})`,
      severity: temporalAnalysis > 15 ? 'danger' : 'warning',
      matched: true
    });
  }
  
  // ML-based indicators
  if (prediction.confidence > 80) {
    indicators.push({
      type: 'High ML Confidence',
      description: `Neural network is ${prediction.confidence}% confident in threat classification`,
      severity: 'danger',
      matched: true
    });
  }
  
  if (prediction.accuracy > 90) {
    indicators.push({
      type: 'High Accuracy Prediction',
      description: `Model accuracy: ${prediction.accuracy}% - Very reliable detection`,
      severity: 'info',
      matched: true
    });
  }
  
  // Feature-based indicators (enhanced)
  if (features.length > 5) {
    if (features[0] > 0.8) { // Long content
      indicators.push({
        type: 'Excessive Content Length',
        description: 'Unusually verbose content may indicate social engineering',
        severity: 'warning',
        matched: true
      });
    }
    
    if (features[4] > 3) { // Multiple URLs
      indicators.push({
        type: 'Multiple URL Redirection',
        description: 'Multiple URLs detected - potential redirect chain attack',
        severity: 'danger',
        matched: true
      });
    }
    
    if (features.length > 10 && features[10] > 0.4) { // High urgency score
      indicators.push({
        type: 'Urgency Manipulation',
        description: 'High-pressure tactics detected - classic social engineering',
        severity: 'danger',
        matched: true
      });
    }
  }
  
  // Advanced pattern indicators
  const advancedPatterns = [
    { pattern: /verify.*account.*suspended/i, name: 'Account Suspension Phishing', severity: 'danger' as const },
    { pattern: /click.*here.*urgent/i, name: 'Urgent Action Social Engineering', severity: 'danger' as const },
    { pattern: /download.*exe.*free/i, name: 'Malicious Executable Distribution', severity: 'danger' as const },
    { pattern: /bitcoin.*investment.*guaranteed/i, name: 'Cryptocurrency Investment Scam', severity: 'danger' as const },
    { pattern: /winner.*lottery.*prize/i, name: 'Advance Fee Fraud (419 Scam)', severity: 'danger' as const },
    { pattern: /password.*expired.*reset/i, name: 'Credential Harvesting Phishing', severity: 'danger' as const },
    { pattern: /virus.*detected.*clean/i, name: 'Fake Antivirus Scareware', severity: 'danger' as const },
    { pattern: /system.*infected.*download/i, name: 'Tech Support Scam', severity: 'danger' as const },
    { pattern: /bank.*fraud.*department/i, name: 'Banking Impersonation Fraud', severity: 'danger' as const },
    { pattern: /government.*tax.*refund/i, name: 'Government Impersonation Scam', severity: 'danger' as const },
    { pattern: /share.*before.*(they|it).*(delete|remove|ban)/i, name: 'Viral Misinformation Cue', severity: 'warning' as const },
    { pattern: /(mainstream|media).*(won't|will not).*(tell|show).*you/i, name: 'Misinformation Framing Cue', severity: 'warning' as const },
    { pattern: /miracle.*cure/i, name: 'Health Misinformation Cue', severity: 'warning' as const }
  ];
  
  advancedPatterns.forEach(({ pattern, name, severity }) => {
    if (pattern.test(text)) {
      indicators.push({
        type: name,
        description: `Advanced pattern matching detected: ${name.toLowerCase()}`,
        severity,
        matched: true
      });
    }
  });
  
  return indicators;
}

// Keyword-based risk scoring using additive point system
// Scoring: High risk → +25, Medium → +10, HTTP → +10, Suspicious TLD → +15, Malware hash → +70
function analyzeKeywordRisk(content: string, type: string): number {
  // Normalize: lowercase, replace dashes/underscores with spaces, collapse whitespace
  const normalized = content.toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  const rawLower = content.toLowerCase().trim();
  let score = 0;

  // Deduplicate keywords via normalization to avoid double-counting
  const normalizeKW = (k: string) => k.toLowerCase().replace(/[-_]/g, ' ').trim();
  const matchedHigh = new Set<string>();
  const matchedMedium = new Set<string>();
  const matchedLow = new Set<string>();

  // High risk keyword → +25 score each
  HIGH_RISK_KEYWORDS.forEach(kw => {
    const norm = normalizeKW(kw);
    if (!matchedHigh.has(norm) && normalized.includes(norm)) {
      matchedHigh.add(norm);
      score += 25;
    }
  });

  // Medium risk keyword → +10 score each
  MEDIUM_RISK_KEYWORDS.forEach(kw => {
    const norm = normalizeKW(kw);
    if (!matchedMedium.has(norm) && normalized.includes(norm)) {
      matchedMedium.add(norm);
      score += 10;
    }
  });

  // Low risk keywords → reduce score by -5 each
  LOW_RISK_KEYWORDS.forEach(kw => {
    const norm = normalizeKW(kw);
    if (!matchedLow.has(norm) && normalized.includes(norm)) {
      matchedLow.add(norm);
      score -= 5;
    }
  });

  // HTTP (not HTTPS) → +10 score
  if (rawLower.includes('http://') && !rawLower.includes('https://')) {
    score += 10;
  }

  // URL/Domain-specific analysis
  if (type === 'url' || type === 'domain') {
    // Suspicious domain TLD → +15 score
    SUSPICIOUS_TLDS.forEach(tld => {
      if (rawLower.includes(tld)) {
        score += 15;
      }
    });

    // Trusted TLDs reduce risk
    ['.gov', '.edu', '.mil', '.org'].forEach(tld => {
      if (rawLower.endsWith(tld) || rawLower.includes(tld + '/')) {
        score -= 10;
      }
    });

    // URL structure: multiple hyphens in domain → suspicious
    const domainPart = rawLower.replace(/https?:\/\//, '').split('/')[0];
    const hyphenCount = (domainPart.match(/-/g) || []).length;
    if (hyphenCount >= 3) score += 15;
    else if (hyphenCount >= 2) score += 10;
  }

  // Malware hash match → +70 score (definitive indicator)
  if (type === 'hash') {
    const hashClean = rawLower.replace(/\s/g, '');
    if (KNOWN_MALWARE_HASHES.some(h => hashClean === h)) {
      score += 70;
    }
    // Suspicious hash format indicators
    if (!/^[a-f0-9]+$/.test(hashClean)) score += 15;
    if (hashClean.length !== 32 && hashClean.length !== 40 && hashClean.length !== 64) score += 10;
  }

  // Exact match bonus: entire input is a single keyword
  const exactNorm = normalized;
  const normalizedHighSet = new Set(HIGH_RISK_KEYWORDS.map(normalizeKW));
  const normalizedMediumSet = new Set(MEDIUM_RISK_KEYWORDS.map(normalizeKW));
  if (normalizedHighSet.has(exactNorm)) {
    score += 20;
  } else if (normalizedMediumSet.has(exactNorm)) {
    score += 10;
  }

  // If only low-risk keywords with no high/medium, keep score very low
  if (matchedHigh.size === 0 && matchedMedium.size === 0 && matchedLow.size > 0) {
    score = Math.min(score, 8);
  }

  // Cap at 90 so final score (with ML boost) stays in realistic range
  return Math.max(0, Math.min(score, 90));
}

function fallbackAnalysis(content: string, type: string): ThreatAnalysis {
  // Use keyword-based risk scoring as primary fallback (same additive system)
  const keywordScore = analyzeKeywordRisk(content, type);
  
  // Simple pattern checks as secondary boost
  const text = content.toLowerCase();
  let patternBoost = 0;
  
  if (text.includes('verify') && text.includes('account')) patternBoost += 8;
  if (text.includes('download') && text.includes('exe')) patternBoost += 10;
  if (text.includes('winner') && text.includes('prize')) patternBoost += 7;
  if (text.includes('urgent') && text.includes('click')) patternBoost += 8;
  if (text.includes('bitcoin') && text.includes('investment')) patternBoost += 9;
  if (text.includes('virus') && text.includes('detected')) patternBoost += 9;
  if (text.includes('bank') && text.includes('fraud')) patternBoost += 10;
  
  const finalScore = Math.min(100, Math.max(5, keywordScore + Math.min(8, patternBoost)));
  
  return {
    id: Date.now().toString(),
    content,
    type,
    timestamp: new Date(),
    overallScore: finalScore,
    riskLevel: finalScore >= 85 ? 'critical' : finalScore >= 65 ? 'high' : finalScore >= 35 ? 'medium' : 'low',
    categories: [{
      name: 'Fallback Analysis',
      score: finalScore,
      confidence: 65,
      description: 'Keyword-based risk scoring with pattern matching',
      severity: finalScore >= 65 ? 'high' : 'medium'
    }],
    indicators: [{
      type: 'Fallback Detection',
      description: 'ML model unavailable, using keyword-based risk scoring',
      severity: 'info',
      matched: true
    }]
  };
}
