import Hero from '@/components/landing/Hero'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorks from '@/components/landing/HowItWorks'
import SocialProof from '@/components/landing/SocialProof'
import Footer from '@/components/landing/Footer'
import LandingNav from '@/components/landing/LandingNav'
import { landingContent } from '@/lib/constants/landing-content'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <Hero />
      <FeaturesSection content={landingContent.features} />
      <HowItWorks content={landingContent.howItWorks} />
      <SocialProof />
      <Footer />
    </div>
  )
}
