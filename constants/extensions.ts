
import { Extension } from '../types';

export const AVAILABLE_EXTENSIONS: Extension[] = [
  {
    id: 'ublock-origin',
    name: 'uBlock Origin',
    description: 'Blokir iklan dan tracker yang mengganggu secara efisien.',
    version: '1.55.0',
    icon: '🛡️',
    category: 'Privacy'
  },
  {
    id: 'cookie-editor',
    name: 'Cookie Editor',
    description: 'Kelola, edit, dan impor cookies untuk bypass login.',
    version: '2.1.0',
    icon: '🍪',
    category: 'Utility'
  },
  {
    id: 'proxy-switchy',
    name: 'Proxy SwitchyOmega',
    description: 'Manajemen proxy tingkat lanjut dengan auto-switch rules.',
    version: '2.5.21',
    icon: '🌐',
    category: 'Security'
  },
  {
    id: 'fingerprint-defender',
    name: 'Fingerprint Defender',
    description: 'Melindungi kanvas dan audio fingerprinting dari deteksi.',
    version: '1.0.4',
    icon: '🎭',
    category: 'Security'
  },
  {
    id: 'user-agent-switcher',
    name: 'User-Agent Switcher',
    description: 'Ganti User-Agent secara dinamis berdasarkan rule tertentu.',
    version: '0.2.7',
    icon: '📱',
    category: 'Utility'
  },
  {
    id: 'auto-refresh',
    name: 'Auto Refresh Plus',
    description: 'Refresh halaman otomatis dengan monitoring konten.',
    version: '7.5.1',
    icon: '🔄',
    category: 'Automation'
  }
];
