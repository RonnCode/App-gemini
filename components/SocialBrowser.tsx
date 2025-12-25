
import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Bird, 
  AppWindow,
  ShieldAlert,
  ArrowLeft,
  RefreshCw,
  Globe,
  MessageSquareText,
  Loader2,
  AlertCircle,
  Maximize2,
  Lock,
  ChevronRight,
  Shield,
  Smartphone,
  MousePointer2,
  AlertTriangle,
  Minus,
  Square,
  X as CloseIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Search,
  Download,
  Trash2
} from 'lucide-react';
import { AccountProfile, Platform, ViewMode } from '../types';
import { getLoginAssistance } from '../services/geminiService';

interface SocialBrowserProps {
  profile: AccountProfile;
  onBack: () => void;
  onLogout: (id: string) => void;
  onDelete?: () => void;
  onDownload?: () => void;
  lang?: 'id' | 'en';
  forceIsolation?: boolean;
  viewMode?: ViewMode;
}

const SocialBrowser: React.FC<SocialBrowserProps> = ({ 
  profile, 
  onBack, 
  onLogout, 
  onDelete,
  onDownload,
  lang = 'id', 
  forceIsolation = false,
  viewMode = 'DEFAULT'
}) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [assistance, setAssistance] = useState<string | null>(null);
  const [isGettingAssistance, setIsGettingAssistance] = useState(false);
  const [showPopupAlert, setShowPopupAlert] = useState(false);
  const [isMobileForced, setIsMobileForced] = useState(viewMode === 'DESKTOP' ? false : !profile.isDesktop);
  
  const translations = {
    id: {
      encrypted: forceIsolation ? "STEALTH ENCRYPTED" : "Bridge Aman",
      engine: "Shield",
      isolationTitle: forceIsolation ? "TOTAL STEALTH ISOLATION" : "Bypass Keamanan Diperlukan",
      isolationDesc: forceIsolation 
        ? `MODE TINGGI AKTIF: Platform ini dijalankan dalam Sandbox terenkripsi penuh untuk menghindari deteksi sidik jari.`
        : `Situs ${profile.platform} mendeteksi 'Frame Security'. Untuk menghindari layar blank, silakan pilih metode akses di bawah ini.`,
      isolatedBtn: "JENDELA TERISOLASI",
      newTabBtn: "BUKA DI TAB BARU (PALING AMAN)",
      back: "Dashboard",
      retry: "Muat Ulang",
      aiHelp: "Masih blank? Tanya AI",
      aiLoading: "Menganalisis sistem...",
      aiTitle: "AI Troubleshooter",
      launchQuick: "Luncurkan",
      popupTitle: "Pop-up Terblokir!",
      popupDesc: "Klik ikon kotak di pojok kanan bar alamat browser Anda dan pilih 'Selalu izinkan' agar jendela login bisa terbuka.",
      forceMobile: "Paksa Mode Mobile",
      forceDesktop: "Gunakan Mode Desktop",
      delete: "Hapus Akun",
      download: "Download Config"
    },
    en: {
      encrypted: forceIsolation ? "STEALTH ENCRYPTED" : "Secure Bridge",
      engine: "Shield",
      isolationTitle: forceIsolation ? "TOTAL STEALTH ISOLATION" : "Security Bypass Required",
      isolationDesc: forceIsolation 
        ? `HIGH MODE ACTIVE: This platform is running in a fully encrypted sandbox to avoid all fingerprint detection.`
        : `${profile.platform} detected 'Frame Security'. To prevent blank screens, please choose an access method below.`,
      isolatedBtn: "ISOLATED WINDOW",
      newTabBtn: "OPEN IN NEW TAB (SAFEST)",
      back: "Dashboard",
      retry: "Reload",
      aiHelp: "Still blank? Ask AI",
      aiLoading: "Analyzing system...",
      aiTitle: "AI Troubleshooter",
      launchQuick: "Launch",
      popupTitle: "Pop-up Blocked!",
      popupDesc: "Click the square icon in the top right of your browser's address bar and select 'Always allow' to open the login window.",
      forceMobile: "Force Mobile Mode",
      forceDesktop: "Use Desktop Mode",
      delete: "Delete Account",
      download: "Download Config"
    }
  };

  const t = translations[lang];

  const getTargetUrl = () => {
    let url = profile.url;
    // In desktop mode, we ignore mobile force for a true PC experience
    if (viewMode === 'DESKTOP') {
      return url;
    }
    if (isMobileForced) {
      if (profile.platform === Platform.FACEBOOK) url = url.replace('www.facebook.com', 'm.facebook.com');
      if (profile.platform === Platform.YOUTUBE) url = url.replace('www.youtube.com', 'm.youtube.com');
    }
    return url;
  };

  const launchWindow = (asNewTab = false) => {
    const url = getTargetUrl();
    
    if (asNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const width = 1100;
    const height = 800;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    const win = window.open(
      url,
      `profile_${profile.id}`,
      `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no,location=yes,resizable=yes`
    );

    if (!win || win.closed || typeof win.closed === 'undefined') {
      setShowPopupAlert(true);
    } else {
      setShowPopupAlert(false);
    }
  };

  const handleGetAssistance = async () => {
    setIsGettingAssistance(true);
    const help = await getLoginAssistance(profile.platform, getTargetUrl());
    setAssistance(help);
    setIsGettingAssistance(false);
  };

  const isStrictPlatform = forceIsolation || [
    Platform.GOOGLE, 
    Platform.FACEBOOK, 
    Platform.INSTAGRAM, 
    Platform.YOUTUBE, 
    Platform.TIKTOK,
    Platform.TWITTER,
    Platform.LINKEDIN
  ].includes(profile.platform) || profile.url.includes('google') || profile.url.includes('facebook');

  const isDesktopMode = viewMode === 'DESKTOP';

  return (
    <div className={`flex flex-col h-full w-full relative transition-all duration-500 ${forceIsolation ? 'bg-black' : 'bg-[#0a0f1e]'} ${isDesktopMode ? 'p-4' : ''}`}>
      
      {/* Desktop Mode Window Decorations */}
      {isDesktopMode && (
        <div className="bg-slate-800 rounded-t-2xl px-6 py-3 flex items-center justify-between border-t border-x border-white/10 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/50" />
            </div>
            <div className="h-4 w-px bg-white/5" />
            <div className="flex items-center gap-3">
              <ChevronLeft size={16} className="text-slate-500" />
              <ChevronRightIcon size={16} className="text-slate-500" />
              <RefreshCw 
                size={14} 
                className="text-slate-500 hover:text-white transition-colors cursor-pointer" 
                onClick={() => setIframeKey(k => k + 1)} 
              />
            </div>
          </div>
          <div className="flex-1 max-w-2xl mx-10">
            <div className="bg-slate-900 rounded-lg px-4 py-1.5 flex items-center gap-3 border border-white/5 group">
              <Lock size={12} className="text-emerald-500" />
              <span className="text-[10px] text-slate-500 font-mono truncate select-none">{getTargetUrl()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{profile.platform} SESSION</div>
             <button onClick={onBack} className="p-1 text-slate-500 hover:text-white transition-all"><CloseIcon size={16} /></button>
          </div>
        </div>
      )}

      {/* Toolbar - Integrated or Standalone */}
      <div className={`h-14 backdrop-blur-md flex items-center justify-between px-6 border-b shrink-0 z-20 transition-all ${isDesktopMode ? 'bg-slate-900/50 border-x border-white/10' : (forceIsolation ? 'bg-black/80 border-indigo-900/30' : 'bg-slate-900/80 border-white/5')}`}>
        <div className="flex items-center gap-4">
          {!isDesktopMode && (
            <button 
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className={`h-4 w-px ${forceIsolation ? 'bg-indigo-900/50' : 'bg-white/10'}`} />
          <div className="flex items-center gap-3">
             <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg transition-all ${forceIsolation ? 'bg-indigo-950 border border-indigo-500 text-indigo-400' : 'bg-indigo-600 shadow-indigo-600/20'}`}>
               {profile.platform[0]}
             </div>
             <div>
               <p className={`text-[10px] font-black uppercase tracking-widest leading-none ${forceIsolation ? 'text-indigo-400' : 'text-white'}`}>{profile.name}</p>
               <p className={`text-[8px] font-bold mt-1 uppercase tracking-tighter ${forceIsolation ? 'text-indigo-900' : 'text-slate-500'}`}>{profile.platform}</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Action Tools */}
          <div className="flex items-center bg-black/20 rounded-xl p-1 mr-2 border border-white/5">
             <button 
                onClick={onDownload}
                className={`p-1.5 rounded-lg transition-all ${forceIsolation ? 'text-indigo-900 hover:text-indigo-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                title={t.download}
              >
                <Download size={16} />
              </button>
              <button 
                onClick={onDelete}
                className={`p-1.5 rounded-lg transition-all ${forceIsolation ? 'text-indigo-900 hover:text-rose-500' : 'text-slate-500 hover:text-rose-500 hover:bg-rose-500/10'}`}
                title={t.delete}
              >
                <Trash2 size={16} />
              </button>
          </div>

          {!isDesktopMode && (
            <button 
              onClick={() => setIsMobileForced(!isMobileForced)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${isMobileForced ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
            >
              <Smartphone size={12} />
              {isMobileForced ? t.forceMobile : t.forceDesktop}
            </button>
          )}
          <button 
            onClick={() => setIframeKey(k => k + 1)}
            className={`p-2 rounded-xl transition-all ${forceIsolation ? 'text-indigo-900 hover:text-indigo-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
          >
            <RefreshCw size={18} />
          </button>
          <button 
            onClick={() => launchWindow(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg active:scale-95 ${
              forceIsolation 
                ? 'bg-black border border-indigo-500 text-indigo-400 hover:bg-indigo-600/10' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            <Maximize2 size={14} />
            {t.launchQuick}
          </button>
        </div>
      </div>

      <div className={`flex-1 relative overflow-hidden flex flex-col ${isDesktopMode ? 'border-x border-b border-white/10 rounded-b-2xl shadow-2xl' : ''}`}>
        {isStrictPlatform ? (
          <div className={`flex-1 flex items-center justify-center p-8 relative overflow-hidden transition-colors ${forceIsolation ? 'bg-black' : 'bg-slate-950'}`}>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] via-transparent to-transparent opacity-50 ${forceIsolation ? 'from-indigo-900/20' : 'from-indigo-600/10'}`} />
            
            <div className={`w-full max-w-xl backdrop-blur-xl border rounded-[3.5rem] p-12 text-center shadow-2xl relative z-10 animate-in zoom-in-95 duration-500 ${forceIsolation ? 'bg-black/60 border-indigo-900/50' : 'bg-slate-900/60 border-white/10'}`}>
              
              <div className="relative inline-block mb-8">
                <div className={`absolute inset-0 blur-2xl opacity-20 animate-pulse ${forceIsolation ? 'bg-indigo-400' : 'bg-indigo-500'}`} />
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center relative border transition-all ${forceIsolation ? 'bg-black border-indigo-500' : 'bg-slate-900 border-white/10'}`}>
                  <Shield size={40} className="text-indigo-400" />
                </div>
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center border-4 shadow-xl ${forceIsolation ? 'bg-indigo-600 border-black' : 'bg-indigo-600 border-slate-900'}`}>
                  <Lock size={14} className="text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-white mb-4 tracking-tight">{t.isolationTitle}</h2>
              <p className={`text-sm mb-10 leading-relaxed max-w-sm mx-auto font-medium ${forceIsolation ? 'text-indigo-900' : 'text-slate-400'}`}>
                {t.isolationDesc}
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => launchWindow(false)}
                  className={`w-full py-5 rounded-[2rem] font-black text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98] group ${
                    forceIsolation 
                      ? 'bg-black border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 shadow-indigo-600/10' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/40'
                  }`}
                >
                  <AppWindow size={18} /> 
                  {t.isolatedBtn}
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => launchWindow(true)}
                  className={`w-full py-5 border rounded-[2rem] font-black text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${
                    forceIsolation 
                      ? 'bg-black border-indigo-900/50 text-indigo-900 hover:text-indigo-400' 
                      : 'bg-slate-800/50 hover:bg-slate-800 text-indigo-400 border-indigo-500/20'
                  }`}
                >
                  <ExternalLink size={18} /> 
                  {t.newTabBtn}
                </button>
              </div>

              {showPopupAlert && (
                <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/30 rounded-3xl text-left animate-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-3 mb-2 text-rose-500">
                    <AlertTriangle size={18} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{t.popupTitle}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    {t.popupDesc}
                  </p>
                </div>
              )}

              <div className={`mt-10 border-t pt-8 ${forceIsolation ? 'border-indigo-900/20' : 'border-white/5'}`}>
                {!assistance && !isGettingAssistance ? (
                  <button 
                    onClick={handleGetAssistance}
                    className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-colors group ${forceIsolation ? 'text-indigo-900 hover:text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}
                  >
                    <MessageSquareText size={14} className="group-hover:scale-110 transition-transform" />
                    {t.aiHelp}
                  </button>
                ) : (
                  <div className={`rounded-[2.5rem] p-6 text-left border animate-in fade-in zoom-in duration-300 ${forceIsolation ? 'bg-black border-indigo-900/30' : 'bg-black/40 border-white/5'}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Bird size={14} className="text-indigo-400" />
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{t.aiTitle}</span>
                    </div>
                    {isGettingAssistance ? (
                      <div className="flex items-center gap-3 text-slate-500 py-2">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-[10px] font-bold italic tracking-wider">{t.aiLoading}</span>
                      </div>
                    ) : (
                      <div className="flex gap-4 items-start">
                        <AlertCircle size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                        <p className={`text-[11px] leading-relaxed font-medium italic ${forceIsolation ? 'text-indigo-300' : 'text-slate-300'}`}>
                          "{assistance}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col bg-white">
            <iframe
              key={iframeKey}
              src={getTargetUrl()}
              className="flex-1 border-none"
              title={`Browser ${profile.platform}`}
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals"
            />
            <div className={`h-10 border-t flex items-center justify-center px-4 ${forceIsolation ? 'bg-black border-indigo-900/30' : 'bg-slate-900 border-white/5'}`}>
              <button 
                onClick={() => launchWindow(true)}
                className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${forceIsolation ? 'text-indigo-900 hover:text-indigo-400' : 'text-indigo-400 hover:text-indigo-300'}`}
              >
                <MousePointer2 size={10} />
                Halaman Tidak Muncul? Klik Untuk Buka di Tab Baru
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialBrowser;
