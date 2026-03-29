import * as React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { UserProfile } from '../types';
import { useI18n } from '../i18n';
import { Video, Play, Sparkles, Loader2, AlertCircle, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

export const VideoScreen: React.FC<{ user: UserProfile }> = ({ user }) => {
  const t = useI18n(user.language || 'en');
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState('');

  const checkApiKey = async () => {
    // @ts-ignore
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      return false;
    }
    return true;
  };

  const generateVideo = async () => {
    if (!prompt) return;
    
    setError(null);
    setIsGenerating(true);
    setStatus('Initializing AI Forge...');

    try {
      const hasKey = await checkApiKey();
      if (!hasKey) {
        setIsGenerating(false);
        return;
      }

      // Create a new instance right before the call to ensure latest key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      setStatus('Forging your visualization...');
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Cinematic fitness visualization: ${prompt}. High quality, dynamic lighting, professional gym environment.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      const loadingMessages = [
        'Analyzing biomechanics...',
        'Rendering muscle fibers...',
        'Optimizing lighting...',
        'Finalizing cinematic sequence...',
      ];
      let msgIndex = 0;

      while (!operation.done) {
        setStatus(loadingMessages[msgIndex % loadingMessages.length]);
        msgIndex++;
        await new Promise(resolve => setTimeout(resolve, 8000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.API_KEY || '',
          },
        });
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      } else {
        throw new Error('Video generation failed to return a URI.');
      }
    } catch (err: any) {
      console.error('Video generation error:', err);
      if (err.message?.includes('Requested entity was not found')) {
        setError('API Key error. Please re-select your key.');
        // @ts-ignore
        if (window.aistudio) await window.aistudio.openSelectKey();
      } else {
        setError(err.message || 'An unexpected error occurred during generation.');
      }
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase tracking-tight italic">Video Lab</h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent">Veo AI Power</span>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">AI Visualization Generator</h3>
          <p className="text-xs text-white/40">Describe a workout or exercise to see it forged in high-quality AI video.</p>
        </div>

        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A professional athlete performing explosive box jumps in a neon-lit futuristic gym..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-accent transition-colors h-32 resize-none"
          />
          
          <Button 
            variant="neon" 
            className="w-full h-14 font-black uppercase tracking-widest"
            onClick={generateVideo}
            disabled={isGenerating || !prompt}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {status}
              </>
            ) : (
              <>
                <Video className="w-5 h-5 mr-2" />
                Forge Visualization
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}
      </Card>

      <AnimatePresence>
        {videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/50 px-2">Generated Result</h3>
            <Card className="p-0 overflow-hidden border-accent/30 shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.2)]">
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full aspect-video bg-black"
              />
            </Card>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                const a = document.createElement('a');
                a.href = videoUrl;
                a.download = 'forgex-visualization.mp4';
                a.click();
              }}
            >
              Download Visualization
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-white/50 px-2">Pro Tips</h3>
        <div className="grid grid-cols-1 gap-3">
          <Card className="p-4 flex items-start gap-4 bg-white/5 border-white/5">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Key className="w-4 h-4 text-accent" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-tight">API Key Required</p>
              <p className="text-[10px] text-white/40 leading-relaxed">This feature uses Google's Veo model. You must select a paid API key to generate high-quality videos.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
