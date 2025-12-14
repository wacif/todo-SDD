'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, Shield, Users, Smartphone, Brain, BarChart } from 'lucide-react'

const FeatureCard = ({ title, description, icon, className = "", delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className={`p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors group ${className}`}
  >
    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
)

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Not just another task list.</h2>
          <p className="text-gray-400 text-lg">
            Built for high-performers who need more than just a checkbox. DoBot adapts to your working style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          {/* Large Card */}
          <FeatureCard 
            className="md:col-span-2 md:row-span-1"
            title="AI-Powered Breakdown"
            description="Overwhelmed by a big project? Just type the goal, and our AI breaks it down into actionable steps automatically."
            icon={<Brain className="w-6 h-6 text-indigo-400" />}
            delay={0.1}
          />
          
          <FeatureCard 
            title="Focus Mode"
            description="Block out distractions. One task at a time, full screen, with ambient soundscapes."
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            delay={0.2}
          />

          <FeatureCard 
            title="Team Sync"
            description="Share projects seamlessly. Real-time updates, role-based permissions, and collaborative planning."
            icon={<Users className="w-6 h-6 text-blue-400" />}
            delay={0.3}
          />

          <FeatureCard 
            title="Privacy First"
            description="End-to-end encryption. Your tasks, your data, your control. GDPR compliant."
            icon={<Shield className="w-6 h-6 text-green-400" />}
            delay={0.4}
          />
          
          <FeatureCard 
            title="Deep Analytics"
            description="Understand your productivity patterns. Track flow states, identify peak hours, optimize your workflow."
            icon={<BarChart className="w-6 h-6 text-purple-400" />}
            delay={0.5}
          />

          <FeatureCard 
            title="Cross-Platform"
            description="Desktop, mobile, web. Seamlessly synced across all your devices in real-time."
            icon={<Smartphone className="w-6 h-6 text-pink-400" />}
            delay={0.6}
          />
        </div>
      </div>
    </section>
  )
}
