import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Landing/Navbar';
import { Hero } from './components/Landing/Hero';
import { Features } from './components/Landing/Features';
import { AiShowcase } from './components/Landing/AiShowcase';
import { Testimonials } from './components/Landing/Testimonials';
import { Pricing } from './components/Landing/Pricing';
import { CallToAction } from './components/Landing/CallToAction';
import { AppView } from './components/AppView';
import { AppState } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);

  return (
    <div className="min-h-screen text-gray-50 selection:bg-indigo-500/30">
      <AnimatePresence mode="wait">
        {appState === AppState.LANDING ? (
          <motion.div
            key="landing"
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Navbar onEnterApp={() => setAppState(AppState.APP)} />
            <main>
              <Hero onCtaClick={() => setAppState(AppState.APP)} />
              <AiShowcase />
              <Features />
              <Testimonials />
              <Pricing />
              <CallToAction onCtaClick={() => setAppState(AppState.APP)} />
              
              {/* Footer */}
              <footer className="bg-black py-12 border-t border-gray-800">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="text-gray-500 text-sm">
                    © 2024 FlowState Inc. All rights reserved.
                  </div>
                  <div className="flex gap-6 text-sm text-gray-400">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  </div>
                </div>
              </footer>
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-screen w-screen"
          >
            <AppView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;