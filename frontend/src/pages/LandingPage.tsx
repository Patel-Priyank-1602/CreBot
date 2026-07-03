import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/landing/HeroSection';
import WhyChooseSection from '../components/landing/WhyChooseSection';
import UsagePolicySection from '../components/landing/UsagePolicySection';
import FeatureGrid from '../components/landing/FeatureGrid';
import WorkflowSection from '../components/landing/WorkflowSection';
import SecuritySection from '../components/landing/SecuritySection';
import UseCasesSection from '../components/landing/UseCasesSection';
import AboutSection from '../components/landing/AboutSection';
import ContactSection from '../components/landing/ContactSection';
import FAQSection from '../components/landing/FAQSection';

export default function LandingPage() {
  return (
    <div className="dark bg-black min-h-screen">
      <Navbar />
      <HeroSection />
      <FeatureGrid />
      <UseCasesSection />
      <WhyChooseSection />
      <SecuritySection />
      <WorkflowSection />
      <UsagePolicySection />
      <FAQSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
