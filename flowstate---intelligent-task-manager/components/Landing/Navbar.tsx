import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../ui/Button';
import { Layers } from 'lucide-react';

interface NavbarProps {
  onEnterApp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onEnterApp }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`
          flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-300
          ${isScrolled ? 'glass-panel shadow-lg bg-gray-900/80' : 'bg-transparent'}
        `}>
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">FlowState</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-gray-300 hover:text-white hidden sm:block">Log in</button>
            <Button size="sm" onClick={onEnterApp}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};