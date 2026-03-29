import * as React from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '../lib/utils';
import { Mail, Lock, Loader2, LogIn, UserPlus, Chrome, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../i18n';

export const Auth: React.FC = () => {
  const t = useI18n('en'); // Default to en, but App.tsx will handle it if needed
  // Actually, Auth is shown before user profile is loaded, so we might need a language selector here too
  // For now, we'll use 'en' or detect from browser
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [authMethod, setAuthMethod] = React.useState<'password' | 'magic'>('password');
  const [error, setError] = React.useState<string | null>(null);

  const isConfigured = React.useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return url && key && url.startsWith('http');
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authMethod === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        alert(t.checkEmailMagic);
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert(t.checkEmailConfirm);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg relative overflow-hidden">
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gradient mb-2">ForgeX AI</h1>
          <p className="text-white/40 text-xs uppercase tracking-widest font-mono">Neural Performance Link</p>
        </div>

        <Card className="p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">
              {isSignUp ? t.initializeProfile : t.establishLink}
            </h2>
            <p className="text-white/40 text-xs uppercase tracking-widest font-mono">
              {isSignUp ? t.createIdentity : t.authenticateToSync}
            </p>
          </div>

          {!isConfigured && (
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl space-y-2">
              <p className="text-orange-500 text-[10px] font-mono uppercase tracking-widest font-bold">
                ⚠️ Configuration Required
              </p>
              <p className="text-white/60 text-[9px] font-mono leading-relaxed">
                Supabase is not connected. Please provide your credentials in the **Settings** menu under **Environment Variables**:
              </p>
              <div className="bg-black/20 p-2 rounded font-mono text-[8px] text-white/40 select-all">
                VITE_SUPABASE_URL<br/>
                VITE_SUPABASE_ANON_KEY
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setAuthMethod('password')}
              className={cn(
                "py-2 text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all",
                authMethod === 'password' ? "bg-accent text-bg font-bold" : "text-white/40 hover:text-white/60"
              )}
            >
              {t.password}
            </button>
            <button
              onClick={() => setAuthMethod('magic')}
              className={cn(
                "py-2 text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all",
                authMethod === 'magic' ? "bg-accent text-bg font-bold" : "text-white/40 hover:text-white/60"
              )}
            >
              {t.magicLink}
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.emailAddress || 'Email Address'}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  required
                />
              </div>
            </div>

            {authMethod === 'password' && (
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-[10px] font-mono uppercase tracking-widest bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 font-black uppercase tracking-widest"
              variant="neon"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : authMethod === 'magic' ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t.sendMagicLink}
                </>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  {t.initialize}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  {t.initialize}
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-widest">
              <span className="bg-card px-2 text-white/20">{t.orContinueWith}</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outline"
            className="w-full h-12 font-black uppercase tracking-widest border-white/10 hover:bg-white/5"
          >
            <Chrome className="w-5 h-5 mr-2" />
            {t.googleIdentity}
          </Button>

          <div className="text-center space-y-4">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-accent transition-colors block w-full"
            >
              {isSignUp ? t.alreadyHaveAccount : t.dontHaveAccount}
            </button>

            {!isConfigured && (
              <button
                onClick={() => {
                  // Mock a session to bypass Auth
                  const mockSession = {
                    user: { id: 'demo-user', email: 'demo@example.com' },
                    access_token: 'demo-token'
                  };
                  // We need to trigger the session change in App.tsx
                  // Since we can't easily reach App.tsx state from here without a context,
                  // we'll just reload or use a custom event if needed.
                  // Actually, let's just use a simple localStorage flag for demo mode
                  localStorage.setItem('forgex_demo_mode', 'true');
                  window.location.reload();
                }}
                className="text-[10px] font-mono uppercase tracking-widest text-accent/60 hover:text-accent transition-colors border border-accent/20 rounded-lg px-4 py-2 w-full"
              >
                🚀 Launch Demo Mode (No Config Required)
              </button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
