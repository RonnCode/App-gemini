
export enum Platform {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  TWITTER = 'TWITTER',
  INSTAGRAM = 'INSTAGRAM',
  LINKEDIN = 'LINKEDIN',
  YOUTUBE = 'YOUTUBE',
  TIKTOK = 'TIKTOK',
  OTHER = 'OTHER'
}

export enum ProfileStatus {
  READY = 'READY',
  ACTIVE = 'ACTIVE',
  CONNECTED = 'CONNECTED',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
  ERROR = 'ERROR',
  UPDATING = 'UPDATING'
}

export type ProxyType = 'NONE' | 'HTTP' | 'SOCKS5';
export type BrowserMode = 'STANDARD' | 'KIWI';
export type ViewMode = 'DEFAULT' | 'DESKTOP';

export interface ProxyConfig {
  type: ProxyType;
  host?: string;
  port?: string;
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  icon: string;
  category: 'Security' | 'Privacy' | 'Utility' | 'Automation';
}

export interface AccountProfile {
  id: string;
  name: string;
  platform: Platform;
  url: string;
  lastLogin: string;
  status: ProfileStatus;
  userAgent: string;
  isDesktop: boolean;
  browserMode: BrowserMode;
  proxyConfig: ProxyConfig;
  fingerprint: string;
  tags: string[];
  activeExtensions: string[];
  cookies?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
