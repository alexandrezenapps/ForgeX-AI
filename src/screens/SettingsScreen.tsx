import * as React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { UserProfile, Language, EquipmentProfile } from '../types';
import { Palette, Check, RotateCcw, ShieldCheck, Bell, User, Globe, LogOut, Dumbbell, Home, Hotel, Plus, Trash2, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../i18n';
import { supabase } from '../lib/supabase';
import { ALL_EQUIPMENT } from '../constants';
import { cn } from '../lib/utils';

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
  const [showAddProfile, setShowAddProfile] = React.useState(false);
  const [newProfileName, setNewProfileName] = React.useState('');
  const [newProfileIcon, setNewProfileIcon] = React.useState<'Gym' | 'Home' | 'Hotel'>('Gym');
  const [selectedEquipment, setSelectedEquipment] = React.useState<string[]>([]);

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

  const handleSwitchProfile = (profileId: string) => {
    onUpdateUser({
      ...user,
      currentProfileId: profileId
    });
  };

  const handleRemoveProfile = (profileId: string) => {
    const updatedProfiles = user.equipmentProfiles?.filter(p => p.id !== profileId) || [];
    onUpdateUser({
      ...user,
      equipmentProfiles: updatedProfiles,
      currentProfileId: user.currentProfileId === profileId ? (updatedProfiles[0]?.id || undefined) : user.currentProfileId
    });
  };

  const handleAddProfile = () => {
    if (!newProfileName.trim()) return;

    const newProfile: EquipmentProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProfileName,
      icon: newProfileIcon,
      equipment: selectedEquipment
    };

    const updatedProfiles = [...(user.equipmentProfiles || []), newProfile];
    onUpdateUser({
      ...user,
      equipmentProfiles: updatedProfiles,
      currentProfileId: user.currentProfileId || newProfile.id
    });

    setShowAddProfile(false);
    setNewProfileName('');
    setSelectedEquipment([]);
  };

  const toggleEquipment = (item: string) => {
    setSelectedEquipment(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
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

      {/* Equipment Profiles Section */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-bold uppercase tracking-widest">{t.equipmentProfiles}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowAddProfile(true)}>
            <Plus className="w-4 h-4 mr-1" />
            {t.addProfile}
          </Button>
        </div>

        <div className="space-y-3">
          {(!user.equipmentProfiles || user.equipmentProfiles.length === 0) ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-xs text-white/40 italic">{t.noProfiles}</p>
              <Button variant="outline" size="sm" onClick={() => setShowAddProfile(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t.addProfile}
              </Button>
            </div>
          ) : (
            user.equipmentProfiles.map((profile) => (
              <div 
                key={profile.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group",
                  user.currentProfileId === profile.id 
                    ? "bg-accent/10 border-accent shadow-lg shadow-accent/5" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
                onClick={() => handleSwitchProfile(profile.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    user.currentProfileId === profile.id ? "bg-accent/20" : "bg-white/5"
                  )}>
                    {profile.icon === 'Gym' && <Dumbbell className="w-5 h-5 text-accent" />}
                    {profile.icon === 'Home' && <Home className="w-5 h-5 text-accent" />}
                    {profile.icon === 'Hotel' && <Hotel className="w-5 h-5 text-accent" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{profile.name}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-tighter">
                      {profile.equipment.length} {t.items || 'Items'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.currentProfileId === profile.id && (
                    <div className="w-2 h-2 bg-accent rounded-full neon-glow mr-2" />
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); handleRemoveProfile(profile.id); }} 
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Add Profile Modal */}
      <AnimatePresence>
        {showAddProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card className="space-y-6 shadow-2xl border-accent/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase italic tracking-tight">{t.addProfile}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddProfile(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.profileName}</label>
                    <input 
                      type="text" 
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      placeholder={t.gymProfile || 'Gym'}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.icon || 'Icon'}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'Gym', icon: Dumbbell, label: t.gymProfile },
                        { id: 'Home', icon: Home, label: t.homeProfile },
                        { id: 'Hotel', icon: Hotel, label: t.hotelProfile },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setNewProfileIcon(item.id as any)}
                          className={cn(
                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                            newProfileIcon === item.id 
                              ? "bg-accent/10 border-accent text-accent" 
                              : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                          )}
                        >
                          <item.icon className="w-5 h-5 mb-1" />
                          <span className="text-[8px] uppercase font-bold">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.selectEquipment}</label>
                      <span className="text-[10px] font-mono text-accent">{selectedEquipment.length} {t.items}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar p-1">
                      {ALL_EQUIPMENT.map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleEquipment(item)}
                          className={cn(
                            "flex items-center gap-2 p-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-tight transition-all relative overflow-hidden group",
                            selectedEquipment.includes(item)
                              ? "bg-accent/20 border-accent text-accent shadow-[0_0_10px_rgba(0,242,255,0.1)]"
                              : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20"
                          )}
                        >
                          {selectedEquipment.includes(item) && (
                            <motion.div 
                              layoutId="active-bg"
                              className="absolute inset-0 bg-accent/5 pointer-events-none"
                            />
                          )}
                          <div className={cn(
                            "w-4 h-4 rounded-md border flex items-center justify-center transition-colors",
                            selectedEquipment.includes(item) ? "bg-accent border-accent" : "border-white/20 group-hover:border-white/40"
                          )}>
                            {selectedEquipment.includes(item) && <Check className="w-3 h-3 text-bg" />}
                          </div>
                          <span className="relative z-10">{item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="ghost" className="flex-1" onClick={() => setShowAddProfile(false)}>
                    {t.cancel}
                  </Button>
                  <Button variant="neon" className="flex-1" onClick={handleAddProfile}>
                    {t.finish}
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
