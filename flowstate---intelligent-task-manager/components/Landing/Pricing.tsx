import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

const PricingCard = ({ plan, price, description, features, popular = false, delay }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative p-8 rounded-3xl border ${popular ? 'border-indigo-500/50 bg-indigo-950/10' : 'border-gray-800 bg-gray-900/20'} backdrop-blur-xl flex flex-col group hover:border-indigo-500/30 transition-all duration-300`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.5)]">
          Most Popular
        </div>
      )}
      
      {/* Dynamic Glow for popular card */}
      {popular && (
          <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-3xl -z-10 group-hover:bg-indigo-500/10 transition-colors" />
      )}

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-300 mb-2">{plan}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-gray-500">/mo</span>
        </div>
        <p className="text-sm text-gray-400 mt-4 leading-relaxed">{description}</p>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {features.map((feature: string, i: number) => (
          <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${popular ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 text-gray-500'}`}>
              <Check size={12} strokeWidth={3} />
            </div>
            {feature}
          </div>
        ))}
      </div>

      <Button variant={popular ? 'primary' : 'outline'} className="w-full">
        {popular ? 'Get Started' : 'Start Free'}
      </Button>
    </motion.div>
  );
};

export const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-32 bg-black relative">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Invest in your focus.</h2>
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 rounded-full bg-gray-800 p-1 relative transition-colors hover:bg-gray-700"
            >
              <motion.div 
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-500'}`}>
              Yearly <span className="text-indigo-400 text-xs ml-1 font-medium">-20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingCard 
            plan="Starter"
            price="$0"
            description="Perfect for individuals wanting to get organized and focused."
            features={["Unlimited tasks", "Basic AI breakdown (5/day)", "Mobile App Access", "7-day history"]}
            delay={0}
          />
          <PricingCard 
            plan="Pro"
            price={isAnnual ? "$12" : "$15"}
            description="For power users who need the full power of AI scheduling."
            features={["Everything in Starter", "Unlimited AI Context Scheduling", "Deep Work Analytics", "Calendar Sync (Google/Outlook)", "Unlimited history"]}
            popular={true}
            delay={0.1}
          />
          <PricingCard 
            plan="Team"
            price={isAnnual ? "$29" : "$35"}
            description="Collaborative workspace for high-performance teams."
            features={["Everything in Pro", "Team shared workspaces", "Admin controls", "Priority Support", "API Access"]}
            delay={0.2}
          />
        </div>
      </div>
    </section>
  );
};