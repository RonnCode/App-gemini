
import React, { useState } from 'react';
import { AccountProfile, ViewMode } from '../types';
import SocialBrowser from './SocialBrowser';
import { LayoutGrid, Plus, X, Monitor, Smartphone, Layout, ChevronRight } from 'lucide-react';

interface MultiViewProps {
  profiles: AccountProfile[];
  lang?: 'id' | 'en';
  isHighMode?: boolean;
  viewMode?: ViewMode;
  onDeleteProfile?: (id: string) => void;
  onDownloadProfile?: (profile: AccountProfile) => void;
}

const MultiView: React.FC<MultiViewProps> = ({ 
  profiles, 
  lang = 'id', 
  isHighMode = false, 
  viewMode = 'DEFAULT',
  onDeleteProfile,
  onDownloadProfile
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const translations = {
    id: {
      title: "Multi-View Grid",
      desc: isHighMode ? "MODE TINGGI: Menjalankan grid dalam isolasi stealth penuh." : "Pilih hingga 9 akun untuk dipantau secara bersamaan.",
      selectTitle: "Pilih Akun",
      noSelection: "Belum ada akun yang dipilih.",
      start: "Mulai Multi-View",
      clear: "Bersihkan Semua",
      active: "Sedang Ditampilkan"
    },
    en: {
      title: "Multi-View Grid",
      desc: isHighMode ? "HIGH MODE: Running grid in full stealth isolation." : "Select up to 9 accounts to monitor simultaneously.",
      selectTitle: "Select Accounts",
      noSelection: "No accounts selected yet.",
      start: "Start Multi-View",
      clear: "Clear All",
      active: "Currently Viewing"
    }
  };

  const t = translations[lang];

  const toggleProfile = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : (prev.length < 9 ? [...prev, id] : prev)
    );
  };

  const selectedProfiles = profiles.filter(p => selectedIds.includes(p.id));

  const getGridCols = () => {
    const count = selectedIds.length;
    if (count <= 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  if (selectedIds.length === 0) {
    return (
      <div className={`h-full flex flex-col p-10 transition-colors duration-500 ${isHighMode ? 'bg-black' : 'bg-slate-900/20'}`}>
        <div className="mb-10">
          <h2 className={`text-3xl font-black tracking-tight transition-colors ${isHighMode ? 'text-indigo-400' : 'text-white'}`}>{t.title}</h2>
          <p className={`mt-2 font-medium transition-colors ${isHighMode ? 'text-indigo-900' : 'text-slate-500'}`}>{t.desc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => toggleProfile(p.id)}
              className={`p-6 rounded-[2.5rem] border text-left transition-all relative group ${
                selectedIds.includes(p.id) 
                  ? (isHighMode ? 'bg-indigo-900/10 border-indigo-500 ring-4 ring-indigo-500/10' : 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/20') 
                  : (isHighMode ? 'bg-black border-indigo-900/20 hover:border-indigo-500/30' : 'bg-slate-900/40 border-white/5 hover:border-white/10')
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-colors ${isHighMode ? 'bg-black border border-indigo-900 text-indigo-500' : 'bg-slate-800 text-white'}`}>
                  {p.platform[0]}
                </div>
                <div className="overflow-hidden">
                  <p className={`text-sm font-black truncate transition-colors ${isHighMode ? 'text-indigo-300' : 'text-white'}`}>{p.name}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 transition-colors ${isHighMode ? 'text-indigo-900' : 'text-slate-500'}`}>{p.platform}</p>
                </div>
                {selectedIds.includes(p.id) && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Plus size={14} className="text-white rotate-45" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {profiles.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
            <LayoutGrid size={48} className="mb-4 opacity-20" />
            <p className="font-bold uppercase tracking-widest text-sm">Belum ada profil tersedia</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col transition-colors duration-500 ${isHighMode ? 'bg-black' : 'bg-slate-950'}`}>
      {/* Mini Control Bar */}
      <div className={`h-14 border-b px-6 flex items-center justify-between shrink-0 transition-all ${isHighMode ? 'bg-black border-indigo-900/40' : 'bg-slate-900 border-white/5'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedIds([])}
            className={`flex items-center gap-2 text-xs font-black transition-all uppercase tracking-widest ${isHighMode ? 'text-indigo-900 hover:text-indigo-400' : 'text-slate-500 hover:text-white'}`}
          >
            <X size={16} />
            {t.clear}
          </button>
          <div className={`h-4 w-px ${isHighMode ? 'bg-indigo-900/30' : 'bg-white/10'}`} />
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
            {selectedIds.length} Platform Aktif
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedProfiles.map(p => (
            <div key={p.id} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-colors ${isHighMode ? 'bg-black border-indigo-900 text-indigo-500' : 'bg-slate-800 text-white border-white/5'}`}>
              {p.platform[0]}
            </div>
          ))}
          <button 
             onClick={() => setSelectedIds([])}
             className="ml-4 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Grid Display */}
      <div className={`flex-1 grid ${getGridCols()} gap-1 bg-black overflow-hidden p-1`}>
        {selectedProfiles.map(p => (
          <div key={p.id} className={`relative overflow-hidden shadow-2xl transition-all ${isHighMode ? 'bg-black border border-indigo-900/50 rounded-2xl' : 'bg-slate-900 border border-white/5 rounded-2xl'}`}>
            <SocialBrowser 
              profile={p} 
              onBack={() => setSelectedIds(prev => prev.filter(i => i !== p.id))} 
              onLogout={() => {}}
              onDelete={() => onDeleteProfile?.(p.id)}
              onDownload={() => onDownloadProfile?.(p)}
              lang={lang}
              forceIsolation={isHighMode}
              viewMode={viewMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiView;
