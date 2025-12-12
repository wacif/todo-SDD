import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Check, GripVertical, Clock, Calendar } from 'lucide-react';

export const InteractiveDemo: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse tracking state
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation to avoid jitter
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Map mouse position to rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]);

  // Visual effects based on tilt
  const brightness = useTransform(mouseYSpring, [-0.5, 0.5], [1.2, 0.8]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate normalized position (-0.5 to 0.5)
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               >
                 <Sparkles size={14} className="text-indigo-400" />
               </motion.div>
             </div>
             <div className="text-lg font-medium text-white">Refactor Animation Engine</div>
             <div className="mt-3 flex gap-2">
               <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-gray-400 border border-white/5">High Impact</span>
               <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-gray-400 border border-white/5">Dev</span>
             </div>
          </motion.div>

          {/* Staggered items */}
          {[1, 2].map((i) => (
             <motion.div 
               key={i}
               style={{ transform: `translateZ(${50 - (i * 10)}px)` }}
               className="p-3 rounded-xl bg-gray-800/40 border border-white/5 backdrop-blur-sm flex items-center gap-3"
             >
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${i === 1 ? 'border-green-500/50 bg-green-500/20 text-green-500' : 'border-gray-600'}`}>
                   {i === 1 && <Check size={10} strokeWidth={4} />}
                </div>
                <div className="flex-1">
                   <div className={`text-sm ${i === 1 ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                      {i === 1 ? 'Update API Integration' : 'Write Documentation'}
                   </div>
                </div>
             </motion.div>
          ))}

        </div>

        {/* Layer 4: Floating Action Button */}
        <motion.div 
          style={{ transform: "translateZ(80px)" }}
          className="absolute bottom-6 right-6"
        >
          <button className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:bg-indigo-500 transition-colors">
            <Plus size={24} />
          </button>
        </motion.div>
        
        {/* Layer 5: Decorative particles */}
        <motion.div 
           style={{ transform: "translateZ(40px)" }}
           animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
           transition={{ duration: 3, repeat: Infinity }}
           className="absolute bottom-20 left-10 w-2 h-2 rounded-full bg-purple-400 blur-[2px]"
        />
        <motion.div 
           style={{ transform: "translateZ(20px)" }}
           animate={{ y: [0, 15, 0], opacity: [0.3, 0.7, 0.3] }}
           transition={{ duration: 4, repeat: Infinity }}
           className="absolute top-40 right-10 w-3 h-3 rounded-full bg-indigo-400 blur-[4px]"
        />

      </motion.div>
      
      {/* Reflection Shadow */}
      <div className="absolute -bottom-10 left-10 right-10 h-10 bg-black/50 blur-xl rounded-[100%] transform scale-x-75 opacity-60"></div>
    </div>
  );
};