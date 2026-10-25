import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { User, SubscriptionTier } from '../types';
import { saasStore } from '../services/saasStore';
import { authService } from '../services/authService';

interface ClientSubscriptionModalProps {
  user: User;
  onClose: () => void;
  onPlanUpdated: (newPlan: SubscriptionTier) => void;
}

export const ClientSubscriptionModal: React.FC<ClientSubscriptionModalProps> = ({
  user,
  onClose,
  onPlanUpdated
}) => {
  const plans = saasStore.getPlans();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>(user.plan || 'pro');
  const [toast, setToast] = useState<string | null>(null);

  const handleSelectPlan = (planId: SubscriptionTier) => {
    if (planId === currentPlan) return;

    // Update in authService
    authService.updateProfile(user.id, { plan: planId });

    // Update in saasStore customer list
    const allCustomers = saasStore.getCustomers();
    const cust = allCustomers.find(c => c.email.toLowerCase() === user.email.toLowerCase());
    if (cust) {
      saasStore.updateCustomerPlan(cust.id, planId);
    }

    setCurrentPlan(planId);
    onPlanUpdated(planId);
    setToast(`Your account has been switched to the ${planId.toUpperCase()} tier.`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="agape-card p-8 w-full max-w-4xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-muted hover:text-white bg-box border border-line transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Toast */}
        {toast && (
          <div className="mb-6 p-4 bg-box border border-accent text-white flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <span className="font-display text-xs uppercase tracking-[0.1em]">{toast}</span>
          </div>
        )}

        <div className="mb-8">
          <div className="eyebrow mb-2">Customer Billing Portal</div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-[0.04em] uppercase">
            Service Tiers & Quota Limits
          </h2>
          <p className="font-body text-xs text-muted mt-1">
            Account: <span className="text-white">{user.email}</span> · Select a service tier suited for your engineering velocity.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(p => {
            const isCurrent = p.id === currentPlan;
            return (
              <div
                key={p.id}
                className={`agape-card p-6 flex flex-col justify-between transition-all relative ${
                  isCurrent ? 'border-accent shadow-xl shadow-accent/5' : ''
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge--on text-[10px]">
                    Current Tier
                  </span>
                )}

                <div>
                  <h3 className="font-display font-semibold text-white text-base uppercase tracking-[0.08em] mb-1">
                    {p.name}
                  </h3>
                  <p className="font-body text-xs text-muted mb-4 min-h-[32px]">{p.description}</p>

                  <div className="mb-4 pb-3 border-b border-line">
                    <span className="font-display text-2xl font-semibold text-white font-mono">${p.priceMonthly}</span>
                    <span className="font-display uppercase tracking-[0.1em] text-xs text-muted"> / mo</span>
                  </div>

                  <div className="space-y-2 text-xs text-body mb-6">
                    {p.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        <span className="font-body">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-line space-y-3">
                  <div className="font-body text-[11px] text-muted space-y-0.5">
                    <div>Specs Quota: <strong className="text-white">{p.quotaSpecsPerMonth} / mo</strong></div>
                    <div>MCP Keys: <strong className="text-accent">{p.quotaMcpKeys} active</strong></div>
                  </div>

                  {isCurrent ? (
                    <button
                      disabled
                      className="btn btn-sm btn--ghost w-full justify-center opacity-60 cursor-default"
                    >
                      Active Tier
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(p.id)}
                      className="btn btn-sm btn--accent w-full justify-center"
                    >
                      {p.priceMonthly === 0 ? 'Select Free' : 'Switch Tier'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
