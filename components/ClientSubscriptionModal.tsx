import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { User, SubscriptionTier } from '../types';
import { saasStore } from '../services/saasStore';
import { authService } from '../services/authService';
import { cashfreeService } from '../services/cashfreeService';

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
  const cfConfig = cashfreeService.getConfig();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>(user.plan || 'free');
  const [toast, setToast] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingPlanId, setProcessingPlanId] = useState<SubscriptionTier | null>(null);
  const [paidReceipt, setPaidReceipt] = useState<{
    orderId: string;
    cfOrderId?: string;
    planName: string;
    amount: number;
    currency: string;
  } | null>(null);

  const handleSelectPlan = async (planId: SubscriptionTier) => {
    if (planId === currentPlan || isProcessing) return;
    setErrorMsg(null);

    const targetPlan = plans.find(p => p.id === planId);
    if (!targetPlan) return;

    // 1. FREE PLAN: Instant upgrade without payment gateway
    if (targetPlan.priceMonthly === 0) {
      authService.updateProfile(user.id, { plan: planId });
      const allCustomers = saasStore.getCustomers();
      const cust = allCustomers.find(c => c.email.toLowerCase() === user.email.toLowerCase());
      if (cust) {
        saasStore.updateCustomerPlan(cust.id, planId);
      }
      setCurrentPlan(planId);
      onPlanUpdated(planId);
      setToast(`Your account has been switched to the ${targetPlan.name} tier.`);
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // 2. PAID PLANS: Initiate Cashfree Payment Gateway Checkout
    try {
      setIsProcessing(true);
      setProcessingPlanId(planId);

      // Create Order on Cashfree PG
      const order = await cashfreeService.createOrder({
        customerId: user.id,
        customerEmail: user.email,
        customerName: user.name,
        planId: planId,
        amount: targetPlan.priceMonthly,
        currency: cfConfig.currency || 'INR'
      });

      // Launch Cashfree Hosted / Modal Checkout
      const result = await cashfreeService.openCheckout(order.paymentSessionId);

      if (result.success) {
        // Record verified payment in saasStore ledger
        const paymentRecord = saasStore.recordCashfreePaymentSuccess({
          customerId: user.id,
          customerEmail: user.email,
          customerName: user.name,
          planId: planId,
          amount: order.orderAmount,
          currency: order.orderCurrency,
          orderId: result.orderId || order.orderId,
          cfOrderId: result.cfOrderId || order.cfOrderId,
          paymentMethod: 'Cashfree PG (UPI / Cards / NetBanking)'
        });

        // Update active profile in authService
        authService.updateProfile(user.id, { plan: planId });
        setCurrentPlan(planId);
        onPlanUpdated(planId);

        // Display transaction receipt
        setPaidReceipt({
          orderId: paymentRecord.transaction.orderId,
          cfOrderId: paymentRecord.transaction.cfOrderId,
          planName: targetPlan.name,
          amount: paymentRecord.transaction.amount,
          currency: paymentRecord.transaction.currency
        });

        setToast(`Payment completed! Your account is now upgraded to ${targetPlan.name}.`);
      } else {
        setErrorMsg(result.error || 'The checkout process was closed or was incomplete.');
      }
    } catch (err: any) {
      console.error('[Cashfree Checkout Error]', err);
      setErrorMsg(err?.message || 'Failed to initiate Cashfree checkout. Please check gateway configuration.');
    } finally {
      setIsProcessing(false);
      setProcessingPlanId(null);
    }
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

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-box border-l-2 border-accent border-line text-white text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-muted hover:text-white ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* Success / Paid Receipt Banner */}
        {paidReceipt && (
          <div className="mb-6 p-6 bg-surface border border-accent relative overflow-hidden animate-in fade-in duration-300">
            <div className="flex items-start justify-between">
              <div>
                <div className="eyebrow mb-1">Cashfree Payment Confirmed</div>
                <h3 className="font-display text-xl font-semibold text-white tracking-[0.04em] uppercase mb-1">
                  Subscribed to {paidReceipt.planName}
                </h3>
                <p className="font-body text-xs text-muted">
                  Order ID: <code className="text-accent font-mono">{paidReceipt.orderId}</code>
                  {paidReceipt.cfOrderId && (
                    <span> · CF Ref: <code className="text-white font-mono">{paidReceipt.cfOrderId}</code></span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <span className="badge--on text-xs uppercase tracking-wider">Paid / Active</span>
                <div className="font-display text-lg text-white font-mono mt-1">
                  {paidReceipt.currency} {paidReceipt.amount}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-[11px] text-muted">
              <span>Your 6-tier .specs generation quotas and MCP server limits have been unlocked immediately.</span>
              <button
                onClick={() => setPaidReceipt(null)}
                className="font-display uppercase tracking-[0.1em] text-accent hover:text-white"
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && !paidReceipt && (
          <div className="mb-6 p-4 bg-box border border-accent text-white flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <span className="font-display text-xs uppercase tracking-[0.1em]">{toast}</span>
          </div>
        )}

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="eyebrow mb-2">Customer Billing Portal // Secure Checkout</div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-[0.04em] uppercase">
              Subscription Tiers & Gateway
            </h2>
            <p className="font-body text-xs text-muted mt-1">
              Account: <span className="text-white">{user.email}</span> · Instant activation via <strong className="text-accent">Cashfree PG</strong> (UPI, Credit/Debit Cards, NetBanking, Wallets).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted font-display uppercase tracking-wider bg-box px-3 py-1.5 border border-line">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>256-Bit SSL Secured</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(p => {
            const isCurrent = p.id === currentPlan;
            const isTargetProcessing = isProcessing && processingPlanId === p.id;

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
                    <span className="font-display text-2xl font-semibold text-white font-mono">
                      {p.priceMonthly === 0 ? '$0' : `$${p.priceMonthly}`}
                    </span>
                    <span className="font-display uppercase tracking-[0.1em] text-xs text-muted"> / mo</span>
                    {p.priceMonthly > 0 && (
                      <div className="text-[10px] text-muted font-mono mt-0.5">
                        ≈ ₹{p.priceMonthly === 29 ? '2,499' : p.priceMonthly === 99 ? '7,999' : '24,999'} via Cashfree
                      </div>
                    )}
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
                      Active Plan
                    </button>
                  ) : (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleSelectPlan(p.id)}
                      className={`btn btn-sm w-full justify-center ${
                        p.priceMonthly === 0 ? 'btn--solid' : 'btn--accent'
                      }`}
                    >
                      {isTargetProcessing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          <span>Connecting...</span>
                        </>
                      ) : p.priceMonthly === 0 ? (
                        'Select Free'
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5 mr-1" />
                          <span>Pay with Cashfree</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security and Payment methods footnote */}
        <div className="mt-8 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4 text-xs text-muted font-body">
          <div className="flex items-center gap-3">
            <span className="uppercase font-display tracking-wider text-[11px]">Supported Payment Methods:</span>
            <span className="bg-box px-2 py-0.5 border border-line text-[10px] text-white">UPI / GPay / PhonePe</span>
            <span className="bg-box px-2 py-0.5 border border-line text-[10px] text-white">Visa & Mastercard</span>
            <span className="bg-box px-2 py-0.5 border border-line text-[10px] text-white">RuPay</span>
            <span className="bg-box px-2 py-0.5 border border-line text-[10px] text-white">NetBanking</span>
          </div>

          <div className="text-[11px]">
            Powered by <strong className="text-white">Cashfree Payments v3</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
