import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    desc: 'For individuals and small projects.',
    features: ['Up to 3 chatbots', '50 MB storage', '1,000 queries/month', 'Basic support'],
  },
  {
    name: 'Pro',
    price: '$79',
    desc: 'For growing teams and businesses.',
    popular: true,
    features: ['Up to 10 chatbots', '500 MB storage', '10,000 queries/month', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'Enterprise',
    price: '$199',
    desc: 'For large organizations.',
    features: ['Unlimited chatbots', '5 GB storage', 'Unlimited queries', 'Dedicated support', 'Custom branding'],
  },
];

export default function PricingPreview() {
  return (
    <section id="pricing" className="py-24 bg-[var(--bg-secondary)] scroll-mt-[72px]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[var(--text-primary)] mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-semibold rounded-full z-10">
                  Most Popular
                </div>
              )}
              <Card
                elevated={plan.popular}
                className={`p-6 h-full ${plan.popular ? 'border-[var(--white-alpha-20)]' : ''}`}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-[var(--text-primary)]">{plan.price}</span>
                    <span className="text-sm text-[var(--text-muted)]">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={16} className="text-[var(--text-primary)] mt-0.5 shrink-0" />
                      <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? 'primary' : 'secondary'} className="w-full">
                  Get Started
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
