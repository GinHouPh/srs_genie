import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileText,
  Download,
  Sparkles,
  Loader2,
  Calendar,
  Zap,
  Network,
  Layers,
  Lock,
  ExternalLink,
  Printer
} from 'lucide-react';
import { User, SubscriptionTier, SaaSInvoice, PaymentTransactionRecord, PricingPlan, BillingAddress } from '../types';
import { saasStore } from '../services/saasStore';
import { authService } from '../services/authService';
import { cashfreeService } from '../services/cashfreeService';
import { CashfreeCustomerCheckoutModal } from './CashfreeCustomerCheckoutModal';

interface ClientBillingPageProps {
  user: User;
  onBack: () => void;
  onPlanUpdated: (newPlan: SubscriptionTier) => void;
  onNavigateToAdmin?: () => void;
}

export const ClientBillingPage: React.FC<ClientBillingPageProps> = ({
  user,
  onBack,
  onPlanUpdated,
  onNavigateToAdmin
}) => {
  const isAdmin = user.role === 'admin';
  const [plans, setPlans] = useState<PricingPlan[]>(() => saasStore.getPlans());
  const cfConfig = cashfreeService.getConfig();

  useEffect(() => {
    return saasStore.subscribe(() => {
      setPlans(saasStore.getPlans());
    });
  }, []);

  const [currentPlanId, setCurrentPlanId] = useState<SubscriptionTier>(user.plan || 'free');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<SubscriptionTier | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [paidReceipt, setPaidReceipt] = useState<{
    orderId: string;
    cfOrderId?: string;
    planName: string;
    amount: number;
    currency: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    company?: string;
    billingAddress?: BillingAddress;
    gstin?: string;
    date: string;
  } | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);

  const activePlan = plans.find(p => p.id === currentPlanId) || plans[0];

  // Invoices & Transactions belonging to this client
  const clientInvoices = saasStore.getInvoices().filter(
    i => i.customerEmail.toLowerCase() === user.email.toLowerCase() || i.customerId === user.id
  );

  const clientTransactions = saasStore.getTransactions().filter(
    t => t.customerEmail.toLowerCase() === user.email.toLowerCase() || t.customerId === user.id
  );

  const handleSelectPlan = async (planId: SubscriptionTier) => {
    if (planId === currentPlanId || isProcessing) return;
    setErrorMsg(null);

    const targetPlan = plans.find(p => p.id === planId);
    if (!targetPlan) return;

    // 1. TRIAL PLAN ACTIVATION (Cardless or With Card)
    if (targetPlan.isTrial) {
      if (!targetPlan.trialRequiresCard) {
        const trialRes = saasStore.activateTrial(user.id, user.email, planId);
        if (!trialRes.success) {
          setErrorMsg(trialRes.message);
          return;
        }
        authService.updateProfile(user.id, {
          plan: planId,
          trialEndsAt: trialRes.trialEndsAt,
          isTrialActive: true
        });
        setCurrentPlanId(planId);
        onPlanUpdated(planId);
        setToastMsg(`🎉 Activated ${targetPlan.trialDays || 14}-day trial for ${targetPlan.name}! Free access granted.`);
        setTimeout(() => setToastMsg(null), 4000);
        return;
      }
      // If trial requires card, open Customer Checkout
      setCheckoutPlan(targetPlan);
      return;
    }

    // 2. FREE BASELINE PLAN: Instant downgrade / upgrade
    if (targetPlan.priceMonthly === 0 && !targetPlan.isTrial) {
      authService.updateProfile(user.id, { plan: planId, isTrialActive: false });
      const allCustomers = saasStore.getCustomers();
      const cust = allCustomers.find(c => c.email.toLowerCase() === user.email.toLowerCase());
      if (cust) {
        saasStore.updateCustomerPlan(cust.id, planId);
      }
      setCurrentPlanId(planId);
      onPlanUpdated(planId);
      setToastMsg(`Your account tier has been switched to ${targetPlan.name}.`);
      setTimeout(() => setToastMsg(null), 3000);
      return;
    }

    // 3. PAID PLANS: Open Required Customer Data Entry Modal before Cashfree Checkout
    setCheckoutPlan(targetPlan);
  };

  const handlePaymentSuccess = (receipt: {
    orderId: string;
    cfOrderId?: string;
    planName: string;
    amount: number;
    currency: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    company?: string;
    billingAddress?: BillingAddress;
    gstin?: string;
    date: string;
  }) => {
    if (checkoutPlan) {
      setCurrentPlanId(checkoutPlan.id);
      onPlanUpdated(checkoutPlan.id);
    }
    setPaidReceipt(receipt);
    setToastMsg(`Payment confirmed! Your subscription is upgraded to ${receipt.planName}.`);
    setCheckoutPlan(null);
  };

  const handlePrintReceipt = (inv: SaaSInvoice) => {
    const printWin = window.open('', '_blank', 'width=800,height=600');
    if (!printWin) return;
    const bSettings = saasStore.getBusinessSettings();
    const subtotal = Math.round(inv.amount / 1.18);
    const gstAmount = inv.amount - subtotal;

    printWin.document.write(`
      <html>
        <head>
          <title>GST Tax Invoice - ${inv.invoiceNumber}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
            .header { border-bottom: 2px solid #d90429; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-start; }
            .brand { font-size: 26px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
            .brand span { color: #d90429; }
            .badge { background: #111; color: #fff; padding: 5px 12px; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; font-size: 13px; }
            .card { background: #fafafa; border: 1px solid #eee; padding: 15px; }
            .card-title { font-weight: bold; text-transform: uppercase; font-size: 11px; color: #666; margin-bottom: 8px; letter-spacing: 0.5px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 25px; }
            .table th, .table td { border-bottom: 1px solid #ddd; padding: 12px; text-align: left; font-size: 13px; }
            .table th { background: #f4f4f4; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #444; }
            .total-box { margin-left: auto; width: 280px; font-size: 13px; }
            .total-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
            .total-row.grand { font-size: 16px; font-weight: bold; border-top: 2px solid #111; border-bottom: none; padding-top: 10px; margin-top: 6px; }
            .footer { margin-top: 40px; font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 15px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">SRS <span>GENIE</span></div>
              <div style="font-size: 12px; color: #444; margin-top: 4px; font-weight: 600;">${bSettings.legalEntityName}</div>
              <div style="font-size: 11px; color: #666;">GSTIN: ${bSettings.taxRegistrationNumber}</div>
              <div style="font-size: 11px; color: #666;">${bSettings.headquartersAddress}</div>
            </div>
            <div style="text-align: right;">
              <div class="badge">Original Tax Invoice</div>
              <div style="font-size: 13px; font-weight: bold; margin-top: 8px;">${inv.invoiceNumber}</div>
              <div style="font-size: 12px; color: #666;">Date: ${inv.date}</div>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-title">Billed To (Customer Details)</div>
              <div><strong>${inv.customerName}</strong></div>
              <div>Email: ${inv.customerEmail}</div>
              ${inv.customerPhone ? `<div>Mobile: +91 ${inv.customerPhone}</div>` : ''}
              ${inv.company ? `<div>Company: ${inv.company}</div>` : ''}
              ${inv.billingAddress?.addressLine1 ? `
                <div style="margin-top: 4px; color: #555;">
                  ${inv.billingAddress.addressLine1}${inv.billingAddress.addressLine2 ? ', ' + inv.billingAddress.addressLine2 : ''}<br/>
                  ${inv.billingAddress.city}, ${inv.billingAddress.state} - ${inv.billingAddress.postalCode}<br/>
                  ${inv.billingAddress.country || 'India'}
                </div>
              ` : ''}
              ${inv.gstin ? `<div style="margin-top: 6px; font-weight: bold; color: #111;">Customer GSTIN: ${inv.gstin}</div>` : ''}
            </div>

            <div class="card">
              <div class="card-title">Payment & Gateway Details</div>
              <div>Gateway: <strong>Cashfree Payments</strong></div>
              <div>Status: <span style="color: #059669; font-weight: bold;">PAID & SETTLED</span></div>
              ${inv.transactionId ? `<div style="margin-top: 4px;">Txn Reference: <code style="background: #eef; padding: 2px 4px;">${inv.transactionId}</code></div>` : ''}
              <div style="margin-top: 4px; font-size: 11px; color: #777;">Mode: UPI / Cards / NetBanking</div>
              <div style="font-size: 11px; color: #777;">Supply: Software Specification Services (SAC 998314)</div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>SAC Code</th>
                <th>Qty</th>
                <th style="text-align: right;">Rate</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>SRS Genie Platform Subscription — ${inv.plan.toUpperCase()} Tier</strong><br/>
                  <span style="font-size: 11px; color: #666;">Autonomous AI software specification generator & MCP live gateway key.</span>
                </td>
                <td>998314</td>
                <td>1 Month</td>
                <td style="text-align: right;">₹${subtotal.toLocaleString()}</td>
                <td style="text-align: right;">₹${subtotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <div class="total-row">
              <span>Taxable Subtotal:</span>
              <span>₹${subtotal.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>CGST (9%):</span>
              <span>₹${Math.round(gstAmount / 2).toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>SGST / UTGST (9%):</span>
              <span>₹${Math.round(gstAmount / 2).toLocaleString()}</span>
            </div>
            <div class="total-row grand">
              <span>Total Paid:</span>
              <span>₹${inv.amount.toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            This is an electronically generated and digitally authorized GST Tax Invoice issued via Cashfree PG.<br/>
            ${bSettings.invoiceFooterNote}
          </div>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.print();
  };

  return (
    <div className="w-full space-y-12 py-8 animate-in fade-in duration-500">
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div className="shell space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.16em] text-muted hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 text-accent group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-display uppercase tracking-wider text-muted bg-box px-3 py-1.5 border border-line">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Cashfree PG Verified</span>
          </div>
        </div>

        <div className="agape-card p-8 sm:p-10 relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="eyebrow mb-3">Client Area // Account & Subscription</div>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-white tracking-[0.04em] uppercase mb-4">
              Billing, Plans & Invoices
            </h1>
            <p className="font-body text-sm text-muted leading-relaxed">
              Account: <strong className="text-white">{user.email}</strong>. 
              Manage your engineering quotas, change tiers, and process upgrades seamlessly via Cashfree PG (UPI, Cards, NetBanking).
            </p>
          </div>
        </div>
      </div>

      {/* 2. FEEDBACK MESSAGES & RECEIPT BANNER */}
      <div className="shell space-y-4">
        {errorMsg && (
          <div className="p-4 bg-box border-l-2 border-accent border-line text-white text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="font-display uppercase tracking-wider text-muted hover:text-white text-[11px]">
              Dismiss
            </button>
          </div>
        )}

        {paidReceipt && (
          <div className="p-6 bg-surface border border-accent relative overflow-hidden animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="eyebrow mb-1">Cashfree Transaction Confirmed</div>
                <h3 className="font-display text-xl font-semibold text-white uppercase tracking-[0.04em]">
                  Upgraded to {paidReceipt.planName}
                </h3>
                <p className="font-body text-xs text-muted">
                  Order Ref: <code className="text-accent font-mono">{paidReceipt.orderId}</code>
                  {paidReceipt.cfOrderId && (
                    <span> · Cashfree ID: <code className="text-white font-mono">{paidReceipt.cfOrderId}</code></span>
                  )}
                </p>
                <div className="text-xs text-muted font-body pt-2 border-t border-line/60 space-y-0.5">
                  <div className="text-white font-medium">Billed To: {paidReceipt.customerName || user.name} ({paidReceipt.customerEmail || user.email})</div>
                  {paidReceipt.customerPhone && (
                    <div>Mobile: <span className="font-mono text-white">+91 {paidReceipt.customerPhone}</span></div>
                  )}
                  {paidReceipt.billingAddress?.addressLine1 && (
                    <div>
                      Address: {paidReceipt.billingAddress.addressLine1}, {paidReceipt.billingAddress.city}, {paidReceipt.billingAddress.state} - {paidReceipt.billingAddress.postalCode}
                    </div>
                  )}
                  {paidReceipt.gstin && (
                    <div>GSTIN: <span className="font-mono text-white">{paidReceipt.gstin}</span></div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-3 shrink-0">
                <div className="sm:text-right">
                  <span className="badge--on text-[11px]">Settled & Active</span>
                  <div className="font-display text-2xl font-mono text-white mt-1">
                    {paidReceipt.currency} {paidReceipt.amount.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const mockInv: SaaSInvoice = {
                        id: `inv_${Date.now()}`,
                        customerId: user.id,
                        customerName: paidReceipt.customerName || user.name || 'Customer',
                        customerEmail: paidReceipt.customerEmail || user.email,
                        customerPhone: paidReceipt.customerPhone || user.phone,
                        company: paidReceipt.company || user.company,
                        billingAddress: paidReceipt.billingAddress || user.billingAddress,
                        gstin: paidReceipt.gstin || user.gstin,
                        amount: paidReceipt.amount,
                        status: 'paid',
                        date: new Date().toISOString().split('T')[0],
                        plan: (currentPlanId || 'pro') as SubscriptionTier,
                        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
                        paymentGateway: 'cashfree',
                        transactionId: paidReceipt.cfOrderId || paidReceipt.orderId,
                        currency: paidReceipt.currency
                      };
                      handlePrintReceipt(mockInv);
                    }}
                    className="btn btn-sm btn--accent flex items-center gap-1.5 text-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Print Tax Invoice</span>
                  </button>

                  <button
                    onClick={() => setPaidReceipt(null)}
                    className="btn btn-sm btn--ghost text-xs"
                  >
                    Close Notice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {toastMsg && !paidReceipt && (
          <div className="p-4 bg-box border border-accent text-white flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            <span className="font-display text-xs uppercase tracking-[0.1em]">{toastMsg}</span>
          </div>
        )}
      </div>

      {/* 3. CURRENT ACTIVE TIER OVERVIEW & STATS BAR */}
      <div className="shell">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="stat">
            <span className="stat__value text-white uppercase font-display">
              {isAdmin ? 'Super Admin' : activePlan.name}
            </span>
            <span className="stat__label">Current Active Tier</span>
            <div className="text-[11px] text-accent mt-2 font-mono">
              {isAdmin ? 'Unlimited Authority' : `$${activePlan.priceMonthly} / month`}
            </div>
          </div>

          <div className="stat">
            <span className="stat__value text-accent font-mono">
              {isAdmin ? '∞ Unlimited' : activePlan.quotaSpecsPerMonth}
            </span>
            <span className="stat__label">Specs / Month Quota</span>
            <div className="text-[11px] text-muted mt-2 font-body">
              All 6 Tiers (22 Files)
            </div>
          </div>

          <div className="stat">
            <span className="stat__value text-white font-mono">
              {isAdmin ? '∞ Unlimited' : activePlan.quotaMcpKeys}
            </span>
            <span className="stat__label">Active MCP Keys</span>
            <div className="text-[11px] text-muted mt-2 font-body">
              Cursor, Windsurf & CLI Agents
            </div>
          </div>

          <div className="stat">
            <span className="stat__value text-white font-mono">
              {isAdmin ? 'Root Executive' : activePlan.maxTeamSeats}
            </span>
            <span className="stat__label">{isAdmin ? 'Privilege Scope' : 'Team Seats'}</span>
            <div className="text-[11px] text-accent mt-2 font-body">
              {isAdmin ? 'Full System Governance' : (activePlan.prioritySupport ? 'Priority 24/7 Support' : 'Community Support')}
            </div>
          </div>
        </div>
      </div>

      {/* 4. PLANS & PRICING GRID (CLIENTS) OR EXECUTIVE PRIVILEGE OVERVIEW (ADMIN) */}
      {isAdmin ? (
        <section className="shell space-y-6">
          <div className="agape-card p-8 sm:p-10 border-accent relative overflow-hidden bg-surface">
            <div className="max-w-3xl mb-8">
              <div className="eyebrow mb-2">Executive Privilege</div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-[0.04em] uppercase mb-3">
                Full Administrative Access // Unlimited Plans
              </h2>
              <p className="font-body text-xs sm:text-sm text-muted leading-relaxed">
                As the System Administrator, your account operates with perpetual unmetered compute and zero billing restrictions. You do not need to purchase or upgrade plans. Use the administrative controls below to customize customer plans, configure AI Model Providers, monitor real-time revenue analytics, or manage Cashfree credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-5 bg-ink border border-line">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="font-display text-xs uppercase tracking-wider text-white font-semibold">Uncapped Generation</span>
                </div>
                <p className="font-body text-xs text-muted leading-relaxed">
                  Synthesize unlimited 22-file specification packages across any industry domain with zero monthly limits.
                </p>
              </div>

              <div className="p-5 bg-ink border border-line">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="font-display text-xs uppercase tracking-wider text-white font-semibold">AI Model Providers</span>
                </div>
                <p className="font-body text-xs text-muted leading-relaxed">
                  Direct master control to connect Gemini, Claude, OpenAI, DeepSeek, or local Ollama endpoints.
                </p>
              </div>

              <div className="p-5 bg-ink border border-line">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-4 h-4 text-accent" />
                  <span className="font-display text-xs uppercase tracking-wider text-white font-semibold">Plans CRUD Engine</span>
                </div>
                <p className="font-body text-xs text-muted leading-relaxed">
                  Create, edit, or adjust customer pricing tiers, monthly limits, and feature lists at will.
                </p>
              </div>

              <div className="p-5 bg-ink border border-line">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span className="font-display text-xs uppercase tracking-wider text-white font-semibold">Cashfree PG Control</span>
                </div>
                <p className="font-body text-xs text-muted leading-relaxed">
                  Inspect live transactions, verify payment sessions, and manage gateway production credentials.
                </p>
              </div>
            </div>

            {onNavigateToAdmin && (
              <div className="pt-6 border-t border-line flex flex-wrap items-center gap-4">
                <button
                  onClick={onNavigateToAdmin}
                  className="btn btn-sm btn--accent"
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  <span>Open Admin Console</span>
                </button>
                <button
                  onClick={onBack}
                  className="btn btn-sm btn--ghost"
                >
                  <span>Return to Workspace</span>
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="shell space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-line">
            <div>
              <div className="eyebrow mb-2">Service Upgrades</div>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-[0.04em] uppercase">
                Available Subscription Tiers
              </h2>
            </div>
            <p className="font-body text-xs text-muted max-w-md">
              Upgrades take effect immediately upon settlement. Powered by Cashfree's PCI-DSS Level 1 compliant gateway.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map(p => {
              const isCurrent = p.id === currentPlanId;
              const isTargetProcessing = isProcessing && processingPlanId === p.id;
              const daysLeft = user.trialEndsAt
                ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                : 0;

              return (
                <div
                  key={p.id}
                  className={`agape-card p-6 flex flex-col justify-between transition-all relative ${
                    p.isTrial ? 'border-amber-500/40 bg-surface/90 shadow-xl shadow-amber-500/5' : ''
                  } ${isCurrent ? 'border-accent shadow-xl shadow-accent/5 ring-1 ring-accent' : ''}`}
                >
                  {isCurrent && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge--on text-[10px]">
                      {p.isTrial && user.trialEndsAt ? `Active Trial (${daysLeft}d left)` : 'Current Tier'}
                    </span>
                  )}
                  {!isCurrent && p.badge && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 font-display uppercase tracking-wider font-bold shadow-md ${
                      p.isTrial ? 'bg-amber-500 text-ink' : 'bg-accent text-white'
                    }`}>
                      {p.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="font-display font-semibold text-white text-base uppercase tracking-[0.08em]">
                        {p.name}
                      </h3>
                    </div>
                    <p className="font-body text-xs text-muted mb-4 min-h-[32px]">{p.description}</p>

                    <div className="mb-4 pb-3 border-b border-line">
                      {p.isTrial ? (
                        <div>
                          <span className="font-display text-3xl font-semibold text-amber-400 font-mono">
                            ${p.priceMonthly}
                          </span>
                          <span className="font-display uppercase tracking-[0.1em] text-xs text-muted">
                            {' '} / {p.trialDays || 14} days
                          </span>
                          <div className="text-[10px] text-muted font-mono mt-1">
                            {p.trialRequiresCard ? 'Card required' : 'No card required'} · Renews at ${p.postTrialMonthlyPrice || 29}/mo ({p.trialAutoConvertsTo || 'pro'})
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-display text-3xl font-semibold text-white font-mono">
                            {p.priceMonthly === 0 ? '$0' : `$${p.priceMonthly}`}
                          </span>
                          <span className="font-display uppercase tracking-[0.1em] text-xs text-muted"> / mo</span>
                          {p.priceMonthly > 0 && (
                            <div className="text-[10px] text-muted font-mono mt-1">
                              ≈ ₹{p.priceMonthly === 29 ? '2,499' : p.priceMonthly === 99 ? '7,999' : '24,999'} via Cashfree
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-xs text-body mb-6">
                      {p.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${p.isTrial ? 'text-amber-400' : 'text-accent'}`} />
                          <span className="font-body">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-line space-y-3">
                    <div className="font-body text-[11px] text-muted space-y-0.5">
                      <div>Specs Quota: <strong className="text-white">{p.quotaSpecsPerMonth} {p.isTrial ? 'during trial' : '/ mo'}</strong></div>
                      <div>MCP Keys: <strong className="text-accent">{p.quotaMcpKeys} active</strong></div>
                      {p.isTrial && (
                        <div className="text-amber-400/90 text-[10px] font-mono pt-0.5">
                          ⚡ {p.trialRequiresCard ? 'Payment method needed' : 'Instant cardless activation'}
                        </div>
                      )}
                    </div>

                    {isCurrent ? (
                      <button
                        disabled
                        className="btn btn-sm btn--ghost w-full justify-center opacity-60 cursor-default"
                      >
                        {p.isTrial ? `Trial Active (${daysLeft}d left)` : 'Active Plan'}
                      </button>
                    ) : (
                      <button
                        disabled={isProcessing}
                        onClick={() => handleSelectPlan(p.id)}
                        className={`btn btn-sm w-full justify-center ${
                          p.isTrial
                            ? 'bg-amber-500 text-ink hover:bg-amber-400 font-bold border-none'
                            : p.priceMonthly === 0
                            ? 'btn--solid'
                            : 'btn--accent'
                        }`}
                      >
                        {isTargetProcessing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                            <span>Connecting...</span>
                          </>
                        ) : p.isTrial ? (
                          <>
                            <Zap className="w-3.5 h-3.5 mr-1" />
                            <span>Start {p.trialDays || 14}-Day Free Trial</span>
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
        </section>
      )}

      {/* 5. INVOICES & BILLING HISTORY TABLE */}
      <section className="shell space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-line">
          <div>
            <div className="eyebrow mb-2">Billing Ledger</div>
            <h2 className="font-display text-2xl font-semibold text-white tracking-[0.04em] uppercase">
              Invoices & Payment History ({clientInvoices.length})
            </h2>
          </div>
          <p className="font-body text-xs text-muted max-w-md">
            Download receipts or view transaction references for accounting and expense tracking.
          </p>
        </div>

        <div className="agape-card overflow-hidden">
          {clientInvoices.length === 0 ? (
            <div className="p-12 text-center text-muted">
              <FileText className="w-10 h-10 text-muted mx-auto mb-3 opacity-50" />
              <p className="font-display uppercase tracking-[0.1em] text-white">No Invoices Found</p>
              <p className="text-xs text-muted mt-1">
                When you subscribe to a paid tier via Cashfree PG, official receipts will be generated here automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-box text-xs font-display text-muted uppercase tracking-[0.2em] border-b border-line">
                  <tr>
                    <th className="px-6 py-3.5">Invoice #</th>
                    <th className="px-6 py-3.5">Tier</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Gateway</th>
                    <th className="px-6 py-3.5">Transaction ID</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {clientInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-box/40 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-white">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge--off text-[10px] uppercase font-mono">
                          {inv.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-white">
                        ${inv.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted">
                        <span className="text-accent uppercase font-display tracking-wider text-[11px]">
                          {inv.paymentGateway ? inv.paymentGateway.toUpperCase() : 'CASHFREE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-muted">
                        {inv.transactionId ? (
                          <span title={inv.transactionId}>{inv.transactionId.slice(0, 14)}...</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={inv.status === 'paid' ? 'badge--on' : 'badge--off'}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted font-mono">
                        {inv.date}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handlePrintReceipt(inv)}
                          className="btn btn-sm btn--ghost p-1.5"
                          title="Print / Download Receipt"
                        >
                          <Printer className="w-3.5 h-3.5 text-accent mr-1" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* 6. SECURITY & PAYMENT METHODS FOOTNOTE */}
      <div className="shell">
        <div className="agape-card p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-display uppercase tracking-wider text-xs text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>PCI-DSS Level 1 Compliant Payments</span>
            </div>
            <p className="font-body text-xs text-muted">
              Cardholder credentials never touch our servers. Cashfree utilizes end-to-end tokenization and 256-bit encryption.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-box px-2.5 py-1 border border-line text-white font-mono text-[11px]">UPI</span>
            <span className="bg-box px-2.5 py-1 border border-line text-white font-mono text-[11px]">Google Pay</span>
            <span className="bg-box px-2.5 py-1 border border-line text-white font-mono text-[11px]">PhonePe</span>
            <span className="bg-box px-2.5 py-1 border border-line text-white font-mono text-[11px]">Visa / Mastercard</span>
            <span className="bg-box px-2.5 py-1 border border-line text-white font-mono text-[11px]">RuPay</span>
            <span className="bg-box px-2.5 py-1 border border-line text-white font-mono text-[11px]">NetBanking (50+ Banks)</span>
          </div>
        </div>
      </div>

      {/* Required Customer Data Entry Modal before Cashfree Checkout */}
      {checkoutPlan && (
        <CashfreeCustomerCheckoutModal
          isOpen={Boolean(checkoutPlan)}
          onClose={() => setCheckoutPlan(null)}
          plan={checkoutPlan}
          user={user}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
