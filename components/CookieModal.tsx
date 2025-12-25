
import React, { useState } from 'react';
import { X, Database, Copy, Check, Upload, Trash2 } from 'lucide-react';
import { AccountProfile } from '../types';

interface CookieModalProps {
  profile: AccountProfile;
  onClose: () => void;
  onSave: (id: string, cookies: string) => void;
  lang?: 'id' | 'en';
}

const CookieModal: React.FC<CookieModalProps> = ({ profile, onClose, onSave, lang = 'id' }) => {
  const [cookieText, setCookieText] = useState(profile.cookies || '');
  const [copied, setCopied] = useState(false);

  const translations = {
    id: {
      title: "Kelola Cookie Sesi",
      desc: `Impor atau ekspor cookie JSON untuk ${profile.name}. Digunakan untuk login otomatis tanpa kata sandi.`,
      placeholder: "Tempel JSON cookie di sini...",
      copy: "Salin Cookie",
      copied: "Disalin!",
      import: "Simpan & Terapkan",
      clear: "Bersihkan",
      formatInfo: "Gunakan format JSON standar (didukung oleh Cookie Editor)."
    },
    en: {
      title: "Manage Session Cookies",
      desc: `Import or export JSON cookies for ${profile.name}. Used for automatic login without password.`,
      placeholder: "Paste cookie JSON here...",
      copy: "Copy Cookies",
      copied: "Copied!",
      import: "Save & Apply",
      clear: "Clear All",
      formatInfo: "Use standard JSON format (supported by Cookie Editor)."
    }
  };

  const t = translations[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(cookieText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <div className="bg-[#1e2227] border border-white/5 rounded-[2.5rem] w-full max-w-xl shadow-2xl relative overflow-hidden">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center">
              <Database size={24} className="text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">{t.title}</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                {profile.platform} Account Isolation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.desc}
          </p>

          <div className="relative group">
            <textarea 
              value={cookieText}
              onChange={(e) => setCookieText(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-64 bg-black/40 border border-white/5 rounded-3xl p-6 text-[10px] font-mono text-indigo-300 leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none scrollbar-thin scrollbar-thumb-slate-800"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={handleCopy}
                className={`p-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? t.copied : t.copy}
              </button>
              <button 
                onClick={() => setCookieText('')}
                className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                title={t.clear}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-amber-500/50">
            <Upload size={14} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{t.formatInfo}</span>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-slate-800 hover:bg-slate-750 font-bold text-sm transition-all text-slate-400"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave(profile.id, cookieText)}
              className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm transition-all text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {t.import}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieModal;
