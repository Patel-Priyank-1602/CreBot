import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import FeatureGrid from '../components/landing/FeatureGrid';
import WorkflowSection from '../components/landing/WorkflowSection';
import SecuritySection from '../components/landing/SecuritySection';
import PricingPreview from '../components/landing/PricingPreview';
import CTASection from '../components/landing/CTASection';

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[var(--body-bg)] min-h-screen"
    >
      <Navbar />
      <HeroSection />
      <FeatureGrid />
      <WorkflowSection />
      <SecuritySection />
      <PricingPreview />
      <CTASection />
      <Footer />
    </motion.div>
  );
}
