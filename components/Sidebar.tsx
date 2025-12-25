
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Settings, 
  HelpCircle, 
  Plus,
  Share2,
  Lock,
  LayoutGrid,
  Database,
  ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddProfile: () => void;
  lang?: 'id' | 'en';
  isHighMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onAddProfile, lang = 'id', isHighMode = false }) => {
  const translations = {
    id: {
      dashboard: "Dashboard",
      profiles: "Profil Akun",
      multiView: "Multi View Grid",
      security: "Keamanan",
      sessions: "Sesi Aktif",
      settings: "Pengaturan",
      help: "Bantuan",
      newProfile: "Tambah Profil"
    },
    en: {
      dashboard: "Dashboard",
      profiles: "Account Profiles",
      multiView: "Multi View Grid",
      security: "Security",
      sessions: "Active Sessions",
      settings: "Settings",
      help: "Help",
      newProfile: "New Profile"
    }
  };

  const t = translations[lang];

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'profiles', label: t.profiles, icon: Users },
    { id: 'multi-view', label: t.multiView, icon: LayoutGrid },
    { id: 'security', label: t.security, icon: ShieldCheck },
    { id: 'sessions', label: t.sessions, icon: Database },
  ];

  const bottomItems = [
    { id: 'settings', label: t.settings, icon: Settings },
    { id: 'help', label: t.help, icon: HelpCircle },
  ];

  return (
    <div className={`w-72 h-full border-r flex flex-col p-6 transition-all duration-700 ${isHighMode ? 'bg-black border-indigo-900/20' : 'bg-slate-950 border-white/5'}`}>
      <div className="flex items-center gap-3 mb-10 px-2 group">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all ${isHighMode ? 'bg-black border border-indigo-500 shadow-indigo-600/10' : 'bg-indigo-600 shadow-indigo-600/20'}`}>
          <Share2 size={24} className={isHighMode ? 'text-indigo-500' : 'text-white'} />
        </div>
        <div>
          <h1 className={`text-xl font-black tracking-tight transition-colors ${isHighMode ? 'text-indigo-400' : 'text-white'}`}>SocialFlow</h1>
          {isHighMode && <p className="text-[8px] font-black text-indigo-900 uppercase tracking-[0.3em] leading-none mt-1">Stealth Hub Active</p>}
        </div>
      </div>

      <button 
        onClick={onAddProfile}
        className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 mb-8 active:scale-95 ${
          isHighMode 
            ? 'bg-black border border-indigo-600 text-indigo-400 hover:bg-indigo-600/10' 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
        }`}
      >
        <Plus size={18} />
        {t.newProfile}
      </button>

      <div className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${
              activeTab === item.id 
                ? (isHighMode ? 'bg-indigo-900/10 text-indigo-400 border border-indigo-900/30' : 'bg-white/5 text-indigo-400')
                : (isHighMode ? 'text-indigo-900 hover:text-indigo-400 hover:bg-indigo-950/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5')
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-indigo-400' : (isHighMode ? 'text-indigo-900' : 'text-slate-600')} />
            {item.label}
          </button>
        ))}
      </div>

      <div className={`space-y-1 pt-6 border-t ${isHighMode ? 'border-indigo-900/20' : 'border-white/5'}`}>
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${
              activeTab === item.id 
                ? (isHighMode ? 'bg-indigo-900/10 text-indigo-400' : 'bg-white/5 text-indigo-400')
                : (isHighMode ? 'text-indigo-900 hover:text-indigo-400 hover:bg-indigo-950/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5')
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-indigo-400' : (isHighMode ? 'text-indigo-900' : 'text-slate-600')} />
            {item.label}
          </button>
        ))}
      </div>

      <div className={`mt-8 p-5 rounded-[2.5rem] border transition-all ${isHighMode ? 'bg-black border-indigo-900/40 shadow-[0_0_20px_rgba(79,70,229,0.05)]' : 'bg-indigo-600/5 border-indigo-500/10'}`}>
        <div className="flex items-center gap-2 mb-2">
          {isHighMode ? <ShieldAlert size={12} className="text-indigo-500 animate-pulse" /> : <Lock size={12} className="text-indigo-400" />}
          <span className={`text-[10px] font-black uppercase tracking-widest ${isHighMode ? 'text-indigo-500' : 'text-indigo-400'}`}>
            {isHighMode ? 'STEALTH STRENGTH: 99%' : 'Security Active'}
          </span>
        </div>
        <p className={`text-[10px] font-medium leading-relaxed ${isHighMode ? 'text-indigo-900' : 'text-slate-500'}`}>
          {isHighMode 
            ? 'Total Anti-Fingerprint & Stealth Bridge diaktifkan secara global.' 
            : 'Semua sesi terisolasi dan dienkripsi secara lokal.'}
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
