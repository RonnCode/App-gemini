
import React, { useState, useEffect, useMemo } from 'react';
import { Platform, ProxyType, Extension, AccountProfile, BrowserMode } from '../types';
import { AVAILABLE_EXTENSIONS } from '../constants/extensions';
import { 
  X, 
  Globe, 
  User, 
  Monitor, 
  ChevronDown, 
  Smartphone, 
  Cpu, 
  RotateCcw, 
  Puzzle, 
  Check, 
  Bird, 
  Chrome,
  EyeOff,
  Wrench,
  Zap,
  Lock,
  Network
} from 'lucide-react';

interface ProfileFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: AccountProfile;
  prefillPlatform?: Platform | null;
  lang?: 'id' | 'en';
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onClose, onSubmit, initialData, prefillPlatform, lang = 'id' }) => {
  const DESKTOP_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Mobile Safari/537.36';

  const defaultUrls: Record<string, string> = {
    [Platform.GOOGLE]: 'https://accounts.google.com',
    [Platform.FACEBOOK]: 'https://www.facebook.com/login',
    [Platform.TWITTER]: 'https://x.com/login',
    [Platform.INSTAGRAM]: 'https://www.instagram.com/accounts/login',
    [Platform.LINKEDIN]: 'https://www.linkedin.com/login',
    [Platform.YOUTUBE]: 'https://www.youtube.com',
    [Platform.TIKTOK]: 'https://www.tiktok.com/login',
    [Platform.OTHER]: 'https://www.google.com'
  };

  const translations = {
    id: {
      title: initialData ? 'Edit Profil' : 'Konfigurasi Profil',
      subtitle: initialData ? `Memperbarui ${initialData.name}` : 'Setup Akun Terisolasi',
      labelPlaceholder: "Nama Label Akun (Contoh: Akun Utama FB)",
      browserEngine: "Simulasi Mesin Browser",
      identity: "Identitas & Perangkat",
      uaConfig: "Konfigurasi User Agent",
      reset: "Reset ke",
      extensions: "Pustaka Ekstensi",
      active: "Aktif",
      proxyConfig: "Konfigurasi Proxy",
      cancel: "Batal",
      save: initialData ? 'Update Profil' : 'Simpan Profil',
      proxyNone: "TANPA PROXY",
      security: "Keamanan",
      privacy: "Privasi",
      utility: "Utilitas",
      automation: "Automasi",
      platforms: {
        [Platform.GOOGLE]: "Google",
        [Platform.FACEBOOK]: "Facebook",
        [Platform.TWITTER]: "Twitter",
        [Platform.INSTAGRAM]: "Instagram",
        [Platform.LINKEDIN]: "LinkedIn",
        [Platform.YOUTUBE]: "YouTube",
        [Platform.TIKTOK]: "TikTok",
        [Platform.OTHER]: "Lainnya"
      }
    },
    en: {
      title: initialData ? 'Edit Profile' : 'Profile Configuration',
      subtitle: initialData ? `Updating ${initialData.name}` : 'Isolated Account Setup',
      labelPlaceholder: "Account Label Name",
      browserEngine: "Browser Engine Simulation",
      identity: "Identity & Device",
      uaConfig: "User Agent Configuration",
      reset: "Reset to",
      extensions: "Extensions Library",
      active: "Active",
      proxyConfig: "Proxy Configuration",
      cancel: "Cancel",
      save: initialData ? 'Update Profile' : 'Save Profile',
      proxyNone: "NO PROXY",
      security: "Security",
      privacy: "Privacy",
      utility: "Utility",
      automation: "Automation",
      platforms: {
        [Platform.GOOGLE]: "Google",
        [Platform.FACEBOOK]: "Facebook",
        [Platform.TWITTER]: "Twitter",
        [Platform.INSTAGRAM]: "Instagram",
        [Platform.LINKEDIN]: "LinkedIn",
        [Platform.YOUTUBE]: "YouTube",
        [Platform.TIKTOK]: "TikTok",
        [Platform.OTHER]: "Other"
      }
    }
  };

  const t = translations[lang];

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    platform: initialData?.platform || prefillPlatform || Platform.FACEBOOK,
    url: initialData?.url || (prefillPlatform ? defaultUrls[prefillPlatform] : defaultUrls[Platform.FACEBOOK]),
    isDesktop: initialData?.isDesktop ?? false,
    browserMode: initialData?.browserMode || 'STANDARD' as BrowserMode,
    userAgent: initialData?.userAgent || MOBILE_UA,
    proxy: {
      type: initialData?.proxyConfig?.type || 'NONE' as ProxyType,
      host: initialData?.proxyConfig?.host || '',
      port: initialData?.proxyConfig?.port || ''
    },
    activeExtensions: initialData?.activeExtensions || [] as string[]
  });

  useEffect(() => {
    if (prefillPlatform && !initialData) {
      setFormData(prev => ({
        ...prev,
        platform: prefillPlatform,
        url: defaultUrls[prefillPlatform] || defaultUrls[Platform.OTHER],
        name: `${translations[lang].platforms[prefillPlatform]} Profile`
      }));
    }
  }, [prefillPlatform, lang]);

  const [activeExtCategory, setActiveExtCategory] = useState<Extension['category']>('Security');

  const categories: { id: Extension['category']; label: string; icon: any }[] = [
    { id: 'Security', label: t.security, icon: Lock },
    { id: 'Privacy', label: t.privacy, icon: EyeOff },
    { id: 'Utility', label: t.utility, icon: Wrench },
    { id: 'Automation', label: t.automation, icon: Zap },
  ];

  const filteredExtensions = useMemo(() => {
    return AVAILABLE_EXTENSIONS.filter(ext => ext.category === activeExtCategory);
  }, [activeExtCategory]);

  const toggleDeviceMode = (isDesktop: boolean) => {
    setFormData({
      ...formData,
      isDesktop,
      userAgent: isDesktop ? DESKTOP_UA : MOBILE_UA
    });
  };

  const setBrowserMode = (mode: BrowserMode) => {
    setFormData({
      ...formData,
      browserMode: mode,
      ...(mode === 'KIWI' ? { isDesktop: false, userAgent: MOBILE_UA } : {})
    });
  };

  const handleProxyTypeChange = (type: ProxyType) => {
    setFormData({
      ...formData,
      proxy: { ...formData.proxy, type }
    });
  };

  const toggleExtension = (id: string) => {
    setFormData(prev => ({
      ...prev,
      activeExtensions: prev.activeExtensions.includes(id)
        ? prev.activeExtensions.filter(extId => extId !== id)
        : [...prev.activeExtensions, id]
    }));
  };

  const resetUserAgent = () => {
    setFormData({
      ...formData,
      userAgent: formData.isDesktop ? DESKTOP_UA : MOBILE_UA
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure URL is sync with platform before submitting if it was somehow lost
    const finalData = {
      ...formData,
      url: defaultUrls[formData.platform] || formData.url
    };
    onSubmit(finalData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-lg my-8 shadow-2xl relative">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md rounded-t-[2.5rem]">
          <div>
            <h2 className="text-2xl font-black text-white">{t.title}</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
              {t.subtitle}
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-850 hover:bg-slate-800 rounded-2xl transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Bird className="text-emerald-500" size={16} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.browserEngine}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <button 
                 type="button"
                 onClick={() => setBrowserMode('STANDARD')}
                 className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${formData.browserMode === 'STANDARD' ? 'bg-indigo-600/10 border-indigo-500/50 ring-2 ring-indigo-500/20' : 'bg-slate-950 border-slate-800 opacity-60'}`}
               >
                 <Chrome size={20} className={formData.browserMode === 'STANDARD' ? 'text-indigo-400' : 'text-slate-500'} />
                 <div>
                   <p className={`text-[11px] font-black uppercase ${formData.browserMode === 'STANDARD' ? 'text-white' : 'text-slate-500'}`}>Chromium</p>
                   <p className="text-[9px] text-slate-500 font-bold">Standard PC/Mobile</p>
                 </div>
               </button>
               <button 
                 type="button"
                 onClick={() => setBrowserMode('KIWI')}
                 className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${formData.browserMode === 'KIWI' ? 'bg-emerald-600/10 border-emerald-500/50 ring-2 ring-emerald-500/20' : 'bg-slate-950 border-slate-800 opacity-60'}`}
               >
                 <Bird size={20} className={formData.browserMode === 'KIWI' ? 'text-emerald-400' : 'text-slate-500'} />
                 <div>
                   <p className={`text-[11px] font-black uppercase ${formData.browserMode === 'KIWI' ? 'text-white' : 'text-slate-500'}`}>Kiwi Browser</p>
                   <p className="text-[9px] text-slate-500 font-bold">Extension Mobile Hub</p>
                 </div>
               </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="text-indigo-500" size={16} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.identity}</span>
            </div>
            
            <div className="relative group">
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder={t.labelPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all placeholder:text-slate-700 font-medium text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <select 
                  value={formData.platform}
                  onChange={e => {
                    const p = e.target.value as Platform;
                    setFormData({...formData, platform: p, url: defaultUrls[p] || formData.url});
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-6 pr-10 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-600 appearance-none transition-all font-medium text-slate-200"
                >
                  {Object.values(Platform).map(p => (
                    <option key={p} value={p} className="bg-slate-900">{t.platforms[p]}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={16} />
              </div>

              <div className="flex bg-slate-950 border border-slate-800 rounded-2xl p-1">
                 <button 
                   type="button"
                   disabled={formData.browserMode === 'KIWI'}
                   onClick={() => toggleDeviceMode(false)}
                   className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${!formData.isDesktop ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                 >
                   <Smartphone size={14} />
                   <span className="text-[9px] font-black uppercase">Mobile</span>
                 </button>
                 <button 
                   type="button"
                   disabled={formData.browserMode === 'KIWI'}
                   onClick={() => toggleDeviceMode(true)}
                   className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${formData.isDesktop ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'} ${formData.browserMode === 'KIWI' ? 'opacity-30' : ''}`}
                 >
                   <Monitor size={14} />
                   <span className="text-[9px] font-black uppercase">PC</span>
                 </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 group focus-within:border-indigo-500/50 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="text-indigo-400" size={14} />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.uaConfig}</span>
                </div>
                <button 
                  type="button"
                  onClick={resetUserAgent}
                  className="text-[8px] font-black text-indigo-500 hover:text-indigo-400 uppercase flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={10} />
                  {t.reset} {formData.isDesktop ? 'PC' : 'Mobile'}
                </button>
              </div>
              <textarea 
                rows={2}
                value={formData.userAgent}
                onChange={e => setFormData({...formData, userAgent: e.target.value})}
                className="w-full bg-transparent border-none p-0 text-[10px] font-mono text-slate-400 leading-relaxed outline-none resize-none scrollbar-hide focus:text-indigo-300 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Puzzle className="text-amber-500" size={16} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.extensions}</span>
              </div>
              <span className="text-[8px] font-bold text-slate-600 uppercase bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                {formData.activeExtensions.length} {t.active}
              </span>
            </div>

            <div className="flex gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveExtCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${
                    activeExtCategory === cat.id 
                    ? 'bg-slate-800 text-indigo-400 shadow-lg' 
                    : 'text-slate-600 hover:text-slate-400'
                  }`}
                >
                  <cat.icon size={12} />
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800 min-h-[160px]">
              {filteredExtensions.map((ext) => (
                <button
                  key={ext.id}
                  type="button"
                  onClick={() => toggleExtension(ext.id)}
                  className={`flex items-center gap-4 p-3 rounded-2xl border transition-all text-left group animate-in fade-in slide-in-from-right-2 duration-200 ${
                    formData.activeExtensions.includes(ext.id)
                      ? 'bg-indigo-600/10 border-indigo-500/50'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl bg-slate-900 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                    {ext.icon}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-black ${formData.activeExtensions.includes(ext.id) ? 'text-indigo-400' : 'text-slate-200'}`}>
                        {ext.name}
                      </h4>
                      {formData.activeExtensions.includes(ext.id) && <Check size={14} className="text-indigo-400" />}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{ext.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-[2rem] space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="text-emerald-500" size={16} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.proxyConfig}</span>
              </div>
            </div>

            <div className="flex gap-2">
               {(['NONE', 'HTTP', 'SOCKS5'] as ProxyType[]).map((type) => (
                 <button
                   key={type}
                   type="button"
                   onClick={() => handleProxyTypeChange(type)}
                   className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black transition-all ${
                     formData.proxy.type === type 
                     ? 'bg-indigo-600 border-indigo-500 text-white' 
                     : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
                   }`}
                 >
                   {type === 'NONE' ? t.proxyNone : type}
                 </button>
               ))}
            </div>

            {formData.proxy.type !== 'NONE' && (
              <div className="grid grid-cols-3 gap-3">
                <input 
                  type="text"
                  value={formData.proxy.host}
                  onChange={e => setFormData({...formData, proxy: {...formData.proxy, host: e.target.value}})}
                  placeholder="IP / Hostname"
                  className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-slate-200"
                />
                <input 
                  type="text"
                  value={formData.proxy.port}
                  onChange={e => setFormData({...formData, proxy: {...formData.proxy, port: e.target.value}})}
                  placeholder="Port"
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-slate-200"
                />
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-750 font-bold text-sm transition-all text-slate-400 active:scale-95"
            >
              {t.cancel}
            </button>
            <button 
              type="submit" 
              className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm transition-all text-white shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-2"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
