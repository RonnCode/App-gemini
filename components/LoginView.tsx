
import React, { useState } from 'react';
import { Share2, ArrowRight, Loader2, Sparkles, Shield, Zap, Globe, RefreshCcw } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string) => void;
  onCancel?: () => void;
  lang?: 'id' | 'en';
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onCancel, lang = 'id' }) => {
  const [isLoading, setIsLoading] = useState(false);

  const translations = {
    id: {
      headline: "Akses semua akun media sosial Anda dalam satu lingkungan terisolasi yang aman.",
      initializing: "Memulai Hub...",
      launch: "Luncurkan Ruang Kerja",
      isolated: "Terisolasi",
      sync: "Sinkron Cepat",
      multiGeo: "Multi-Geo",
      version: "Multi-Login Sosial v2.5",
      trouble: "Aplikasi Blank? Klik Reset",
      confirmReset: "Ini akan menghapus semua profil. Lanjutkan?"
    },
    en: {
      headline: "Access all your social accounts in one secure isolated environment.",
      initializing: "Initializing Hub...",
      launch: "Launch Workspace",
      isolated: "Isolated",
      sync: "Fast Sync",
      multiGeo: "Multi-Geo",
      version: "Social Multi-Login v2.5",
      trouble: "App Blank? Click Reset",
      confirmReset: "This will delete all profiles. Continue?"
    }
  };

  const t = translations[lang];

  const handleLaunch = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin('admin@socialflow.io');
    }, 1000);
  };

  const handleEmergencyReset = () => {
    if (window.confirm(t.confirmReset)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden p-6 font-sans">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse" />
      
      <div className="w-full max-w-2xl z-10 flex flex-col items-center">
        {/* Logo Section */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative w-24 h-24 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 rotate-6 group-hover:rotate-0 transition-all duration-700">
            <Share2 className="text-white" size={44} />
          </div>
        </div>

        {/* Hero Text */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
            SocialFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Connect</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-md mx-auto leading-relaxed">
            {t.headline}
          </p>
        </div>

        {/* Main CTA Card */}
        <div className="w-full max-w-sm bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative space-y-6 text-center">
            <button 
              onClick={handleLaunch}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 group active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span className="uppercase tracking-[0.2em] text-xs">{t.initializing}</span>
                </>
              ) : (
                <>
                  <span className="uppercase tracking-[0.2em] text-xs">{t.launch}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button 
              onClick={handleEmergencyReset}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-600 hover:text-rose-500 transition-colors tracking-widest"
            >
              <RefreshCcw size={10} />
              {t.trouble}
            </button>

            <div className="pt-2 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <Shield size={16} className="text-indigo-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{t.isolated}</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <Zap size={16} className="text-blue-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{t.sync}</span>
              </div>
              <div className="w-px h-4 bg-slate-800" />
              <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <Globe size={16} className="text-emerald-400" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{t.multiGeo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 flex items-center gap-3">
          <div className="h-px w-8 bg-slate-800" />
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
            <Sparkles size={12} className="text-indigo-500" />
            {t.version}
            <Sparkles size={12} className="text-indigo-500" />
          </div>
          <div className="h-px w-8 bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export default LoginView;
