import * as React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, ListMusic, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { useI18n } from '../i18n';
import { cn } from '../lib/utils';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  videoUrl: string;
  cover: string;
}

const ALEXANDREZEN_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neural Flow',
    artist: "Alexandrezen's Music",
    duration: '3:45',
    videoUrl: 'https://www.youtube.com/embed/5qap5aO4i9A', // Lofi hip hop
    cover: 'https://picsum.photos/seed/music1/400/400'
  },
  {
    id: '2',
    title: 'Forge Intensity',
    artist: "Alexandrezen's Music",
    duration: '4:20',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', // Synthwave
    cover: 'https://picsum.photos/seed/music2/400/400'
  },
  {
    id: '3',
    title: 'Deep Focus',
    artist: "Alexandrezen's Music",
    duration: '5:12',
    videoUrl: 'https://www.youtube.com/embed/DWcUYKoZt1o', // Ambient
    cover: 'https://picsum.photos/seed/music3/400/400'
  },
  {
    id: '4',
    title: 'Cybernetic Pulse',
    artist: "Alexandrezen's Music",
    duration: '3:58',
    videoUrl: 'https://www.youtube.com/embed/4xDzrJKXOOY', // Techno
    cover: 'https://picsum.photos/seed/music4/400/400'
  }
];

interface MusicScreenProps {
  user: UserProfile;
}

export const MusicScreen: React.FC<MusicScreenProps> = ({ user }) => {
  const t = useI18n(user.language || 'en');
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const currentTrack = ALEXANDREZEN_TRACKS[currentTrackIndex];

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % ALEXANDREZEN_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + ALEXANDREZEN_TRACKS.length) % ALEXANDREZEN_TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="p-6 space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-2">
            {t.music} <Sparkles className="w-6 h-6 text-accent animate-pulse" />
          </h1>
          <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Neural Audio Interface</p>
        </div>
      </div>

      {/* Main Player */}
      <Card className="p-0 overflow-hidden border-accent/20 neon-glow">
        <div className="aspect-square relative group">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
          
          {/* Hidden Iframe for Audio */}
          {isPlaying && (
            <div className="hidden">
              <iframe
                src={`${currentTrack.videoUrl}?autoplay=1&mute=0`}
                allow="autoplay"
              />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
            <div className="space-y-1">
              <motion.h2 
                key={currentTrack.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-black uppercase tracking-tight"
              >
                {currentTrack.title}
              </motion.h2>
              <p className="text-accent font-mono text-xs uppercase tracking-widest">{currentTrack.artist}</p>
            </div>

            {/* Progress Bar (Visual Only) */}
            <div className="space-y-2">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent"
                  animate={{ width: isPlaying ? '100%' : '30%' }}
                  transition={{ duration: isPlaying ? 240 : 0.5, ease: 'linear' }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>0:00</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white/5 flex items-center justify-center gap-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 text-white/60 hover:text-white"
            onClick={prevTrack}
          >
            <SkipBack className="w-6 h-6" />
          </Button>
          
          <Button 
            variant="neon" 
            size="icon" 
            className="w-20 h-20 rounded-full shadow-2xl"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 fill-current" />}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 text-white/60 hover:text-white"
            onClick={nextTrack}
          >
            <SkipForward className="w-6 h-6" />
          </Button>
        </div>
      </Card>

      {/* Track List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <ListMusic className="w-4 h-4 text-accent" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Neural Playlist</h3>
        </div>
        <div className="space-y-2">
          {ALEXANDREZEN_TRACKS.map((track, index) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={cn(
                "w-full p-4 rounded-2xl flex items-center gap-4 transition-all border",
                currentTrackIndex === index 
                  ? "bg-accent/10 border-accent/20" 
                  : "bg-white/5 border-white/5 hover:bg-white/10"
              )}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                <img src={track.cover} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 text-left">
                <h4 className={cn("font-bold uppercase tracking-tight", currentTrackIndex === index ? "text-accent" : "text-white")}>
                  {track.title}
                </h4>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{track.artist}</p>
              </div>
              <span className="text-[10px] font-mono text-white/40">{track.duration}</span>
              {currentTrackIndex === index && isPlaying && (
                <div className="flex gap-0.5 items-end h-3">
                  {[0.4, 0.8, 0.6, 1].map((h, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-accent"
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Volume / Info */}
      <div className="flex items-center justify-between px-4 py-6 border-t border-white/5">
        <div className="flex items-center gap-4">
          <Volume2 className="w-4 h-4 text-white/40" />
          <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-accent" />
          </div>
        </div>
        <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
          Lossless Neural Audio
        </div>
      </div>
    </div>
  );
};
