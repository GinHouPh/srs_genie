import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  Loader2,
  Building2,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { User, PricingPlan, BillingAddress } from '../types';
import { cashfreeService } from '../services/cashfreeService';
import { saasStore } from '../services/saasStore';
import { authService } from '../services/authService';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Chandigarh',
  'Other / International'
];

export interface CashfreeCustomerCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan;
  user: User;
  onPaymentSuccess: (receipt: {
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
  }) => void;
}

export const CashfreeCustomerCheckoutModal: React.FC<CashfreeCustomerCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  user,
  onPaymentSuccess
}) => {
  if (!isOpen) return null;

  const cfConfig = cashfreeService.getConfig();
  const businessSettings = saasStore.getBusinessSettings();

  // Calculate Payable Amount
  let payableAmount = plan.priceMonthly;
  let currency = cfConfig.currency || 'INR';
  if (currency === 'INR' && plan.priceMonthly < 500) {
    if (plan.priceMonthly === 29) payableAmount = 2499;
    else if (plan.priceMonthly === 99) payableAmount = 7999;
    else if (plan.priceMonthly === 299) payableAmount = 24999;
    else payableAmount = Math.round(plan.priceMonthly * 85);
  }

  // Pre-fill user data
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [company, setCompany] = useState(user.company || '');
  const [addressLine1, setAddressLine1] = useState(user.billingAddress?.addressLine1 || '');
  const [addressLine2, setAddressLine2] = useState(user.billingAddress?.addressLine2 || '');
  const [city, setCity] = useState(user.billingAddress?.city || '');
  const [state, setState] = useState(user.billingAddress?.state || 'Karnataka');
  const [postalCode, setPostalCode] = useState(user.billingAddress?.postalCode || '');
  const [country, setCountry] = useState(user.billingAddress?.country || 'India');
  const [gstin, setGstin] = useState(user.billingAddress?.gstin || user.gstin || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Cleanup errors when fields change
  const handleFieldChange = (field: string, val: string) => {
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setErrorMsg(null);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errors.name = 'Full name is required (min 2 characters).';
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'A valid email address is required for invoicing.';
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (!cleanDigits) {
      errors.phone = 'Mobile number is required by Cashfree PG.';
    } else if (cleanDigits.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!addressLine1.trim()) {
      errors.addressLine1 = 'Billing street address is required.';
    }

    if (!city.trim()) {
      errors.city = 'City is required.';
    }

    if (!state.trim()) {
      errors.state = 'State / Union Territory is required.';
    }

    const cleanPin = postalCode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length < 5) {
      errors.postalCode = 'Valid 6-digit PIN / Postal Code is required.';
    }

    if (gstin.trim() && gstin.trim().length !== 15) {
      errors.gstin = 'GSTIN must be exactly 15 alphanumeric characters if provided.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!validateForm()) {
      setErrorMsg('Please complete all required customer and billing fields marked with (*).');
      return;
    }

    try {
      setIsSubmitting(true);

      const cleanPhoneDigits = phone.replace(/\D/g, '').slice(-10);
      const billingDetails: BillingAddress = {
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim() || 'India',
        gstin: gstin.trim() ? gstin.trim().toUpperCase() : undefined
      };

      // 1. Persist updated customer data to user session & profile
      await authService.updateUserProfile(user.id, {
        name: name.trim(),
        company: company.trim() || undefined,
        phone: cleanPhoneDigits,
        billingAddress: billingDetails,
        gstin: billingDetails.gstin
      });

      // 2. Initiate Cashfree Order with authentic customer details
      const order = await cashfreeService.createOrder({
        customerId: user.id,
        customerEmail: email.trim().toLowerCase(),
        customerName: name.trim(),
        customerPhone: cleanPhoneDigits,
        planId: plan.id,
        amount: plan.priceMonthly,
        currency: (cfConfig.currency || 'INR') as 'INR' | 'USD',
        company: company.trim() || undefined,
        billingAddress: billingDetails,
        gstin: billingDetails.gstin
      });

      // 3. Open Cashfree Seamless Checkout Modal
      const checkoutResult = await cashfreeService.openCheckout(order.paymentSessionId);

      if (checkoutResult.success) {
        // 4. Record verified payment in saasStore ledger
        const paymentRecord = saasStore.recordCashfreePaymentSuccess({
          customerId: user.id,
          customerEmail: email.trim().toLowerCase(),
          customerName: name.trim(),
          customerPhone: cleanPhoneDigits,
          company: company.trim() || undefined,
          billingAddress: billingDetails,
          gstin: billingDetails.gstin,
          planId: plan.id,
          amount: order.orderAmount,
          currency: order.orderCurrency,
          orderId: checkoutResult.orderId || order.orderId,
          cfOrderId: checkoutResult.cfOrderId || order.cfOrderId,
          paymentMethod: 'Cashfree PG (UPI / Cards / NetBanking)'
        });

        // 5. Update active plan
        authService.updateProfile(user.id, {
          plan: plan.id,
          phone: cleanPhoneDigits,
          billingAddress: billingDetails
        });

        // 6. Notify parent with full invoice details
        onPaymentSuccess({
          orderId: paymentRecord.transaction.orderId,
          cfOrderId: paymentRecord.transaction.cfOrderId,
          planName: plan.name,
          amount: paymentRecord.transaction.amount,
          currency: paymentRecord.transaction.currency,
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: cleanPhoneDigits,
          company: company.trim() || undefined,
          billingAddress: billingDetails,
          gstin: billingDetails.gstin,
          date: new Date().toISOString()
        });

        onClose();
      } else {
        setErrorMsg(checkoutResult.error || 'Cashfree payment process was closed or not completed.');
      }
    } catch (err: any) {
      console.error('[Cashfree Checkout Error]', err);
      setErrorMsg(err?.message || 'Failed to initialize Cashfree payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-surface border border-line w-full max-w-3xl my-8 overflow-hidden shadow-2xl relative">
        {/* Top Accent Line */}
        <div className="h-1 bg-gradient-to-r from-accent via-accent to-red-600" />

        {/* Modal Header */}
        <div className="p-6 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="eyebrow mb-0.5">Secure Payment Gateway</div>
              <h2 className="font-display text-lg sm:text-xl font-semibold text-white tracking-[0.04em] uppercase">
                Customer & Billing Details
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted hover:text-white p-2 transition-colors disabled:opacity-50"
            title="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Summary Bar */}
        <div className="bg-box/50 border-b border-line p-5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-white uppercase text-base tracking-wider">
                {plan.name}
              </span>
              <span className="badge--on text-[10px]">Monthly Tier</span>
            </div>
            <p className="font-body text-xs text-muted">
              {plan.quotaSpecsPerMonth} Specifications / month · {plan.quotaMcpKeys} MCP Live Keys · Priority Queue
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="font-display text-2xl font-semibold text-white font-mono">
              ₹{payableAmount.toLocaleString()}
              <span className="text-xs text-muted font-body font-normal"> / month</span>
            </div>
            <div className="text-[11px] text-accent font-mono">
              ≈ ${plan.priceMonthly} USD · 18% GST Included
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 bg-accent/15 border-l-2 border-accent text-white text-xs flex items-center gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-accent shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <UserIcon className="w-4 h-4 text-accent" />
              <h3 className="font-display text-xs uppercase tracking-wider text-white font-semibold">
                1. Customer Contact (Required for Cashfree PG Verification)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-display uppercase tracking-wider text-white">
                  Full Name <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); handleFieldChange('name', e.target.value); }}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full bg-box border ${fieldErrors.name ? 'border-accent ring-1 ring-accent' : 'border-line'} px-3.5 py-2.5 text-xs text-white placeholder-muted focus:border-accent focus:outline-none`}
                  />
                </div>
                {fieldErrors.name && <p className="text-[11px] text-accent">{fieldErrors.name}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-display uppercase tracking-wider text-white">
                  Email Address (for Invoices & Receipts) <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); handleFieldChange('email', e.target.value); }}
                    placeholder="name@company.com"
                    className={`w-full bg-box border ${fieldErrors.email ? 'border-accent ring-1 ring-accent' : 'border-line'} px-3.5 py-2.5 text-xs text-white placeholder-muted focus:border-accent focus:outline-none`}
                  />
                </div>
                {fieldErrors.email && <p className="text-[11px] text-accent">{fieldErrors.email}</p>}
              </div>

              {/* Mobile Phone Number */}
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-display uppercase tracking-wider text-white">
                    Mobile Phone Number <span className="text-accent">*</span>
                  </label>
                  <span className="text-[10px] text-muted font-body">Cashfree PG Mandated</span>
                </div>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 bg-box border border-line text-xs font-mono text-muted select-none">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => { setPhone(e.target.value); handleFieldChange('phone', e.target.value); }}
                    placeholder="9876543210 (10 Digits)"
                    maxLength={14}
                    className={`flex-1 bg-box border ${fieldErrors.phone ? 'border-accent ring-1 ring-accent' : 'border-line'} px-3.5 py-2.5 text-xs text-white placeholder-muted focus:border-accent focus:outline-none font-mono`}
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="text-[11px] text-accent">{fieldErrors.phone}</p>
                ) : (
                  <p className="text-[11px] text-muted font-body">
                    Cashfree PG sends instant payment confirmation OTP and SMS transaction receipts to this number.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Billing & Tax Address */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <MapPin className="w-4 h-4 text-accent" />
              <h3 className="font-display text-xs uppercase tracking-wider text-white font-semibold">
                2. Billing Address & Tax Compliance
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Street Address Line 1 */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-display uppercase tracking-wider text-white">
                  Street Address <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={e => { setAddressLine1(e.target.value); handleFieldChange('addressLine1', e.target.value); }}
                  placeholder="Flat / Suite / Building No., 100 Feet Road"
                  className={`w-full bg-box border ${fieldErrors.addressLine1 ? 'border-accent ring-1 ring-accent' : 'border-line'} px-3.5 py-2.5 text-xs text-white placeholder-muted focus:border-accent focus:outline-none`}
                />
                {fieldErrors.addressLine1 && <p className="text-[11px] text-accent">{fieldErrors.addressLine1}</p>}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="block text-xs font-display uppercase tracking-wider text-white">
                  City <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => { setCity(e.target.value); handleFieldChange('city', e.target.value); }}
                  placeholder="e.g. Bengaluru, Mumbai, Pune"
                  className={`w-full bg-box border ${fieldErrors.city ? 'border-accent ring-1 ring-accent' : 'border-line'} px-3.5 py-2.5 text-xs text-white placeholder-muted focus:border-accent focus:outline-none`}
                />
                {fieldErrors.city && <p className="text-[11px] text-accent">{fieldErrors.city}</p>}
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className="block text-xs font-display uppercase tracking-wider text-white">
                  State / Union Territory <span className="text-accent">*</span>
                </label>
                <select
                  value={state}
                  onChange={e => { setState(e.target.value); handleFieldChange('state', e.target.value); }}
                  className="w-full bg-box border border-line px-3.5 py-2.5 text-xs text-white focus:border-accent focus:outline-none"
                >
                  {INDIAN_STATES.map(st => (
                    <option key={st} value={st} className="bg-surface text-white">{st}</option>
                  ))}
                </select>
              </div>

              {/* PIN Code */}
              <div className="space-y-1.5">
                <label className="block text-xs font-display uppercase tracking-wider text-white">
                  PIN / Postal Code <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={e => { setPostalCode(e.target.value); handleFieldChange('postalCode', e.target.value); }}
                  placeholder="e.g. 560001"
                  maxLength={10}
                  className={`w-full bg-box border ${fieldErrors.postalCode ? 'border-accent ring-1 ring-accent' : 'border-line'} px-3.5 py-2.5 text-xs text-white placeholder-muted focus:border-accent focus:outline-none font-mono`}
                />
                {fieldErrors.postalCode && <p className="text-[11px] text-accent">{fieldErrors.postalCode}</p>}
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="block text-xs font-display uppercase tracking-wider text-white">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="India"
                  className="w-full bg-box border border-line px-3.5 py-2.5 text-xs text-white placeholder-muted focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: B2B Business Details (Optional) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-line">
              <Building2 className="w-4 h-4 text-muted" />
              <h3 className="font-display text-xs uppercase tracking-wider text-muted font-semibold">
                3. Business Details & GSTIN (Optional // For B2B Invoices)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-display uppercase tracking-wider text-muted">
                  Company / Agency Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Acme Studio Pvt Ltd"
                  className="w-full bg-box border border-line px-3.5 py-2.5 text-xs text-white placeholder-muted focus:border-accent focus:outline-none"
                />
              </div>

              {/* GSTIN */}
              <div className="space-y-1.5">
                <label className="block text-xs font-display uppercase tracking-wider text-muted">
                  GSTIN (For Input Tax Credit)
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={e => { setGstin(e.target.value.toUpperCase()); handleFieldChange('gstin', e.target.value); }}
                  placeholder="29AAAAA0000A1Z5"
                  maxLength={15}
                  className={`w-full bg-box border ${fieldErrors.gstin ? 'border-accent ring-1 ring-accent' : 'border-line'} px-3.5 py-2.5 text-xs text-white placeholder-muted focus:border-accent focus:outline-none font-mono uppercase`}
                />
                {fieldErrors.gstin && <p className="text-[11px] text-accent">{fieldErrors.gstin}</p>}
              </div>
            </div>
          </div>

          {/* Security & Gateways Footnote */}
          <div className="p-4 bg-ink border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted font-body">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-display uppercase tracking-wider text-[11px]">Cashfree 256-Bit SSL Encrypted PG</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted flex-wrap">
              <span className="px-2 py-0.5 bg-box border border-line text-white">UPI / GPay / PhonePe</span>
              <span className="px-2 py-0.5 bg-box border border-line text-white">Cards (Visa / Master / RuPay)</span>
              <span className="px-2 py-0.5 bg-box border border-line text-white">NetBanking</span>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-line flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-sm btn--ghost justify-center text-xs py-2.5 px-5 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-sm btn--accent justify-center text-xs py-2.5 px-6 font-semibold flex items-center gap-2 shadow-lg shadow-accent/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting Cashfree PG...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Proceed to Pay ₹{payableAmount.toLocaleString()} via Cashfree</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

