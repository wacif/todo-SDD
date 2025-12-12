import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Product Designer @ Stripe",
    content: "The AI breakdown feature is actual magic. It took a vague project idea and turned it into a 2-week actionable roadmap in seconds.",
    image: "https://picsum.photos/seed/alex/100/100"
  },
  {
    name: "Sarah Chen",
    role: "Founder @ Nexus",
    content: "I've tried every todo app since 2015. FlowState is the first one that actually helps me do the work instead of just listing it.",
    image: "https://picsum.photos/seed/sarah/100/100"
  },
  {
    name: "James Wilson",
    role: "Senior Dev @ Vercel",
    content: "The dark mode implementation is flawless. It feels like an extension of my IDE. The keyboard shortcuts are incredibly intuitive.",
    image: "https://picsum.photos/seed/james/100/100"
  },
  {
    name: "Elena Rodriguez",
    role: "Creative Director",
    content: "Finally, an app that understands 'Flow'. The focus mode blocking out distractions has saved me easily 10 hours a week.",
    image: "https://picsum.photos/seed/elena/100/100"
  },
  {
    name: "Marcus Johnson",
    role: "Indie Hacker",
    content: "Context-aware scheduling is a game changer. It knows I'm a night owl and schedules my deep work accordingly.",
    image: "https://picsum.photos/seed/marcus/100/100"
  }
];

const MarqueeColumn = ({ reverse = false, duration = 20 }) => (
  <div className="flex flex-col gap-6 overflow-hidden py-10 relative">
     <motion.div
        animate={{ y: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
        className="flex flex-col gap-6"
     >
        {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="w-80 p-6 rounded-2xl bg-gray-900/40 border border-white/5 backdrop-blur-sm hover:border-indigo-500/30 transition-colors">
                <div className="flex gap-1 mb-4 text-yellow-500">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.content}"</p>
                <div className="flex items-center gap-3">
                    <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full border border-white/10" />
                    <div>
                        <div className="text-sm font-medium text-white">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.role}</div>
                    </div>
                </div>
            </div>
        ))}
     </motion.div>
     {/* Fade masks */}
     <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#030712] to-transparent z-10 pointer-events-none" />
     <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#030712] to-transparent z-10 pointer-events-none" />
  </div>
);

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-[#030712] relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for flow.</h2>
                <p className="text-gray-400 text-lg">
                    Join thousands of high-performers who trust FlowState to manage their most important work.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px] overflow-hidden mask-image-gradient">
                <MarqueeColumn duration={25} />
                <div className="hidden md:block">
                     <MarqueeColumn reverse duration={30} />
                </div>
                <div className="hidden lg:block">
                     <MarqueeColumn duration={22} />
                </div>
            </div>
        </div>
    </section>
  );
};