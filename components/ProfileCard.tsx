
import React from 'react';
import { AccountProfile, ProfileStatus, Platform, BrowserMode } from '../types';
import { 
  Globe, 
  Monitor, 
  Smartphone, 
  Bird,
  Chrome,
  Pencil,
  Trash2,
  ExternalLink,
  Zap,
  ShieldCheck,
  Download
} from 'lucide-react';

interface ProfileCardProps {
  profile: AccountProfile;
  onLogin: (id: string) => void;
  onDirectLogin?: (url: string) => void;
  onDuplicate: (profile: AccountProfile) => void;
  onEdit: (profile: AccountProfile) => void;
  onDelete?: (id: string) => void;
  onDownload?: (profile: AccountProfile) => void;
  onToggleMode: (id: string, mode: BrowserMode) => void;
  onUpdateStatus: (id: string, status: ProfileStatus) => void;
  isRunning?: boolean;
  lang?: 'id' | 'en';
  isHighMode?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  profile, 
  onLogin, 
  onDirectLogin,
  onEdit, 
  onDelete,
  onDownload,
  isRunning, 
  lang = 'id',
  isHighMode = false
}) => {
  const isKiwi = profile.browserMode === 'KIWI';
  
  const translations = {
    id: {
      active: "AKTIF",
      delete: "Hapus Akun",
      direct: "Bypass & Luncurkan",
      download: "Ekspor Profil",
      internal: isHighMode ? "MASUK MODE STEALTH" : "Klik untuk Masuk",
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
      active: "ACTIVE",
      delete: "Delete Account",
      direct: "Bypass & Launch",
      download: "Export Profile",
      internal: isHighMode ? "ENTER STEALTH MODE" : "Click to Login",
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
  const platformLabel = t.platforms[profile.platform] || profile.platform;

  const isHighSecurity = [
    Platform.GOOGLE, 
    Platform.FACEBOOK, 
    Platform.INSTAGRAM, 
    Platform.LINKEDIN,
    Platform.YOUTUBE
  ].includes(profile.platform);

  return (
    <div 
      className={`group relative border transition-all duration-500 cursor-pointer overflow-hidden rounded-[3rem] p-8 ${
        isHighMode 
          ? 'bg-black border-indigo-900/40 hover:border-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)]' 
          : 'bg-[#1e2227]/40 border-white/5 hover:bg-[#1e2227] hover:border-indigo-500/50 shadow-xl'
      } ${isRunning ? 'ring-2 ring-indigo-500' : ''}`}
      onClick={() => onLogin(profile.id)}
    >
      {/* Visual Glitch Background for High Mode */}
      {isHighMode && (
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(79,70,229,0.02)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_5s_infinite_linear] pointer-events-none" />
      )}

      {/* Quick Actions Overlay */}
      <div className="absolute top-4 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-y-2 group-hover:translate-y-0">
        <button 
          onClick={(e) => { e.stopPropagation(); onDirectLogin?.(profile.url); }}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white shadow-xl active:scale-90"
          title={t.direct}
        >
          <ExternalLink size={16} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDownload?.(profile); }}
          className={`p-3 rounded-2xl transition-colors active:scale-90 ${isHighMode ? 'bg-indigo-950 text-indigo-400 hover:bg-indigo-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          title={t.download}
        >
          <Download size={16} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(profile); }}
          className={`p-3 rounded-2xl transition-colors active:scale-90 ${isHighMode ? 'bg-indigo-950 text-indigo-400 hover:bg-indigo-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
          <Pencil size={16} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete?.(profile.id); }}
          className={`p-3 rounded-2xl transition-colors active:scale-90 ${isHighMode ? 'bg-indigo-950 text-indigo-900 hover:text-rose-500 hover:bg-rose-500/10' : 'bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-500/20'}`}
          title={t.delete}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex flex-col items-center text-center gap-6 relative z-10">
        <div className="relative">
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center border transition-all duration-500 overflow-hidden relative ${
            isHighMode 
              ? 'bg-black border-indigo-500/30 group-hover:border-indigo-500 group-hover:scale-110 shadow-[0_0_20px_rgba(79,70,229,0.1)]' 
              : 'bg-gradient-to-tr from-slate-800 to-slate-900 border-white/10 group-hover:scale-110 shadow-2xl'
          }`}>
            {profile.platform === Platform.GOOGLE ? (
              <Globe size={48} className={isHighMode ? 'text-indigo-500' : 'text-blue-400'} />
            ) : (
              <div className={`text-4xl font-black ${isHighMode ? 'text-indigo-500' : 'text-white'}`}>{platformLabel[0]}</div>
            )}
            
            {/* Status Badge */}
            {(isHighSecurity || isHighMode) && (
              <div className="absolute top-0 right-0 bg-indigo-600 px-2 py-1 rounded-bl-xl shadow-lg">
                <ShieldCheck size={10} className="text-white" />
              </div>
            )}
          </div>
          
          <div className={`absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl flex items-center justify-center border shadow-2xl transition-colors ${isHighMode ? 'bg-black border-indigo-900 text-indigo-500' : 'bg-slate-900 border-slate-800 text-indigo-400'}`}>
             {profile.isDesktop ? <Monitor size={18} /> : <Smartphone size={18} />}
          </div>
        </div>

        <div className="space-y-2 w-full">
          <h3 className={`font-black text-lg truncate px-2 transition-colors ${isHighMode ? 'text-indigo-300' : 'text-white'}`}>{profile.name}</h3>
          <div className="flex items-center justify-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isHighMode ? 'text-indigo-900' : 'text-slate-500'}`}>{platformLabel}</span>
            {isRunning && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-500">{t.active}</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full pt-2 flex flex-col items-center gap-4">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-colors ${isHighMode ? 'bg-black border-indigo-900/50 text-indigo-800' : 'bg-slate-950/80 border-white/5 text-slate-400'}`}>
            {isKiwi ? <Bird size={14} /> : <Chrome size={14} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{profile.browserMode}</span>
          </div>
          
          <div className={`text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 ${isHighMode ? 'text-indigo-500' : 'text-indigo-400'}`}>
             <Zap size={12} className="fill-current" />
             {t.internal}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
