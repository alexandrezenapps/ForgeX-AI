import * as React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { GoogleGenAI } from '@google/genai';
import { Message, UserProfile } from '../types';
import { Send, Bot, User, Sparkles, Loader2, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../i18n';

interface CoachScreenProps {
  user: UserProfile;
}

export const CoachScreen: React.FC<CoachScreenProps> = ({ user }) => {
  const t = useI18n(user.language || 'en');
  const [messages, setMessages] = React.useState<Message[]>([
    { 
      role: 'model', 
      text: t.coachGreeting
        .replace('{name}', user.name)
        .replace('{goal}', user.goal)
        .replace('{level}', user.level.toString())
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!overrideInput) setInput('');
    setIsLoading(true);

    // Equipment check logic
    const planKeywords = ['plan', 'program', 'routine', 'workout', 'schedule', 'programme', 'entraînement', '计划', '方案', '安排', '训练'];
    const equipmentKeywords = ['equipment', 'dumbbell', 'barbell', 'gym', 'machine', 'bench', 'rack', 'band', 'kettlebell', 'équipement', 'haltère', 'barre', 'salle', 'banc', 'élastique', '器械', '哑铃', '杠铃', '健身房', '机器', '凳子', '弹力带'];
    
    const isAskingForPlan = planKeywords.some(k => textToSend.toLowerCase().includes(k));
    const mentionsEquipment = equipmentKeywords.some(k => textToSend.toLowerCase().includes(k));

    if (isAskingForPlan && !mentionsEquipment) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'model', text: t.equipmentPrompt }]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `User Profile:
Name: ${user.name}
Age: ${user.age}
Weight: ${user.weight}kg
Height: ${user.height}cm
Goal: ${user.goal}
Level: ${user.level}
Equipment: Not specified (Ask user if needed for the plan)
Language: ${user.language || 'en'}

You are ForgeX AI, a premium fitness coach. Be concise, technical, and motivating. Use markdown for lists and emphasis. 
If the user asks for a training plan, generate a structured 7-day plan including exercises, sets, reps, and rest periods.
If you don't know the user's available equipment, ask them before or while providing the plan.
IMPORTANT: Respond in the user's language (${user.language || 'en'}).
User message: ${textToSend}` }] }
        ],
        config: {
          systemInstruction: "You are ForgeX AI, a high-performance fitness coach. Your tone is professional, scientific, and highly motivating. You provide actionable advice on training, nutrition, and recovery. Keep responses concise and formatted with markdown. When generating plans, ensure they are realistic and progressive."
        }
      });

      const aiMessage: Message = { role: 'model', text: response.text || t.aiError };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [...prev, { role: 'model', text: t.connectionError }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] p-6 pb-32">
      <Card className="flex-1 flex flex-col overflow-hidden p-0">
        <div className="p-4 border-bottom border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-accent neon-glow" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight">{t.aiCoachName}</h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">{t.neuralLinkActive}</span>
              </div>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-accent-secondary" />
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  'flex gap-3 max-w-[85%]',
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  msg.role === 'user' ? 'bg-accent-secondary/20' : 'bg-accent/20'
                )}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn(
                  'p-3 rounded-2xl text-sm leading-relaxed',
                  msg.role === 'user' 
                    ? 'bg-accent-secondary text-white rounded-tr-none' 
                    : 'bg-white/5 text-white/90 rounded-tl-none border border-white/5'
                )}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex gap-3 mr-auto">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white/5 border-top border-white/5 space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0 text-[10px] uppercase tracking-widest h-8"
              onClick={() => {
                const msg = t.language === 'fr' 
                  ? "Générer un plan d'entraînement hebdomadaire de 7 jours." 
                  : t.language === 'zh' 
                  ? "为我制定一个为期7天的每周训练计划。" 
                  : "Generate a personalized 7-day weekly training plan for me.";
                handleSend(msg);
              }}
            >
              <Calendar className="w-3 h-3 mr-1.5" />
              {t.weeklyPlan}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="shrink-0 text-[10px] uppercase tracking-widest h-8"
              onClick={() => {
                const msg = t.language === 'fr' 
                  ? "Donnez-moi un conseil nutritionnel rapide." 
                  : t.language === 'zh' 
                  ? "给我一个针对我目标的快速营养建议。" 
                  : "Give me a quick nutrition tip for my goal.";
                handleSend(msg);
              }}
            >
              <Sparkles className="w-3 h-3 mr-1.5" />
              {t.nutritionTip}
            </Button>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.askCoach}
              className="w-full bg-bg border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 text-accent hover:text-accent-secondary transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
