import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CTAProps {
    onCtaClick: () => void;
}

export const CallToAction: React.FC<CTAProps> = ({ onCtaClick }) => {
  return (
    <section className="py-32 relative overflow-hidden bg-[#030712]">
      <div className="absolute inset-0 bg-indigo-600/5"></div>
      
      {/* Radiant Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 blur-[100px] rounded-full animate-pulse" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-sm font-medium text-gray-200">Join the waitlist for v3.0 beta</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            Ready to enter the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Flow State?</span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Stop letting your tools get in the way. Experience the future of productivity today. No credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button size="lg" onClick={onCtaClick} className="shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] transition-shadow">
                Start for Free
                <ArrowRight className="ml-2" />
             </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};