import * as React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { UserProfile, Language } from '../types';
import { Palette, Check, RotateCcw, ShieldCheck, Bell, User, Globe, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useI18n } from '../i18n';
import { supabase } from '../lib/supabase';

interface SettingsScreenProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

const PRESET_COLORS = [
  { primary: '#00f2ff', secondary: '#7000ff', name: 'Cyberpunk' },
  { primary: '#ff0055', secondary: '#ffaa00', name: 'Inferno' },
  { primary: '#00ff88', secondary: '#0066ff', name: 'Emerald' },
  { primary: '#ff00ff', secondary: '#00ffff', name: 'Vaporwave' },
  { primary: '#ffffff', secondary: '#444444', name: 'Monochrome' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, onUpdateUser }) => {
  const [language, setLanguage] = React.useState<Language>(user.language || 'en');
  const t = useI18n(language);
  const [primaryColor, setPrimaryColor] = React.useState(user.primaryColor || '#00f2ff');
  const [secondaryColor, setSecondaryColor] = React.useState(user.secondaryColor || '#7000ff');

  const handleApplySettings = () => {
    onUpdateUser({
      ...user,
      primaryColor,
      secondaryColor,
      language,
    });
  };

  const handleReset = () => {
    setPrimaryColor('#00f2ff');
    setSecondaryColor('#7000ff');
    setLanguage('en');
    onUpdateUser({
      ...user,
      primaryColor: '#00f2ff',
      secondaryColor: '#7000ff',
      language: 'en',
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('forgex_user');
    localStorage.removeItem('forgex_demo_mode');
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tight italic">{t.settings}</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1" />
            {t.reset || 'Reset'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-red-500 hover:text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 mr-1" />
            {t.signOut || 'Sign Out'}
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <Card className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
          <User className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.profile}</h4>
          <p className="text-lg font-bold">{user.name}</p>
          <p className="text-[10px] text-white/40 uppercase tracking-tighter">{t.subjectId || 'Subject ID'}: {user.name.toLowerCase().replace(/\s/g, '-')}-001</p>
        </div>
      </Card>

      {/* Language Section */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-bold uppercase tracking-widest">{t.language}</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'en', label: 'English' },
            { id: 'fr', label: 'Français' },
            { id: 'zh', label: '中文' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id as Language)}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                language === lang.id
                  ? 'bg-accent text-bg border-accent shadow-lg shadow-accent/20'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Appearance Section */}
      <Card className="space-y-6">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-bold uppercase tracking-widest">{t.theme}</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.primaryAccent}</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 font-mono text-sm uppercase"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.secondaryAccent}</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-12 rounded-lg bg-transparent border-none cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 font-mono text-sm uppercase"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.presets || 'Presets'}</label>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setPrimaryColor(preset.primary);
                  setSecondaryColor(preset.secondary);
                }}
                className="group relative flex flex-col items-center"
              >
                <div 
                  className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden flex"
                  title={preset.name}
                >
                  <div className="w-1/2 h-full" style={{ backgroundColor: preset.primary }} />
                  <div className="w-1/2 h-full" style={{ backgroundColor: preset.secondary }} />
                </div>
                <span className="text-[8px] mt-1 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button 
          variant="neon" 
          className="w-full h-12 font-bold uppercase tracking-widest"
          onClick={handleApplySettings}
        >
          <Check className="w-5 h-5 mr-2" />
          {t.saveChanges}
        </Button>
      </Card>

      {/* Notifications Section */}
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white/40" />
          </div>
          <div>
            <h4 className="text-sm font-bold">{t.notifications}</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-tighter">{t.pushNotifications}</p>
          </div>
        </div>
        <div className="w-10 h-5 bg-accent/20 rounded-full relative">
          <div className="absolute right-1 top-1 w-3 h-3 bg-accent rounded-full neon-glow" />
        </div>
      </Card>

      {/* Security Section */}
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white/40" />
          </div>
          <div>
            <h4 className="text-sm font-bold">{t.security}</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-tighter">{t.biometricLock}</p>
          </div>
        </div>
        <Check className="w-5 h-5 text-accent" />
      </Card>
    </div>
  );
};
