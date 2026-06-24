import { motion } from 'framer-motion';
import { SignInButton } from '@clerk/clerk-react';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mb-4">
            Ready to turn your documents into conversations?
          </h2>
          <p className="text-lg text-[var(--text-muted)] mb-8 max-w-2xl mx-auto">
            Create your first chatbot, upload your knowledge, and start asking questions in minutes.
          </p>
          <SignInButton mode="modal">
            <Button variant="primary" size="lg">
              Create Your Chatbot
              <ArrowRight size={18} />
            </Button>
          </SignInButton>
        </motion.div>
      </div>
    </section>
  );
}
