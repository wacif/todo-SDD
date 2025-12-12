'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Plus, Sparkles, Check, GripVertical, Clock, Calendar } from 'lucide-react'

export const InteractiveDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  
  // Mouse tracking state
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for rotation to avoid jitter
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  // Map mouse position to rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15])

  // Visual effects based on tilt
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Calculate normalized position (-0.5 to 0.5)
    const xPct = (mouseX / width) - 0.5
    const yPct = (mouseY / height) - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div 
      className="relative w-full max-w-md mx-auto perspective-1000 py-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      {/* 3D Container */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full aspect-[4/5] rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Dynamic Glare Effect */}
        <motion.div 
          style={{ 
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15), transparent 60%)`,
          }}
          className="absolute inset-0 pointer-events-none z-50 rounded-3xl"
        />

        {/* Floating Elements Layers */}
        
        {/* Layer 1: Background Grid (Deepest) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] z-0" style={{ transform: "translateZ(10px)" }}></div>

        {/* Layer 2: Header */}
        <motion.div 
          className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 border-b border-white/5 bg-gray-900/40"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
               <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
             </div>
             <div>
               <div className="text-xs text-gray-400 font-mono">FLOW CONTEXT</div>
               <div className="text-sm font-bold text-white">Deep Work Mode</div>
             </div>
          </div>
          <div className="flex gap-2 text-gray-500">
             <Clock size={16} />
             <div className="text-xs font-mono">02:45 PM</div>
          </div>
        </motion.div>

        {/* Layer 3: Floating Tasks */}
        <div className="absolute top-24 left-0 right-0 px-6 space-y-4 z-30">
          
          <motion.div 
            style={{ transform: "translateZ(60px)" }}
            className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 backdrop-blur-md shadow-lg group hover:border-indigo-400/50 transition-colors cursor-pointer"
          >
             <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Current Focus</span>
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 className="text-indigo-400"
               >
                 <Sparkles size={16} />
               </motion.div>
             </div>
             <p className="text-white font-medium mb-2">Design landing page sections</p>
             <div className="flex gap-2 text-xs text-gray-400">
               <span className="flex items-center gap-1">
                 <Clock size={12} />
                 45 min
               </span>
               <span className="flex items-center gap-1">
                 <Calendar size={12} />
                 Today
               </span>
             </div>
          </motion.div>

          <motion.div 
            style={{ transform: "translateZ(40px)" }}
            className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-md shadow-lg"
          >
             <div className="flex items-center gap-3 mb-2">
               <Check size={16} className="text-green-500" />
               <p className="text-gray-400 line-through text-sm">Review PRs</p>
             </div>
          </motion.div>

          <motion.div 
            style={{ transform: "translateZ(40px)" }}
            className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-md shadow-lg"
          >
             <div className="flex items-center gap-3 mb-2">
               <GripVertical size={16} className="text-gray-600" />
               <p className="text-gray-300 text-sm">Update documentation</p>
             </div>
          </motion.div>
        </div>

        {/* Layer 4: Add Button */}
        <motion.button 
          style={{ transform: "translateZ(70px)" }}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg hover:bg-indigo-500 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} className="text-white" />
        </motion.button>
      </motion.div>
    </div>
  )
}
