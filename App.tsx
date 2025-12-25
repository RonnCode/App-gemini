
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import ProfileCard from './components/ProfileCard';
import ProfileForm from './components/ProfileForm';
import SocialBrowser from './components/SocialBrowser';
import LoginView from './components/LoginView';
import MultiView from './components/MultiView';
import { AccountProfile, ProfileStatus, Platform, BrowserMode, ViewMode } from './types';
import { 
  Plus, 
  Search, 
  User, 
  Users,
  Languages, 
  Check, 
  Bell,
  Settings as SettingsIcon,
  LogOut,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Monitor,
  Layout,
  Download,
  Trash2
} from 'lucide-react';

type Language = 'id' | 'en';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profiles, setProfiles] = useState<AccountProfile[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [runningProfileId, setRunningProfileId] = useState<string | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('id');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);
  const [isHighMode, setIsHighMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('DEFAULT');

  const translations = {
    id: {
      dashboardTitle: "Dashboard Utama",
      dashboardDesc: isHighMode ? "MODE TINGGI AKTIF: Enkripsi Militer & Isolasi Total." : "Kelola semua profil akun Anda dari satu tempat.",
      searchPlaceholder: "Cari profil atau platform...",
      noProfiles: "Belum ada profil yang dibuat.",
      language: "Bahasa",
      logout: "Keluar",
      confirmDelete: "Hapus profil ini secara permanen?",
      confirmClearAll: "PERINGATAN: Hapus SEMUA profil? Tindakan ini tidak bisa dibatalkan.",
      highMode: "Mode Stealth Tinggi",
      modeDefault: "Default Hub",
      modeDesktop: "Desktop Pro",
      exportAll: "Backup Semua",
      clearAll: "Wipe Database"
    },
    en: {
      dashboardTitle: "Main Dashboard",
      dashboardDesc: isHighMode ? "HIGH MODE ACTIVE: Military Encryption & Total Isolation." : "Manage all your account profiles from one place.",
      searchPlaceholder: "Search profiles or platforms...",
      noProfiles: "No profiles created yet.",
      language: "Language",
      logout: "Logout",
      confirmDelete: "Permanently delete this profile?",
      confirmClearAll: "WARNING: Delete ALL profiles? This action cannot be undone.",
      highMode: "High Stealth Mode",
      modeDefault: "Default Hub",
      modeDesktop: "Desktop Pro",
      exportAll: "Export All",
      clearAll: "Wipe Database"
    }
  };

  const t = (key: keyof typeof translations['id']): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    try {
      const savedStatus = localStorage.getItem('social_flow_auth');
      if (savedStatus === 'true') {
        setIsLoggedIn(true);
      }
      const savedProfiles = localStorage.getItem('social_multi_login_profiles');
      if (savedProfiles) {
        const parsed = JSON.parse(savedProfiles);
        if (Array.isArray(parsed)) {
          setProfiles(parsed);
        }
      }
      const savedLang = localStorage.getItem('app_lang') as Language;
      if (savedLang) setLanguage(savedLang);
      
      const savedHighMode = localStorage.getItem('high_mode_active');
      if (savedHighMode === 'true') setIsHighMode(true);

      const savedViewMode = localStorage.getItem('view_mode') as ViewMode;
      if (savedViewMode) setViewMode(savedViewMode);
    } catch (e) {
      console.error("App Initialization Error", e);
      setAppError("Terjadi kesalahan memuat data. Klik Reset di halaman Login.");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('high_mode_active', isHighMode.toString());
  }, [isHighMode]);

  useEffect(() => {
    localStorage.setItem('view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('social_multi_login_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const handleAppLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('social_flow_auth', 'true');
  };

  const handleAppLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('social_flow_auth');
    setRunningProfileId(null);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_lang', lang);
    setShowLangMenu(false);
  };

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.platform.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [profiles, searchQuery]);

  const handleOpenProfile = (id: string) => {
    setRunningProfileId(id);
  };

  const handleDirectLaunch = (url: string) => {
    window.open(url, '_blank');
  };

  const handleToggleMode = (id: string, newMode: BrowserMode) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === id) {
        const isDesktop = newMode === 'KIWI' ? false : p.isDesktop;
        return { ...p, browserMode: newMode, isDesktop };
      }
      return p;
    }));
  };

  const handleDeleteProfile = (id: string) => {
    if (window.confirm(t('confirmDelete'))) {
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (runningProfileId === id) setRunningProfileId(null);
    }
  };

  const handleClearAllProfiles = () => {
    if (window.confirm(t('confirmClearAll'))) {
      setProfiles([]);
      setRunningProfileId(null);
    }
  };

  const handleDownloadProfile = (profile: AccountProfile) => {
    const dataStr = JSON.stringify(profile, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, '_')}_config.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAll = () => {
    const dataStr = JSON.stringify(profiles, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SocialFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmitProfile = (data: any) => {
    if (editingProfileId) {
      setProfiles(prev => prev.map(p => p.id === editingProfileId ? { ...p, ...data, id: p.id } : p));
      setEditingProfileId(null);
    } else {
      const newAccount: AccountProfile = {
        ...data,
        id: Math.random().toString(36).substring(2, 11),
        lastLogin: new Date().toISOString(),
        status: ProfileStatus.READY,
        fingerprint: Math.random().toString(16).substring(2, 18),
        tags: [data.platform],
        activeExtensions: []
      };
      setProfiles([...profiles, newAccount]);
    }
    setShowProfileForm(false);
  };

  if (appError) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-10 text-center">
        <AlertTriangle size={64} className="text-amber-500 mb-6" />
        <h1 className="text-2xl font-black text-white mb-2">System Error</h1>
        <p className="text-slate-400 max-w-md mb-8">{appError}</p>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="px-8 py-4 bg-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-xl shadow-indigo-600/20"
        >
          Reset Aplikasi
        </button>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginView onLogin={handleAppLogin} lang={language} />;
  }

  if (runningProfileId) {
    const profile = profiles.find(p => p.id === runningProfileId);
    if (profile) {
      return (
        <SocialBrowser 
          profile={profile} 
          onBack={() => setRunningProfileId(null)} 
          onLogout={() => setRunningProfileId(null)} 
          onDelete={() => handleDeleteProfile(profile.id)}
          onDownload={() => handleDownloadProfile(profile)}
          lang={language}
          forceIsolation={isHighMode}
          viewMode={viewMode}
        />
      );
    }
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'multi-view':
        return (
          <MultiView 
            profiles={profiles} 
            lang={language} 
            isHighMode={isHighMode} 
            viewMode={viewMode} 
            onDeleteProfile={handleDeleteProfile}
            onDownloadProfile={handleDownloadProfile}
          />
        );
      default:
        return (
          <main className={`flex-1 overflow-y-auto p-10 transition-all duration-700 ${isHighMode ? 'bg-[#050505]' : 'bg-slate-900/20'}`}>
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className={`text-3xl font-black tracking-tight transition-colors duration-500 ${isHighMode ? 'text-indigo-400' : 'text-white'}`}>
                  {t('dashboardTitle')}
                </h2>
                <p className={`mt-2 font-medium transition-colors duration-500 ${isHighMode ? 'text-indigo-900/80' : 'text-slate-500'}`}>
                  {t('dashboardDesc')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isHighMode && (
                  <div className="flex items-center gap-3 px-6 py-3 bg-indigo-600/10 border border-indigo-500/30 rounded-[2rem] animate-pulse">
                    <ShieldCheck size={18} className="text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Total Stealth Isolation Active</span>
                  </div>
                )}
                {profiles.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleExportAll}
                      className={`p-3 rounded-2xl transition-all flex items-center gap-2 group ${isHighMode ? 'bg-indigo-900/20 text-indigo-400 hover:bg-indigo-600/20' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                      title={t('exportAll')}
                    >
                      <Download size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block">{t('exportAll')}</span>
                    </button>
                    <button 
                      onClick={handleClearAllProfiles}
                      className={`p-3 rounded-2xl transition-all flex items-center gap-2 group ${isHighMode ? 'bg-rose-500/5 text-rose-500/40 hover:bg-rose-500/20' : 'bg-slate-800 text-slate-400 hover:text-rose-500'}`}
                      title={t('clearAll')}
                    >
                      <Trash2 size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block">{t('clearAll')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProfiles.map(p => (
                  <ProfileCard 
                    key={p.id} 
                    profile={p} 
                    onLogin={handleOpenProfile}
                    onDirectLogin={handleDirectLaunch}
                    onDuplicate={() => {}} 
                    onEdit={() => { setEditingProfileId(p.id); setShowProfileForm(true); }}
                    onDelete={handleDeleteProfile}
                    onDownload={() => handleDownloadProfile(p)}
                    onToggleMode={handleToggleMode}
                    onUpdateStatus={() => {}}
                    lang={language}
                    isHighMode={isHighMode}
                  />
                ))}
                <button 
                  onClick={() => { setEditingProfileId(null); setShowProfileForm(true); }}
                  className={`aspect-[4/5] rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 group ${isHighMode ? 'border-indigo-900/20 hover:border-indigo-500/50 hover:bg-indigo-500/5' : 'border-white/5 hover:border-indigo-500/30 hover:bg-indigo-600/5'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isHighMode ? 'bg-indigo-900/20 text-indigo-500 group-hover:scale-110' : 'bg-slate-900 text-slate-600 group-hover:text-indigo-400 group-hover:scale-110'}`}>
                    <Plus size={32} />
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest transition-colors ${isHighMode ? 'text-indigo-900' : 'text-slate-600 group-hover:text-indigo-400'}`}>Tambah Profil</span>
                </button>
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-center">
                <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-6 transition-colors ${isHighMode ? 'bg-indigo-900/10 text-indigo-900' : 'bg-slate-900 text-slate-700'}`}>
                  <Users size={48} />
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">{t('noProfiles')}</p>
                <button 
                  onClick={() => setShowProfileForm(true)}
                  className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 transition-all"
                >
                  Buat Profil Pertama
                </button>
              </div>
            )}
          </main>
        );
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-700 ${isHighMode ? 'bg-black text-indigo-200' : 'bg-slate-950 text-slate-200'}`}>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAddProfile={() => { setEditingProfileId(null); setShowProfileForm(true); }} 
        lang={language}
        isHighMode={isHighMode}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className={`h-20 border-b flex items-center justify-between px-10 shrink-0 transition-all duration-500 ${isHighMode ? 'border-indigo-900/20 bg-black/40' : 'border-white/5 bg-slate-950/20'}`}>
          <div className="flex items-center gap-6 flex-1">
            {/* Tab Switcher */}
            <div className={`flex p-1 rounded-2xl border transition-all ${isHighMode ? 'bg-black border-indigo-900/30' : 'bg-slate-900/50 border-white/5'}`}>
              <button 
                onClick={() => setViewMode('DEFAULT')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'DEFAULT' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Layout size={14} />
                {t('modeDefault')}
              </button>
              <button 
                onClick={() => setViewMode('DESKTOP')}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewMode === 'DESKTOP' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Monitor size={14} />
                {t('modeDesktop')}
              </button>
            </div>

            <div className="h-6 w-px bg-white/5 mx-2" />

            <div className="w-full max-w-sm relative group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isHighMode ? 'text-indigo-800' : 'text-slate-500'} group-focus-within:text-indigo-400`} size={18} />
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full border rounded-2xl pl-12 pr-4 py-2.5 text-sm outline-none transition-all ${isHighMode ? 'bg-black border-indigo-900/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-indigo-300' : 'bg-slate-900/50 border-white/5 focus:ring-2 focus:ring-indigo-500/20 text-slate-200'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* High Mode Toggle */}
            <button 
              onClick={() => setIsHighMode(!isHighMode)}
              className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all relative overflow-hidden group ${isHighMode ? 'border-indigo-500 bg-indigo-600/10 text-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'border-white/10 bg-slate-900 text-slate-500 hover:border-white/20'}`}
            >
              <Zap size={14} className={isHighMode ? 'fill-current animate-pulse' : ''} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('highMode')}</span>
              {isHighMode && <div className="absolute inset-0 bg-indigo-500/10 animate-pulse pointer-events-none" />}
            </button>

            <button className={`p-2.5 rounded-xl transition-all relative ${isHighMode ? 'text-indigo-800 hover:text-indigo-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <Bell size={20} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${isHighMode ? 'text-indigo-800 hover:text-indigo-400' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
              >
                <Languages size={20} />
                <span className="text-xs font-black uppercase">{language}</span>
              </button>
              {showLangMenu && (
                <div className={`absolute top-full right-0 mt-2 w-32 border rounded-xl shadow-2xl z-[100] p-1 ${isHighMode ? 'bg-black border-indigo-900/50' : 'bg-slate-900 border-white/5'}`}>
                  <button onClick={() => changeLanguage('id')} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-white/5">
                    Indonesia {language === 'id' && <Check size={12} className="text-indigo-500" />}
                  </button>
                  <button onClick={() => changeLanguage('en')} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs hover:bg-white/5">
                    English {language === 'en' && <Check size={12} className="text-indigo-500" />}
                  </button>
                </div>
              )}
            </div>

            <button onClick={handleAppLogout} className={`flex items-center gap-2 p-2 rounded-xl transition-all ml-2 ${isHighMode ? 'text-indigo-900 hover:text-rose-500' : 'text-slate-500 hover:text-rose-500 hover:bg-rose-500/10'}`}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        {renderContent()}
      </div>

      {showProfileForm && (
        <ProfileForm 
          onClose={() => setShowProfileForm(false)} 
          onSubmit={handleSubmitProfile} 
          initialData={profiles.find(p => p.id === editingProfileId)}
          lang={language}
        />
      )}
    </div>
  );
};

export default App;
