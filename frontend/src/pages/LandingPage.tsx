import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import FeatureGrid from '../components/landing/FeatureGrid';
import WorkflowSection from '../components/landing/WorkflowSection';
import SecuritySection from '../components/landing/SecuritySection';
import UseCasesSection from '../components/landing/UseCasesSection';
import AboutSection from '../components/landing/AboutSection';
import ContactSection from '../components/landing/ContactSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[var(--bg-main)] min-h-screen"
    >
      <div className="grain" id="grain"></div>
      <Navbar />
      <HeroSection />
      <FeatureGrid />
      <WorkflowSection />
      <SecuritySection />
      <UseCasesSection />
      <AboutSection />
      <ContactSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </motion.div>
  );
}
