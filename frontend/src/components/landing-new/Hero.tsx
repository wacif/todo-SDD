'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '../ui/button'
import { InteractiveDemo } from './InteractiveDemo'
import { ArrowRight, Star, Check, Sparkles } from 'lucide-react'

interface HeroProps {
  onCtaClick: () => void
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const y2 = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden mesh-gradient">
      {/* Abstract Background Elements with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y: y1, opacity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          style={{ y: y2, opacity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AI-Powered Productivity
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white">
              Organize <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">chaos</span>. <br/>
              Achieve <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">flow</span>.
            </h1>
            
            <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
              Stop drowning in tasks. DoBot uses intelligent sorting and AI breakdowns to help you focus on what actually matters, right now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={onCtaClick} className="group">
                Start for free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => {
                const el = document.getElementById('features')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}>
                See AI in Action
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 pt-4">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-950 bg-gradient-to-br from-indigo-500 to-purple-500" />
                 ))}
              </div>
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-500">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
                <span>Loved by 10,000+ makers</span>
              </div>
            </div>
          </motion.div>

          {/* Interactive Hero Graphic */}
          <div className="relative">
            <InteractiveDemo />
            
            {/* Floating UI Elements for decoration */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 bg-gray-800/90 backdrop-blur p-4 rounded-xl border border-gray-700 shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Check size={20} className="text-green-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Productivity up 40%</div>
                  <div className="text-xs text-gray-400">Last 7 days</div>
                </div>
              </div>
            </motion.div>

             <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 bg-gray-800/90 backdrop-blur p-4 rounded-xl border border-gray-700 shadow-xl hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <Sparkles size={20} className="text-purple-500" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">AI Suggestions</div>
                  <div className="text-xs text-gray-400">Real-time analysis</div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
