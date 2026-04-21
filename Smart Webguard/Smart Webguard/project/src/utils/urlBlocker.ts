// URL Blocking System - Malicious websites ko block karta hai

export interface BlockedURL {
  url: string;
  blockedAt: Date;
  reason: string;
  threatScore: number;
  category: string;
}

export class URLBlocker {
  private blockedURLs: Map<string, BlockedURL> = new Map();
  private blockCallback: ((url: string) => void) | null = null;

  constructor() {
    // Load blocked URLs from localStorage
    this.loadBlockedURLs();
  }

  private loadBlockedURLs() {
    try {
      const stored = localStorage.getItem('blockedURLs');
      if (stored) {
        const data = JSON.parse(stored);
        data.forEach((item: BlockedURL) => {
          this.blockedURLs.set(item.url, {
            ...item,
            blockedAt: new Date(item.blockedAt)
          });
        });
      }
    } catch (error) {
      console.error('Failed to load blocked URLs:', error);
    }
  }

  private saveBlockedURLs() {
    try {
      const data = Array.from(this.blockedURLs.values());
      localStorage.setItem('blockedURLs', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save blocked URLs:', error);
    }
  }

  blockURL(url: string, reason: string, threatScore: number, category: string) {
    const blocked: BlockedURL = {
      url,
      blockedAt: new Date(),
      reason,
      threatScore,
      category
    };

    this.blockedURLs.set(url, blocked);
    this.saveBlockedURLs();

    if (this.blockCallback) {
      this.blockCallback(url);
    }
  }

  isBlocked(url: string): boolean {
    // Check exact URL match
    if (this.blockedURLs.has(url)) {
      return true;
    }

    // Check domain match
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      for (const [blockedUrl] of this.blockedURLs) {
        try {
          const blockedDomain = new URL(blockedUrl).hostname;
          if (domain === blockedDomain || domain.endsWith(`.${blockedDomain}`)) {
            return true;
          }
        } catch {
          continue;
        }
      }
    } catch {
      return false;
    }

    return false;
  }

  getBlockedInfo(url: string): BlockedURL | null {
    return this.blockedURLs.get(url) || null;
  }

  unblockURL(url: string) {
    this.blockedURLs.delete(url);
    this.saveBlockedURLs();
  }

  getBlockedList(): BlockedURL[] {
    return Array.from(this.blockedURLs.values()).sort(
      (a, b) => b.blockedAt.getTime() - a.blockedAt.getTime()
    );
  }

  clearAll() {
    this.blockedURLs.clear();
    this.saveBlockedURLs();
  }

  setBlockCallback(callback: (url: string) => void) {
    this.blockCallback = callback;
  }
}

// Singleton instance
let urlBlocker: URLBlocker | null = null;

export function getURLBlocker(): URLBlocker {
  if (!urlBlocker) {
    urlBlocker = new URLBlocker();
  }
  return urlBlocker;
}
