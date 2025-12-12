import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Sparkles, Workflow, ArrowDown } from 'lucide-react';

export const AiShowcase: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.4], [1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.6, 0.7, 1], [0, 1, 1]);

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const yMove = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section id="ai-showcase" ref={targetRef} className="relative h-[300vh] bg-[#050507]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            <motion.div 
                style={{ rotate }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[100px]" 
            />
        </div>

        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Text transitions */}
          <div className="space-y-12">
            <motion.div style={{ opacity: opacity1, y: yMove }} className="absolute md:relative">
              <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 border border-gray-700">
                <Brain className="text-gray-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">It starts with <br/> <span className="text-gray-500">Understanding.</span></h2>
              <p className="text-xl text-gray-400 max-w-md">
                FlowState doesn't just store your tasks. It reads them. Our neural engine analyzes intent, urgency, and context from a single sentence.
              </p>
            </motion.div>

            <motion.div style={{ opacity: opacity2, y: yMove }} className="absolute md:relative">
               <div className="w-12 h-12 bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
                <Workflow className="text-indigo-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Structuring <br/> <span className="text-indigo-500">Complexity.</span></h2>
              <p className="text-xl text-gray-400 max-w-md">
                Complex goals are broken down instantly. Vague ideas become actionable checklists. The AI restructures your chaos into a linear path.
              </p>
            </motion.div>

            <motion.div style={{ opacity: opacity3, y: yMove }} className="absolute md:relative">
               <div className="w-12 h-12 bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
                <Sparkles className="text-purple-400" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Achieving <br/> <span className="text-purple-500">Flow State.</span></h2>
              <p className="text-xl text-gray-400 max-w-md">
                With your path clear, you enter the zone. FlowState manages the cognitive load so you can focus purely on execution.
              </p>
            </motion.div>
          </div>

          {/* Right Side: Visual Representation */}
          <div className="hidden md:flex justify-center items-center h-[400px]">
            <motion.div 
                style={{ scale }}
                className="relative w-80 h-96 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800 p-6 shadow-2xl flex flex-col gap-4 overflow-hidden"
            >
                {/* Visual Elements changing */}
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent"
                    animate={{ top: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                {/* Cards stacking */}
                <motion.div 
                    style={{ opacity: opacity1 }} 
                    className="absolute inset-0 p-6 flex flex-col gap-3"
                >
                    <div className="text-sm text-gray-500 uppercase font-mono mb-2">Input Stream</div>
                    <div className="h-16 w-full bg-gray-800 rounded-lg border border-gray-700/50 p-3 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="h-2 w-2/3 bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-16 w-full bg-gray-800 rounded-lg border border-gray-700/50 p-3 flex items-center gap-3 translate-x-2">
                         <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="h-2 w-1/2 bg-gray-700 rounded"></div>
                    </div>
                     <div className="h-16 w-full bg-gray-800 rounded-lg border border-gray-700/50 p-3 flex items-center gap-3 -translate-x-1">
                         <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="h-2 w-3/4 bg-gray-700 rounded"></div>
                    </div>
                </motion.div>

                <motion.div 
                    style={{ opacity: opacity2 }} 
                    className="absolute inset-0 p-6 flex flex-col items-center justify-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 animate-pulse"></div>
                        <Brain size={64} className="text-white relative z-10" />
                    </div>
                    <div className="mt-8 flex gap-2">
                        <span className="w-1 h-8 bg-indigo-500 rounded-full animate-[height_1s_ease-in-out_infinite]"></span>
                        <span className="w-1 h-12 bg-purple-500 rounded-full animate-[height_1.2s_ease-in-out_infinite]"></span>
                        <span className="w-1 h-6 bg-pink-500 rounded-full animate-[height_0.8s_ease-in-out_infinite]"></span>
                        <span className="w-1 h-10 bg-indigo-500 rounded-full animate-[height_1.1s_ease-in-out_infinite]"></span>
                    </div>
                </motion.div>

                <motion.div 
                    style={{ opacity: opacity3 }} 
                    className="absolute inset-0 p-6 flex flex-col gap-2"
                >
                    <div className="text-sm text-indigo-400 uppercase font-mono mb-2 flex items-center gap-2">
                        <Sparkles size={12} />
                        Optimized Plan
                    </div>
                     <div className="h-12 w-full bg-indigo-900/20 rounded-lg border border-indigo-500/30 p-3 flex items-center justify-between">
                         <span className="text-xs text-indigo-200">1. High Priority</span>
                         <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
                    </div>
                     <div className="h-12 w-full bg-gray-900/50 rounded-lg border border-gray-700/30 p-3 flex items-center justify-between opacity-75">
                         <span className="text-xs text-gray-400">2. Medium Priority</span>
                         <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    </div>
                     <div className="h-12 w-full bg-gray-900/50 rounded-lg border border-gray-700/30 p-3 flex items-center justify-between opacity-50">
                         <span className="text-xs text-gray-500">3. Low Priority</span>
                         <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                    </div>
                </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0.9, 1], [1, 0]) }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2"
        >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <ArrowDown className="animate-bounce w-4 h-4" />
        </motion.div>
      </div>
    </section>
  );
};