import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';
import Navbar from '../components/layout/Navbar';
import CustomCursor from '../components/common/CustomCursor';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import WhyChooseSection from '../components/landing/WhyChooseSection';
import UsagePolicySection from '../components/landing/UsagePolicySection';
import FeatureGrid from '../components/landing/FeatureGrid';
import WorkflowSection from '../components/landing/WorkflowSection';
import SecuritySection from '../components/landing/SecuritySection';
import BYOKSection from '../components/landing/BYOKSection';
import UseCasesSection from '../components/landing/UseCasesSection';
import AboutSection from '../components/landing/AboutSection';
import ContactSection from '../components/landing/ContactSection';
import VideoDemoSection from '../components/landing/VideoDemoSection';
import FAQSection from '../components/landing/FAQSection';
import ChatbotWidget from '../components/landing/ChatbotWidget';
import LandingLoader from '../components/landing/LandingLoader';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LandingLoader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className={`transition-opacity duration-1000 ${isLoading ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        <ReactLenis root options={{ lerp: 0.07, duration: 1.5, smoothWheel: true }}>
          <div className="dark bg-[#000000] min-h-screen overflow-x-hidden w-full custom-cursor-active">
            <CustomCursor />
            <Navbar />
            <HeroSection />
            <FeatureGrid />
            <UseCasesSection />
            <WhyChooseSection />
            <SecuritySection />
            <BYOKSection />
            <WorkflowSection />
            <UsagePolicySection />
            <FAQSection />
            <AboutSection />
            <ContactSection />
            <VideoDemoSection />
            <Footer />
            <ChatbotWidget />
          </div>
        </ReactLenis>
      </div>
    </>
  );
}