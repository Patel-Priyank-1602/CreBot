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

          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = current.plan === plan.name.toLowerCase();
              return (
                <Card key={plan.name} elevated={false}
                  className={`p-5 ${isCurrent ? 'border-[var(--white-alpha-20)]' : ''}`}>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold text-[var(--text-primary)]">${plan.price}</span>
                    <span className="text-sm text-[var(--text-muted)]">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <Check size={14} className="text-[var(--text-primary)]" />
                      {plan.chatbots === 999999 ? 'Unlimited chatbots' : `${plan.chatbots} chatbots`}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <Check size={14} className="text-[var(--text-primary)]" />
                      {formatFileSize(plan.storage)} storage
                    </li>
                    <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <Check size={14} className="text-[var(--text-primary)]" />
                      {plan.queries >= 999999 ? 'Unlimited queries' : `${plan.queries.toLocaleString()} queries/mo`}
                    </li>
                  </ul>
                  <Button variant={isCurrent ? 'secondary' : 'primary'}
                    className="w-full" size="sm"
                    disabled={isCurrent || upgrading === plan.name}
                    onClick={() => handleUpgrade(plan.name)}>
                    {upgrading === plan.name ? <Loader size={14} className="animate-spin" /> : null}
                    {isCurrent ? 'Current Plan' : upgrading === plan.name ? 'Upgrading...' : 'Upgrade'}
                  </Button>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}
