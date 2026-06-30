import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, Loader } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ErrorState from '../components/common/ErrorState';
import { formatFileSize } from '../lib/utils';
import { getCurrentBilling, getPlans, upgradePlan, CurrentBilling, Plan } from '../services/billingService';

export default function BillingPage() {
  const [current, setCurrent] = useState<CurrentBilling | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upgrading, setUpgrading] = useState('');
  const [upgradeMsg, setUpgradeMsg] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getCurrentBilling(), getPlans()])
      .then(([c, p]) => {
        setCurrent(c);
        setPlans(p);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpgrade = async (planName: string) => {
    setUpgrading(planName);
    setUpgradeMsg('');
    try {
      const res = await upgradePlan(planName.toLowerCase());
      setUpgradeMsg(res.message);
      load();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setUpgrading('');
    }
  };

  if (error) return <ErrorState message={error} onRetry={load} />;

  const planNames: Record<string, string> = {
    free: 'Free',
    starter: 'Starter',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">Billing</h1>
        <p className="text-sm text-[var(--text-muted)]">Manage your subscription and payment methods.</p>
      </div>

      {loading ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-5 mb-6 animate-pulse">
          <div className="h-6 bg-[var(--skeleton-bg)] rounded w-48 mb-4" />
          <div className="h-2 bg-[var(--skeleton-bg)] rounded w-64 mb-2" />
          <div className="h-4 bg-[var(--skeleton-bg)] rounded w-96" />
        </div>
      ) : current && (
        <>
          <Card className="p-5 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)]">
                <CreditCard size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Current Plan</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  You are on the {planNames[current.plan] || current.plan} plan
                </p>
              </div>
              <span className="ml-auto px-3 py-1 rounded-full bg-[var(--white-alpha-10)] text-[var(--text-primary)] text-xs font-medium">
                {current.billing_status === 'active' ? 'Active' : current.billing_status}
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--skeleton-bg)] overflow-hidden max-w-xs">
              <div className="h-full rounded-full bg-[var(--white-alpha-20)]"
                style={{ width: `${Math.min((current.used_chatbots / current.chatbot_limit) * 100, 100)}%` }} />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Using {current.used_chatbots} of {current.chatbot_limit} chatbots
              ({formatFileSize(current.used_storage)} / {formatFileSize(current.storage_limit)})
            </p>
            {upgradeMsg && <p className="text-xs text-[var(--text-secondary)] mt-2">{upgradeMsg}</p>}
          </Card>

          <Card className="p-6 border-[var(--btn-bg)]/30 relative overflow-hidden mt-6">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-[var(--btn-bg)]/10 text-[var(--btn-bg)] text-xs font-bold rounded-full uppercase tracking-wider">Early Access</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">100% Free During Beta</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 max-w-2xl">
              CreBot is currently completely free while we continue to build and improve the platform! We will be introducing paid plans soon, but for now, we'd love for you to use it and share your feedback so we can make it even better.
            </p>
            <div className="bg-[var(--bg-input)] border border-[var(--border-soft)] rounded-xl p-4 flex items-center gap-3 w-fit">
              <Check className="text-[var(--btn-bg)]" size={18} />
              <span className="text-sm font-medium text-[var(--text-primary)]">You can create up to <strong>5 chatbots</strong> for absolutely free.</span>
            </div>
          </Card>
        </>
      )}
    </motion.div>
  );
}
