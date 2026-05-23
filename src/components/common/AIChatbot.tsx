import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Namaste! I am the KK Distributions AI Assistant. How can I help you manage your store's inventory, check delivery timelines, or discover B2B wholesale rates today?",
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Dynamic responses matching B2B FMCG distribution flows
    setTimeout(() => {
      let replyText = "I'm checking that for you in our central logistics ledger. Could you clarify if you are searching for custom delivery dispatches or category stock pricing?";
      const lower = inputText.toLowerCase();

      if (lower.includes('order') || lower.includes('delivery') || lower.includes('track')) {
        replyText = "Sure! Sourcing active dispatches... Yes! Order **KKD-781920** (Sri Manjunatha Stores) is currently in **'Packing'** at our Yeshwanthpur automated node. Loading on trucks expected tonight, guaranteed shop arrival tomorrow morning by **10:00 AM**.";
      } else if (lower.includes('coupon') || lower.includes('discount') || lower.includes('offer')) {
        replyText = "Excellent! Active B2B promotion codes:\n\n&bull; **KKFIRST**: Get flat 10% off orders above ₹500.\n&bull; **DIWALI10**: Bumper festival discount! Save 15% on procurement above ₹2000.\n&bull; **B2BSUPER**: Extra 5% off on large bulk wholesale above ₹5000.";
      } else if (lower.includes('agarbathi') || lower.includes('dhoop') || lower.includes('fragrance')) {
        replyText = "Our top-selling spiritual lines are:\n\n1. **Sandal Premium Agarbathi** (₹110 B2B wholesale case rate, aged Mysuru sandalwood oils).\n2. **Temple Gold Incense Guggal Resins** (₹150 wholesale rate, highly purificatory).\n3. **Rose Fragrance wet dhoop cones** (₹65 B2B rate). Add them to your basket to unlock bulk price scales!";
      } else if (lower.includes('biscuit') || lower.includes('cookies')) {
        replyText = "We highly recommend **Butter Crunch Biscuits** (₹30 wholesale rate, packed in boxes of 24) and **Cashew Premium Cookies** (₹56 B2B rate, authentic buttery cashew chunks). Kids love them, fast-moving items!";
      }

      const botMsg: Message = {
        id: Math.random().toString(),
        text: replyText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed z-40 bottom-6 left-6 pointer-events-none">
      
      {/* FLOATING TRIGGER BUBBLE BUTTON */}
      <div className="pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full gradient-brand shadow-lg flex items-center justify-center text-brand-cream-100 hover:scale-105 active:scale-95 transition-all ${
            isOpen ? 'rotate-90' : ''
          }`}
          title="KK AI Assistant"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>

      {/* CHATBOX DRAWER LAYOUT */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50, x: -20 }}
            className="pointer-events-auto absolute bottom-20 left-0 w-[350px] h-[450px] rounded-3xl bg-brand-cream-50 dark:bg-brand-charcoal-900 border border-brand-orange-100/10 dark:border-brand-gold-900/10 shadow-2xl flex flex-col overflow-hidden transition-colors duration-300"
          >
            {/* HEADER */}
            <div className="p-4 bg-gradient-to-tr from-brand-orange-950 to-brand-charcoal-950 text-brand-cream-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-orange-900 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-brand-cream-100" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    KK Distribution AI
                  </h4>
                  <span className="text-[9px] text-brand-gold-900 font-extrabold flex items-center gap-0.5 uppercase tracking-widest leading-none">
                    <Sparkles className="w-2.5 h-2.5 fill-brand-gold-900" />
                    Live Logistics Bot
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-brand-cream-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* MESSAGE LIST CHAT AREA */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar bg-brand-cream-100/30 dark:bg-brand-charcoal-950/20">
              {messages.map((m) => {
                const isBot = m.sender === 'bot';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 ${!isBot ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 font-extrabold ${
                      isBot ? 'bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/10 dark:text-brand-gold-900' : 'bg-brand-charcoal-900 text-brand-cream-100 dark:bg-brand-charcoal-850'
                    }`}>
                      {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className="space-y-1 max-w-[70%]">
                      <div
                        className={`p-3 rounded-2xl text-[11px] leading-relaxed font-semibold shadow-sm ${
                          isBot
                            ? 'bg-white dark:bg-brand-charcoal-900 text-brand-charcoal-900 dark:text-brand-cream-100 border border-brand-orange-100/5 dark:border-brand-gold-900/5'
                            : 'bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 text-brand-cream-100'
                        }`}
                        dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>') }}
                      />
                      <p className="text-[8px] text-brand-charcoal-400 font-bold text-right leading-none pr-1">
                        {m.time}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* TYPING SIMULATION */}
              {isTyping && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-brand-orange-900/10 text-brand-orange-900 dark:bg-brand-gold-900/10 dark:text-brand-gold-900 flex items-center justify-center text-xs flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-brand-charcoal-900 border border-brand-orange-100/5 dark:border-brand-gold-900/5 flex gap-1 items-center shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-charcoal-400 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-charcoal-400 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-charcoal-400 animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* SEND MESSAGE FORM */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-brand-orange-100/10 dark:border-brand-gold-900/10 bg-white dark:bg-brand-charcoal-900 flex gap-2 items-center">
              <input
                type="text"
                placeholder="Ask about orders, coupons, products..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow pl-3 pr-2 py-2 text-[10px] font-semibold rounded-xl border border-brand-charcoal-200 dark:border-brand-charcoal-800 bg-brand-cream-50 dark:bg-brand-charcoal-950 text-brand-charcoal-900 dark:text-brand-cream-50 focus:outline-none focus:border-brand-orange-900 dark:focus:border-brand-gold-900"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-orange-900 to-brand-gold-900 text-brand-cream-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default AIChatbot;
