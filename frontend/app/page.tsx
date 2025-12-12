'use client'

import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/landing-new/Navbar'
import { Hero } from '@/components/landing-new/Hero'
import { Features } from '@/components/landing-new/Features'
import { AiShowcase } from '@/components/landing-new/AiShowcase'
import { Pricing } from '@/components/landing-new/Pricing'
import { Testimonials } from '@/components/landing-new/Testimonials'
import { CallToAction } from '@/components/landing-new/CallToAction'

export default function HomePage() {
  const router = useRouter()
  
  const handleGetStarted = () => {
    router.push('/signup')
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Navbar onEnterApp={handleGetStarted} />
      <Hero onCtaClick={handleGetStarted} />
      <Features />
      <AiShowcase />
      <Pricing />
      <Testimonials />
      <CallToAction onCtaClick={handleGetStarted} />
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">TaskFlow</h4>
              <p className="text-sm text-gray-400">
                AI-powered productivity for modern teams.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-white mb-4">Product</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-white mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-white mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TaskFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

