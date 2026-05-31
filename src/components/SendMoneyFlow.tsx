/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Check, ArrowRight, Search, ShieldCheck, HelpCircle, AlertCircle, Sparkles, Copy, 
  MapPin, User, DollarSign, ArrowLeft, RefreshCw, Smartphone, CreditCard, Landmark, 
  Plus, CheckCircle2, Award, Download, Share2, Clipboard, Loader2, Zap, X
} from 'lucide-react';
import { COUNTRIES } from '../data/mockData';
import { Recipient, Transfer, PaymentMethod, User as UserType, CountryInfo } from '../types';
import { getProviderLogo } from '../utils/providerLogos';

const PARTNER_PROVIDERS: Record<string, { 'Bank Transfer'?: string[], 'Mobile Wallet'?: string[], 'Cash Pickup'?: string[] }> = {
  'India': {
    'Bank Transfer': ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra'],
    'Mobile Wallet': ['Paytm', 'PhonePe', 'Google Pay', 'BHIM UPI', 'Mobikwik'],
    'Cash Pickup': ['Muthoot Finance', 'Manappuram Finance', 'Western Union', 'MoneyGram']
  },
  'Philippines': {
    'Bank Transfer': ['BDO Unibank', 'BPI Bank', 'Metrobank', 'Land Bank', 'Security Bank', 'UnionBank'],
    'Mobile Wallet': ['GCash', 'Maya', 'Coins.ph', 'GrabPay', 'ShopeePay'],
    'Cash Pickup': ['Cebuana Lhuillier', 'Palawan Express', 'MLhuillier', 'Western Union', 'LBC Express']
  },
  'Pakistan': {
    'Bank Transfer': ['Habib Bank Limited (HBL)', 'National Bank (NBP)', 'MCB Bank', 'Allied Bank', 'Meezan Bank'],
    'Mobile Wallet': ['Easypaisa', 'JazzCash', 'Nayapay', 'SadaPay', 'UBL Omni'],
    'Cash Pickup': ['Western Union', 'MoneyGram', 'Al Ansari Exchange', 'RIA Money Transfer']
  },
  'Bangladesh': {
    'Bank Transfer': ['Sonali Bank', 'Islami Bank', 'Dutch-Bangla Bank', 'BRAC Bank', 'Eastern Bank/Card'],
    'Mobile Wallet': ['bKash', 'Nagad', 'Rocket', 'Upay', 'mCash'],
    'Cash Pickup': ['Placid Express', 'Western Union', 'MoneyGram', 'RIA Money Transfer']
  },
  'Nepal': {
    'Bank Transfer': ['Nabil Bank', 'Nepal Investment Bank', 'Global IME Bank', 'Nepal Bank', 'Rastriya Banijya Bank'],
    'Mobile Wallet': ['eSewa', 'Khalti', 'IME Pay', 'Prabhu Pay'],
    'Cash Pickup': ['IME Transfer', 'Prabhu Money', 'Western Union', 'MoneyGram']
  },
  'Nigeria': {
    'Bank Transfer': ['Access Bank', 'GTBank', 'Zenith Bank', 'UBA Bank', 'First Bank', 'Stanbic IBTC'],
    'Mobile Wallet': ['OPay', 'PalmPay', 'Paga', 'MTN MoMo', 'Airtel Money'],
    'Cash Pickup': ['Western Union', 'MoneyGram', 'RIA Money Transfer', 'Small World']
  },
  'Ghana': {
    'Bank Transfer': ['GCB Bank', 'Ecobank Ghana', 'Absa Bank', 'Stanbic Bank', 'Fidelity Bank'],
    'Mobile Wallet': ['MTN MoMo', 'Telecel Cash', 'AirtelTigo Money', 'Zeepay'],
    'Cash Pickup': ['UnityLink', 'Express Funds', 'Western Union', 'MoneyGram', 'RIA']
  },
  'Somalia': {
    'Bank Transfer': ['Premier Bank', 'Dahabshiil Bank', 'Salaam Somali Bank', 'IBS Bank'],
    'Mobile Wallet': ['EVC Plus', 'Sahal', 'Edahab', 'Premier Wallet', 'Zaad'],
    'Cash Pickup': ['Dahabshiil', 'Western Union', 'MoneyGram', 'Amal Express', 'Tawakal Express']
  },
  'Kenya': {
    'Bank Transfer': ['KCB Bank', 'Equity Bank', 'Co-operative Bank', 'Standard Chartered', 'NCBA Bank'],
    'Mobile Wallet': ['M-Pesa', 'Airtel Money', 'T-Kash', 'Equity Cash'],
    'Cash Pickup': ['Western Union', 'MoneyGram', 'Dahabshiil', 'Postbank Kenya', 'RIA']
  },
  'Ethiopia': {
    'Bank Transfer': ['Commercial Bank of Ethiopia (CBE)', 'Awash Bank', 'Dashen Bank', 'Bank of Abyssinia'],
    'Mobile Wallet': ['Telebirr', 'CBE Birr', 'HELLO CASH', 'Shabelle Bank'],
    'Cash Pickup': ['Dahabshiil', 'Western Union', 'MoneyGram', 'Express Funds']
  }
};

const COUNTRY_PLACEHOLDERS: Record<string, { phone: string; account: string }> = {
  IN: { phone: '+91 98765 43210', account: '912010029381023 (15 digits)' },
  PH: { phone: '+63 915 281 9283', account: '1234-5678-90 (BPI/BDO Account)' },
  PK: { phone: '+92 300 1234567', account: 'PK80 UNIL 0112 3456 7890 12' },
  BD: { phone: '+880 1712-345678', account: '120.101.98765' },
  NP: { phone: '+977 981-2345678', account: '01234567890123' },
  NG: { phone: '+234 803 123 4567', account: '1012345678 (10-digit NUBAN)' },
  GH: { phone: '+233 24 123 4567', account: 'GH12 3456 7890 1234 56' },
  SO: { phone: '+252 61 123456', account: '102938475' },
  KE: { phone: '+254 712 345678', account: '0110912345600' },
  ET: { phone: '+251 91 123 4567', account: '1000123456789' },
  US: { phone: '+1 212 555 0199', account: '123456789 Routing + 987654321 Account' },
  GB: { phone: '+44 7911 123456', account: 'GB29 BUGB 1234 5678 9012 34' },
  EU: { phone: '+49 171 1234567', account: 'DE89 3704 0044 0532 0130 00' },
  AU: { phone: '+61 412 345 678', account: 'BSB 062-900 / Acc 12345678' },
  JP: { phone: '+81 90 1234 5678', account: '123-4567890' },
  BR: { phone: '+55 11 98765-4321', account: '341-0001 / Acc 12345-6' },
  MX: { phone: '+52 55 1234 5678', account: 'CLABE 012 180 00123456789 2' },
  CN: { phone: '+86 139 1234 5678', account: '6222 0210 0112 3456 789' },
  VN: { phone: '+84 91 234 5678', account: '01234567891011' },
  CO: { phone: '+57 300 123 4567', account: '501-123456-78' },
  ZA: { phone: '+27 82 123 4567', account: '1234567890' },
  EG: { phone: '+20 100 123 4567', account: 'EG12 0003 0001 1234 5678 9012 3' },
  TR: { phone: '+90 532 123 4567', account: 'TR56 0006 2000 0001 2345 6789 01' },
  MA: { phone: '+212 661-12345', account: '011 780 0000123456789012 34' },
  LK: { phone: '+94 71 123 4567', account: '1001-2345-6789' },
  ID: { phone: '+62 812-3456-7890', account: '1234567890' },
  TH: { phone: '+66 81 234 5678', account: '123-4-56789-0' },
  UG: { phone: '+256 772 123456', account: '9030012345678' },
  SN: { phone: '+221 77 123 45 67', account: 'SN012 01001 02345678901 23' },
  CM: { phone: '+237 677 12 34 56', account: 'CM21 10001 00001 12345678901 23' },
  JM: { phone: '+1 876 555 0199', account: '1234567' },
  UA: { phone: '+380 50 123 4567', account: 'UA12 300001 000002600123456' },
  PL: { phone: '+48 501 123 456', account: 'PL12 1020 1026 0000 1234 5678 9012' },
  RO: { phone: '+40 721 123 456', account: 'RO12 BTRL 1234 5678 9012 3456' },
  ZW: { phone: '+263 77 123 456', account: '1002-3456-7890' },
  DE: { phone: '+49 172 1234567', account: 'DE89 3704 0044 0532 0130 00' },
  FR: { phone: '+33 6 1234 5678', account: 'FR76 3000 6000 0112 3456 7890 123' },
  IT: { phone: '+39 312 123 4567', account: 'IT60 M030 6902 1120 7400 0001 234' },
  ES: { phone: '+34 612 345 678', account: 'ES91 2100 0418 4502 0005 1332' },
  NL: { phone: '+31 6 12345678', account: 'NL99 INGB 0123 4567 89' },
  IE: { phone: '+353 85 123 4567', account: 'IE12 AIBK 9311 5212 3456 78' },
  PT: { phone: '+351 912 345 678', account: 'PT50 0033 0000 1234 5678 9012 3' },
  CH: { phone: '+41 79 123 45 67', account: 'CH93 0000 0000 1234 5678 9' },
  SE: { phone: '+46 70 123 45 67', account: 'SE12 5000 0000 1234 5678 9012' },
  NO: { phone: '+47 912 34 567', account: 'NO12 1234 5678 901' },
  DK: { phone: '+45 20 12 34 56', account: 'DK12 1234 5678 9012 34' },
  SG: { phone: '+65 9123 4567', account: '123-45678-9' },
  MY: { phone: '+60 12-345 6789', account: '123456789012' },
  KR: { phone: '+82 10-1234-5678', account: '123-456789-01-012' },
  TW: { phone: '+886 912 345 678', account: '700-00123456789012' },
  NZ: { phone: '+64 21 123 4567', account: '12-3456-1234567-00' },
  AR: { phone: '+54 9 11 1234-5678', account: 'CBU 0070000000001234567890' },
  CL: { phone: '+56 9 1234 5678', account: '12.345.678-9' },
  PE: { phone: '+51 912 345 678', account: '002-123-456789012345-67' },
  EC: { phone: '+593 91 234 5678', account: '1234567890' },
  CR: { phone: '+506 8123-4567', account: 'CR12 0151 0001 2345 6789 01' },
  PA: { phone: '+507 6123-4567', account: '1234567890' },
  SA: { phone: '+966 50 123 4567', account: 'SA12 8000 0000 1234 5678 9012' },
  AE: { phone: '+971 50 123 4567', account: 'AE12 0110 0000 1234 5678 9012 3' },
  QA: { phone: '+974 5551 2345', account: 'QA12 QNBA 0000 0000 1234 5678 901' },
  KW: { phone: '+965 5123 4567', account: 'KW12 NBOK 0000 0000 1234 5678 901' },
  IL: { phone: '+972 50-123-4567', account: '12-345-67890123' },
  JO: { phone: '+962 7 9123 4567', account: 'JO12 Arab 0000 0003 1234 5678 901' },
  LB: { phone: '+961 3 123 456', account: 'LB12 0001 0200 0000 1234 5678 9012' },
  DZ: { phone: '+213 550 12 34 56', account: 'DZ12 0010 0000 1234 5678 9012' },
  TN: { phone: '+216 98 123 456', account: 'TN12 0020 0000 1234 5678 9012' },
  TZ: { phone: '+255 712 345 678', account: '011234567890' },
  RW: { phone: '+250 788 123 456', account: '100012345678' },
  CI: { phone: '+225 07 12 34 5678', account: 'CI12 01001 01234567890 12' },
  AO: { phone: '+244 912 345 678', account: 'AO06 0001 0000 1234 5678 9012 3' },
  MZ: { phone: '+258 82 123 4567', account: '12345678901234' },
  FJ: { phone: '+679 912 3456', account: '123456789' },
  HK: { phone: '+852 9123 4567', account: '123-456789-012' },
  CZ: { phone: '+420 712 345 678', account: '123456789/0300' },
  HU: { phone: '+36 20 123 4567', account: '12345678-01234567-00000000' },
  HR: { phone: '+385 91 123 4567', account: 'HR12 2340 0091 1234 5678 9' },
  BG: { phone: '+359 87 123 4567', account: 'BG12 UNCR 9123 4567 8901 23' }
};

const getCountryPlaceholder = (code: string) => {
  return COUNTRY_PLACEHOLDERS[code] || { phone: '+1 234 567 8900', account: '501009102830' };
};

import { translate } from '../translations';

interface SendMoneyFlowProps {
  user: UserType;
  walletBalance: number;
  recipients: Recipient[];
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (pm: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>) => void;
  onNavigateHome: () => void;
  onNavigate?: (screen: any) => void;
  onDeductWallet: (amount: number) => void;
  onAddTransaction: (tx: Omit<Transfer, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'transactionReference'>) => string;
  onAddRecipient?: (rec: Omit<Recipient, 'id' | 'userId' | 'createdAt'>) => Recipient | void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  // If repeating a transaction or starting with specific prefilled recipient:
  prefilledRecipient?: Recipient | null;
  prefilledCountry?: CountryInfo | null;
  prefilledTransfer?: Transfer | null;
  initialStep?: Step;
  onResetPrefilled: () => void;
  language?: string;
}

type Step = 'country' | 'recipient' | 'amount' | 'review' | 'payment' | 'processing' | 'success' | 'tracking' | 'receipt';

export function SendMoneyFlow({
  user,
  walletBalance,
  recipients,
  paymentMethods,
  onAddPaymentMethod,
  onNavigateHome,
  onNavigate,
  onDeductWallet,
  onAddTransaction,
  onAddRecipient,
  showToast,
  prefilledRecipient,
  prefilledCountry,
  prefilledTransfer,
  initialStep,
  onResetPrefilled,
  language = 'English'
}: SendMoneyFlowProps) {
  // Wizard state
  const [step, setStep] = useState<Step>(initialStep || 'country');
  
  // Model data states during creation
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  
  // Amounts
  const [sendAmountText, setSendAmountText] = useState('200');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<'Bank Transfer' | 'Mobile Wallet' | 'Cash Pickup'>('Bank Transfer');

  // Inline Add Recipient states
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [newRecFullName, setNewRecFullName] = useState('');
  const [newRecDeliveryMethod, setNewRecDeliveryMethod] = useState<'Bank Transfer' | 'Mobile Wallet' | 'Cash Pickup'>('Bank Transfer');
  const [newRecBankName, setNewRecBankName] = useState('');
  const [newRecAccountNumber, setNewRecAccountNumber] = useState('');
  const [newRecPhoneNumber, setNewRecPhoneNumber] = useState('');
  
  // Payment Method selection
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('');
  
  // Form add new payment modal
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<'card' | 'bank' | null>(null);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardBrand, setNewCardBrand] = useState('Visa');
  const [newBankName, setNewBankName] = useState('');
  const [newBankAccount, setNewBankAccount] = useState('');

  // Active Transaction Created Info
  const [activeTx, setActiveTx] = useState<Transfer | null>(prefilledTransfer || null);
  
  // Country filtering search
  const [countrySearch, setCountrySearch] = useState('');

  // Simulated Processing Screen Timeline
  const [processingIndex, setProcessingIndex] = useState(0);
  const stages = [
    { title: 'Payment Authorized', desc: 'Secure security clearance success', done: false },
    { title: 'Processing Transaction', desc: 'Generating clearing ledger instructions', done: false },
    { title: 'Transferred to Partner Bank', desc: 'Foreign exchange clearing checks ok', done: false },
    { title: 'Delivered Successfully', desc: 'Beneficiary account credited instantly', done: false }
  ];

  // Resolve prefilled states
  useEffect(() => {
    if (prefilledTransfer) {
      const foundCountry = COUNTRIES.find(c => c.name.toLowerCase() === prefilledTransfer.country.toLowerCase());
      if (foundCountry) {
        setSelectedCountry(foundCountry);
      }
      setActiveTx(prefilledTransfer);
      if (prefilledTransfer.deliveryMethod) {
        setDeliveryMethod(prefilledTransfer.deliveryMethod as any);
      }
      if (initialStep) {
        setStep(initialStep);
      } else {
        setStep('tracking');
      }
    } else if (prefilledRecipient) {
      const foundCountry = COUNTRIES.find(c => c.name.toLowerCase() === prefilledRecipient.country.toLowerCase());
      if (foundCountry) {
        setSelectedCountry(foundCountry);
      }
      setSelectedRecipient(prefilledRecipient);
      setDeliveryMethod(prefilledRecipient.deliveryMethod);
      setStep('amount');
    } else if (prefilledCountry) {
      setSelectedCountry(prefilledCountry);
      setStep('recipient');
    }
  }, [prefilledRecipient, prefilledCountry, prefilledTransfer, initialStep]);

  // Compute values
  const getExchangeRate = () => selectedCountry?.rate || 61.45;
  const sendAmount = parseFloat(sendAmountText) || 0;
  
  // Real-time fee calculation based on amount tiered thresholds and delivery method surcharges:
  // Base Fee: under CAD 100 = CAD 2.99; CAD 100 to 999 = CAD 3.99; CAD 1000+ = CAD 0.00
  // Delivery Surcharges: Mobile Wallet = CAD 1.00; Cash Pickup = CAD 1.50; Bank Transfer = CAD 0.00
  const getFee = () => {
    if (sendAmount <= 0) return 0;
    let baseFee = 0;
    if (sendAmount < 100) baseFee = 2.99;
    else if (sendAmount < 1000) baseFee = 3.99;
    else baseFee = 0;

    let surcharge = 0;
    if (deliveryMethod === 'Mobile Wallet') surcharge = 1.00;
    else if (deliveryMethod === 'Cash Pickup') surcharge = 1.50;

    return baseFee + surcharge;
  };

  const getReceiveAmount = () => {
    const rate = getExchangeRate();
    return sendAmount * rate;
  };

  const applyPromoCode = () => {
    if (promoCode.trim().toUpperCase() === 'GLOBESAVE') {
      setPromoDiscount(5.00);
      showToast('Promo code GLOBESAVE applied: $5.00 CAD Discount!', 'success');
    } else {
      setPromoDiscount(0.00);
      showToast('Invalid or expired promo code', 'error');
    }
  };

  const handleInlineAddRecipientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecFullName.trim()) {
      showToast('Please enter recipient full legal name', 'error');
      return;
    }
    
    if (newRecDeliveryMethod === 'Bank Transfer') {
      if (!newRecBankName.trim()) {
        showToast('Please enter or select bank name', 'error');
        return;
      }
      if (!newRecAccountNumber.trim() || newRecAccountNumber.length < 4) {
        showToast('Please enter a valid account number', 'error');
        return;
      }
    } else {
      if (!newRecBankName.trim() && newRecDeliveryMethod === 'Mobile Wallet') {
        showToast('Please enter a wallet provider name', 'error');
        return;
      }
      if (!newRecPhoneNumber.trim() || newRecPhoneNumber.length < 6) {
        showToast('Please enter a valid phone number', 'error');
        return;
      }
    }

    if (onAddRecipient) {
      const added = onAddRecipient({
        fullName: newRecFullName.trim(),
        country: selectedCountry.name,
        currency: selectedCountry.currency,
        deliveryMethod: newRecDeliveryMethod,
        bankName: newRecBankName.trim() || undefined,
        accountNumber: newRecDeliveryMethod === 'Bank Transfer' ? newRecAccountNumber.trim() : undefined,
        phoneNumber: newRecDeliveryMethod !== 'Bank Transfer' ? newRecPhoneNumber.trim() : undefined,
        relationship: 'Family/Friend',
        purpose: 'Family Support'
      });
      
      if (added) {
        setSelectedRecipient(added);
        setDeliveryMethod(added.deliveryMethod);
        setIsAddingRecipient(false);
        setStep('amount');
        showToast(`Selected ${added.fullName} as recipient!`, 'success');
      } else {
        setIsAddingRecipient(false);
      }
    } else {
      showToast('Action not supported currently', 'error');
    }
  };

  const getTotalCharge = () => {
    const fee = getFee();
    const discount = promoDiscount;
    return Math.max(0, sendAmount + fee - discount);
  };

  // Processing simulation
  useEffect(() => {
    if (step === 'processing') {
      setProcessingIndex(0);
      const timer1 = setTimeout(() => setProcessingIndex(1), 1200);
      const timer2 = setTimeout(() => setProcessingIndex(2), 2400);
      const timer3 = setTimeout(() => setProcessingIndex(3), 3600);
      const timer4 = setTimeout(() => {
        // Complete the transfer
        if (activeTx) {
          const finalTx = { ...activeTx, status: 'Delivered' as const };
          setActiveTx(finalTx);
          setStep('success');
          showToast('Transfer completed successfully!', 'success');
        }
      }, 4800);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [step]);

  // Actions
  const handleCountrySelect = (country: CountryInfo) => {
    setSelectedCountry(country);
    // Find matching default delivery method
    if (country.deliveryMethods && country.deliveryMethods.length > 0) {
      setDeliveryMethod(country.deliveryMethods[0] as any);
    }
    setStep('recipient');
  };

  const handleRecipientSelect = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setDeliveryMethod(recipient.deliveryMethod);
    setStep('amount');
  };

  const handleAmountContinue = () => {
    if (sendAmount < 10) {
      showToast('Minimum sending amount is $10.00 CAD.', 'error');
      return;
    }
    setStep('review');
  };

  const handleReviewContinue = () => {
    // Check if default payment method exists, or pick first
    const defaultPm = paymentMethods.find(p => p.isDefault) || paymentMethods[0];
    if (defaultPm) {
      setSelectedPaymentId(defaultPm.id);
    }
    setStep('payment');
  };

  const handlePayNowSubmit = () => {
    if (!selectedRecipient) return;
    
    // Validate balance if using wallet balance option
    const isPayingWithWallet = selectedPaymentId === 'wallet_payment';
    const totalToPay = getTotalCharge();

    if (isPayingWithWallet && walletBalance < totalToPay) {
      showToast('Insufficient wallet balance. Please add money or choose another card.', 'error');
      return;
    }

    // Deduct wallet if selected
    if (isPayingWithWallet) {
      onDeductWallet(totalToPay);
    }

    // Determine payment label
    let pmLabel = 'Visa Debit Card (•••• 4321)';
    if (isPayingWithWallet) {
      pmLabel = 'Maal Pay Wallet Balance';
    } else {
      const pm = paymentMethods.find(p => p.id === selectedPaymentId);
      if (pm) {
        pmLabel = pm.brand ? `${pm.brand} (•••• ${pm.last4})` : pm.provider;
      }
    }

    // Add transaction
    const newTxId = onAddTransaction({
      recipientId: selectedRecipient.id,
      recipientName: selectedRecipient.fullName,
      country: selectedRecipient.country,
      sendCurrency: 'CAD',
      receiveCurrency: selectedCountry.currency,
      sendAmount: sendAmount,
      receiveAmount: getReceiveAmount(),
      exchangeRate: getExchangeRate(),
      fee: getFee(),
      promoDiscount: promoDiscount,
      totalCharge: totalToPay,
      paymentMethod: pmLabel,
      deliveryMethod: deliveryMethod,
      status: 'Processing'
    });

    // Create live active transfer view state
    const createdTx: Transfer = {
      id: newTxId,
      userId: user.id,
      recipientId: selectedRecipient.id,
      recipientName: selectedRecipient.fullName,
      country: selectedRecipient.country,
      sendCurrency: 'CAD',
      receiveCurrency: selectedCountry.currency,
      sendAmount: sendAmount,
      receiveAmount: getReceiveAmount(),
      exchangeRate: getExchangeRate(),
      fee: getFee(),
      promoDiscount: promoDiscount,
      totalCharge: totalToPay,
      paymentMethod: pmLabel,
      deliveryMethod: deliveryMethod,
      status: 'Processing',
      transactionReference: `MS-${Math.floor(100000 + Math.random() * 900000)}-${selectedCountry.code}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setActiveTx(createdTx);
    setStep('processing');
  };

  const handleAddPaymentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showAddPaymentModal === 'card') {
      if (newCardNumber.length < 4) {
        showToast('Please enter a valid credit/debit card number.', 'error');
        return;
      }
      onAddPaymentMethod({
        type: 'card',
        provider: newCardBrand,
        brand: `${newCardBrand} Debit Card`,
        last4: newCardNumber.slice(-4),
        isDefault: false
      });
      showToast('Card added successfully!', 'success');
    } else if (showAddPaymentModal === 'bank') {
      if (!newBankName.trim() || newBankAccount.length < 4) {
        showToast('Please enter complete bank credentials.', 'error');
        return;
      }
      onAddPaymentMethod({
        type: 'bank',
        provider: newBankName,
        brand: `${newBankName} Chequing`,
        last4: newBankAccount.slice(-4),
        isDefault: false
      });
      showToast('Bank account linked successfully!', 'success');
    }
    // Reset
    setShowAddPaymentModal(null);
    setNewCardNumber('');
    setNewBankAccount('');
    setNewBankName('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Transaction ID copied!', 'success');
  };

  // Filter countries
  const filteredCountries = [...COUNTRIES].filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.currency.toLowerCase().includes(countrySearch.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Filter recipients matching selected country
  const filteredCountryRecipients = recipients.filter(r => 
    r.country.toLowerCase() === selectedCountry.name.toLowerCase()
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 relative select-none">
      
      {/* progress top bar (Visible in country, rec, am, rev checkout phases) */}
      {['country', 'recipient', 'amount', 'review', 'payment'].includes(step) && (
        <div className="bg-white border-b border-rose-35 gap-0.5 outline-none font-sans px-5 py-3 shadow-2xs flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => {
                if (step === 'country') {
                  onResetPrefilled();
                  onNavigateHome();
                }
                if (step === 'recipient') setStep('country');
                if (step === 'amount') setStep('recipient');
                if (step === 'review') setStep('amount');
                if (step === 'payment') setStep('review');
              }}
              className="text-xs font-bold text-slate-650 bg-slate-50 hover:bg-slate-100 p-1 px-2 rounded-lg transition"
            >
              ← Back
            </button>
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
              Send Remit Quote
            </span>
            <div className="w-10"></div>
          </div>

          {/* Stepper display indicators */}
          <div className="flex items-center justify-between px-2 pt-1 relative">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 -z-1"></div>
            
            {/* Step 1: Country */}
            <div className="flex flex-col items-center gap-1 z-1">
              <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                ['country', 'recipient', 'amount', 'review', 'payment'].includes(step) 
                  ? 'bg-blue-600 text-white shadow-sm font-black' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                1
              </div>
              <span className="text-[8px] font-bold text-slate-500">Destination</span>
            </div>

            {/* Step 2: Recipient */}
            <div className="flex flex-col items-center gap-1 z-1">
              <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                ['recipient', 'amount', 'review', 'payment'].includes(step) 
                  ? 'bg-blue-600 text-white shadow-sm font-black' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {['amount', 'review', 'payment'].includes(step) ? <Check className="w-3-h-3" /> : '2'}
              </div>
              <span className="text-[8px] font-bold text-slate-500">Recipient</span>
            </div>

            {/* Step 3: Amount */}
            <div className="flex flex-col items-center gap-1 z-1">
              <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                ['amount', 'review', 'payment'].includes(step) 
                  ? 'bg-blue-600 text-white shadow-sm font-black' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {['review', 'payment'].includes(step) ? <Check className="w-3 h-3" /> : '3'}
              </div>
              <span className="text-[8px] font-bold text-slate-500">Amount</span>
            </div>

            {/* Step 4: Review */}
            <div className="flex flex-col items-center gap-1 z-1">
              <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                ['review', 'payment'].includes(step) 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {['payment'].includes(step) ? <Check className="w-3 h-3" /> : '4'}
              </div>
              <span className="text-[8px] font-bold text-slate-500">Review</span>
            </div>
          </div>
        </div>
      )}


      <div className="flex-1 overflow-y-auto">
        
        {/* STEP 1: SELECT COUNTRY */}
        {step === 'country' && (
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-extrabold text-slate-800">Where are you sending to?</h2>
              <p className="text-[10px] text-slate-400">Select any partner country to load secure exchange values.</p>
            </div>

            {/* Search Country bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by country or currency..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-white border border-slate-150 rounded-xl text-xs font-semibold focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Conversion Quick Preview Card based on default value */}
            <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-blue-900 rounded-2xl p-4 text-white shadow-lg space-y-3 relative">
              <div className="absolute right-3 top-3 opacity-15">
                <Zap className="w-16 h-16 text-blue-400 inline-block animate-pulse" />
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                <span className="text-[9px] font-black text-blue-200 uppercase tracking-widest">Rate Calculator Preview</span>
                <span className="text-[8px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">Best Rates</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-white/60 font-semibold uppercase">You Send</span>
                  <div className="flex items-center text-sm font-black">
                    🇨🇦 $1,000 <span className="text-[10px] text-white/70 ml-1 font-bold">CAD</span>
                  </div>
                </div>

                <div className="space-y-0.5 text-right">
                  <span className="text-[9px] text-white/60 font-semibold uppercase">Destination gets</span>
                  <div className="flex items-center justify-end text-sm font-black text-emerald-400">
                    {selectedCountry.flag} {(1000 * selectedCountry.rate).toLocaleString('en-US', { maximumFractionDigits: 0 })} <span className="text-[10px] ml-1 font-bold">{selectedCountry.currency}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-[9px] text-white/50 text-center font-medium italic pt-1.5 border-t border-white/5">
                1.00 CAD = {selectedCountry.rate.toFixed(2)} {selectedCountry.currency} ({selectedCountry.name}) • $0 Fee on $1,000+ CAD
              </p>
            </div>

            {/* Country flags listings */}
            <div className="space-y-4">
              {countrySearch.trim() === '' ? (
                <>
                  {/* Top Corridors Grid */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Popular Destinations</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[...COUNTRIES].filter(c => c.isTop).sort((a, b) => a.name.localeCompare(b.name)).map((con) => (
                        <div
                          key={con.code}
                          onClick={() => handleCountrySelect(con)}
                          className={`p-3 bg-white border rounded-2xl cursor-pointer hover:border-blue-250 hover:shadow-xs transition flex flex-col justify-between h-24 ${
                            selectedCountry.code === con.code ? 'border-blue-500 ring-1 ring-blue-500/20 bg-blue-50/5' : 'border-slate-100'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-2xl shadow-inner block">{con.flag}</span>
                            <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md font-extrabold uppercase">
                              {con.currency}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800 truncate">{con.name}</h4>
                            <p className="text-[9px] font-bold text-blue-600 mt-0.5">
                              1 CAD = {con.rate.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rest of the Global Destinations List */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">More Destinations ({COUNTRIES.length - COUNTRIES.filter(c => c.isTop).length})</span>
                    <div className="space-y-2">
                      {[...COUNTRIES].filter(c => !c.isTop).sort((a, b) => a.name.localeCompare(b.name)).map((con) => (
                        <div
                          key={con.code}
                          onClick={() => handleCountrySelect(con)}
                          className={`bg-white border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-blue-200 hover:shadow-xs transition ${
                            selectedCountry.code === con.code ? 'border-blue-500 ring-1 ring-blue-500/20 bg-blue-50/5' : 'border-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl shadow-inner block">{con.flag}</span>
                            <div>
                              <h4 className="text-xs font-black text-slate-800 leading-tight">{con.name}</h4>
                              <p className="text-[10px] text-slate-450 mt-0.5 font-semibold">Local Currency: <span className="font-bold text-slate-650">{con.currency}</span></p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[11px] font-black text-blue-600">
                              1 CAD = {con.rate.toFixed(2)} {con.currency}
                            </div>
                            <span className="text-[8px] text-slate-400 font-semibold leading-none">Global Network Active</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Search Results */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Search Results ({filteredCountries.length})</span>
                    {filteredCountries.length > 0 ? (
                      <div className="space-y-2">
                        {filteredCountries.map((con) => (
                          <div
                            key={con.code}
                            onClick={() => handleCountrySelect(con)}
                            className={`bg-white border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-blue-200 hover:shadow-xs transition ${
                              selectedCountry.code === con.code ? 'border-blue-500 ring-1 ring-blue-500/20 bg-blue-50/5' : 'border-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl shadow-inner block">{con.flag}</span>
                              <div>
                                <h4 className="text-xs font-black text-slate-800 leading-tight">{con.name}</h4>
                                <p className="text-[10px] text-slate-450 mt-0.5 font-semibold">Local Currency: <span className="font-bold text-slate-650">{con.currency}</span></p>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-[11px] font-black text-blue-600">
                                1 CAD = {con.rate.toFixed(2)} {con.currency}
                              </div>
                              <span className="text-[8px] text-slate-400 font-semibold leading-none">Instant deposit available</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400">
                        <p className="text-xs font-semibold">No countries found for "{countrySearch}"</p>
                        <button
                          onClick={() => setCountrySearch('')}
                          className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                        >
                          Clear Search
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT RECIPIENT */}
        {step === 'recipient' && (
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-slate-800">
                {isAddingRecipient ? 'Add Recipient' : 'Select Recipient'} in {selectedCountry.name}
              </h2>
              <p className="text-[10px] text-slate-400">
                {isAddingRecipient 
                  ? `Enter beneficiary details to send money directly to ${selectedCountry.name}.`
                  : `Choose an existing recipient or create a new one to receive ${selectedCountry.currency}.`
                }
              </p>
            </div>

            {/* Country Banner */}
            <div className="bg-white border border-slate-100 p-3 rounded-2xl flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCountry.flag}</span>
                <span className="text-xs font-black text-slate-800">{selectedCountry.name}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep('country');
                  setIsAddingRecipient(false);
                }}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Change Country
              </button>
            </div>

            {isAddingRecipient ? (
              <form onSubmit={handleInlineAddRecipientSubmit} className="space-y-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    <span className="text-xs font-black text-slate-800">New Beneficiary Details</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingRecipient(false)}
                    className="text-[10px] text-slate-450 hover:text-slate-700 hover:bg-slate-50 px-2 py-1 rounded-lg font-bold border border-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* Full Legal Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Recipient Full Legal Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={newRecFullName}
                      onChange={(e) => setNewRecFullName(e.target.value)}
                      className="w-full p-2.5 pr-8 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none"
                    />
                    {newRecFullName && (
                      <button
                        type="button"
                        onClick={() => setNewRecFullName('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-650 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer"
                        title="Clear"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Preferred Delivery Method */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Preferred Delivery Method</label>
                  <div className="flex gap-2">
                    {(selectedCountry.deliveryMethods && selectedCountry.deliveryMethods.length > 0
                      ? selectedCountry.deliveryMethods
                      : ['Bank Transfer', 'Mobile Wallet', 'Cash Pickup']
                    ).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => {
                          setNewRecDeliveryMethod(method as any);
                          setNewRecBankName('');
                        }}
                        className={`flex-1 py-2 px-1 text-[10px] rounded-xl border font-black transition cursor-pointer ${
                          newRecDeliveryMethod === method
                            ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic bank/provider fields */}
                {newRecDeliveryMethod === 'Bank Transfer' ? (
                  <div className="space-y-3 bg-slate-50/40 p-3.5 rounded-2xl border border-slate-100/80">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-550 block">Bank Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          required={newRecDeliveryMethod === 'Bank Transfer'}
                          placeholder={PARTNER_PROVIDERS[selectedCountry.name]?.['Bank Transfer'] 
                            ? `e.g. ${PARTNER_PROVIDERS[selectedCountry.name]['Bank Transfer'].slice(0, 3).join(', ')}`
                            : "e.g. HDFC Bank, Metrobank"
                          }
                          value={newRecBankName}
                          onChange={(e) => setNewRecBankName(e.target.value)}
                          className="w-full p-2.5 pr-8 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                        {newRecBankName && (
                          <button
                            type="button"
                            onClick={() => setNewRecBankName('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-650 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer"
                            title="Clear"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      {/* Bank Suggestions */}
                      {(() => {
                        const countryBanks = PARTNER_PROVIDERS[selectedCountry.name]?.['Bank Transfer'] || [];
                        if (countryBanks.length === 0) return null;
                        const matches = newRecBankName.trim()
                          ? countryBanks.filter(b => b.toLowerCase().includes(newRecBankName.toLowerCase()))
                          : countryBanks;
                        return (
                          <div className="mt-1.5 space-y-1">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                              Popular Local Banks
                            </span>
                            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                              {matches.slice(0, 5).map(bank => {
                                const isSelected = newRecBankName.toLowerCase() === bank.toLowerCase();
                                return (
                                  <button
                                    key={bank}
                                    type="button"
                                    onClick={() => setNewRecBankName(bank)}
                                    className={`text-[9.5px] font-extrabold px-2 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-205'
                                    }`}
                                  >
                                    {getProviderLogo(bank, { className: 'w-4 h-4', isSelected })}
                                    <span>{bank}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="space-y-1 block">
                      <label className="text-[10px] font-bold text-slate-550 block">Account Number or IBAN</label>
                      <div className="relative">
                        <input
                          type="text"
                          required={newRecDeliveryMethod === 'Bank Transfer'}
                          placeholder={`e.g. ${getCountryPlaceholder(selectedCountry.code).account}`}
                          value={newRecAccountNumber}
                          onChange={(e) => setNewRecAccountNumber(e.target.value)}
                          className="w-full p-2.5 pr-8 bg-white rounded-xl border border-slate-200 text-xs font-mono font-medium focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                        {newRecAccountNumber && (
                          <button
                            type="button"
                            onClick={() => setNewRecAccountNumber('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-650 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer"
                            title="Clear"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-slate-50/40 p-3.5 rounded-2xl border border-slate-100/80">
                    <div className="space-y-1 block">
                      <label className="text-[10px] font-bold text-slate-550 block">
                        {newRecDeliveryMethod === 'Mobile Wallet' ? 'Mobile Wallet Provider' : 'Cash Pickup Provider'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder={PARTNER_PROVIDERS[selectedCountry.name]?.[newRecDeliveryMethod] 
                            ? `e.g. ${PARTNER_PROVIDERS[selectedCountry.name][newRecDeliveryMethod].slice(0, 3).join(', ')}`
                            : "e.g. Paytm, GCash, M-Pesa"
                          }
                          value={newRecBankName}
                          onChange={(e) => setNewRecBankName(e.target.value)}
                          className="w-full p-2.5 pr-8 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                        {newRecBankName && (
                          <button
                            type="button"
                            onClick={() => setNewRecBankName('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-650 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer"
                            title="Clear"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Wallet/Agent Suggestions */}
                      {(() => {
                        const countryProviders = PARTNER_PROVIDERS[selectedCountry.name]?.[newRecDeliveryMethod] || [];
                        if (countryProviders.length === 0) return null;
                        const matches = newRecBankName.trim()
                          ? countryProviders.filter(p => p.toLowerCase().includes(newRecBankName.toLowerCase()))
                          : countryProviders;
                        return (
                          <div className="mt-1.5 space-y-1 block">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">
                              Popular Local Providers
                            </span>
                            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                              {matches.slice(0, 5).map(prov => {
                                const isSelected = newRecBankName.toLowerCase() === prov.toLowerCase();
                                return (
                                  <button
                                    key={prov}
                                    type="button"
                                    onClick={() => setNewRecBankName(prov)}
                                    className={`text-[9.5px] font-extrabold px-2 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                        : 'bg-white hover:bg-slate-150 text-slate-705 border-slate-200/80 hover:border-slate-300'
                                    }`}
                                  >
                                    {getProviderLogo(prov, { className: 'w-4 h-4', isSelected })}
                                    <span>{prov}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="space-y-1 block">
                      <label className="text-[10px] font-bold text-slate-550 block">Phone Number (with country code)</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required={newRecDeliveryMethod !== 'Bank Transfer'}
                          placeholder={`e.g. ${getCountryPlaceholder(selectedCountry.code).phone}`}
                          value={newRecPhoneNumber}
                          onChange={(e) => setNewRecPhoneNumber(e.target.value)}
                          className="w-full p-2.5 pr-8 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                        {newRecPhoneNumber && (
                          <button
                            type="button"
                            onClick={() => setNewRecPhoneNumber('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-650 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer"
                            title="Clear"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/10 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Continue</span>
                </button>
              </form>
            ) : (
              <>
                {/* Screen selection buttons or list of matches */}
                {filteredCountryRecipients.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xs text-center flex flex-col items-center justify-center space-y-3.5">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-pulse">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 text-center">
                      <h4 className="text-xs font-black text-slate-700">No beneficiaries saved for {selectedCountry.name}</h4>
                      <p className="text-[10px] text-slate-400 max-w-sm leading-tight leading-normal">
                        You need to add a secure recipient in {selectedCountry.name} to direct your wallet funds or pay-in clearings.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingRecipient(true);
                        if (selectedCountry.deliveryMethods && selectedCountry.deliveryMethods.length > 0) {
                          setNewRecDeliveryMethod(selectedCountry.deliveryMethods[0] as any);
                        } else {
                          setNewRecDeliveryMethod('Bank Transfer');
                        }
                        setNewRecFullName('');
                        setNewRecBankName('');
                        setNewRecAccountNumber('');
                        setNewRecPhoneNumber('');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Recipient</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                        Saved Receivers ({filteredCountryRecipients.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingRecipient(true);
                          if (selectedCountry.deliveryMethods && selectedCountry.deliveryMethods.length > 0) {
                            setNewRecDeliveryMethod(selectedCountry.deliveryMethods[0] as any);
                          } else {
                            setNewRecDeliveryMethod('Bank Transfer');
                          }
                          setNewRecFullName('');
                          setNewRecBankName('');
                          setNewRecAccountNumber('');
                          setNewRecPhoneNumber('');
                        }}
                        className="text-xs font-black text-blue-605 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Recipient</span>
                      </button>
                    </div>

                    {filteredCountryRecipients.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => handleRecipientSelect(rec)}
                        className="bg-white border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer hover:border-blue-200 hover:shadow-xs transition group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-105 text-xs font-bold flex items-center justify-center border border-slate-150">
                            {rec.fullName.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-800 leading-tight group-hover:text-blue-600 transition">{rec.fullName}</h4>
                            <p className="text-[9px] text-slate-400 font-semibold leading-normal mt-0.5">
                              {rec.deliveryMethod} ({rec.currency})
                            </p>
                          </div>
                        </div>
                        
                        <button className="p-1 px-2 text-[10px] bg-blue-550/10 text-blue-600 rounded-md font-black">
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* STEP 3: ENTER AMOUNT */}
        {step === 'amount' && selectedRecipient && (
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-slate-800">Enter Transfer Amount</h2>
              <p className="text-[10px] text-slate-455">How much money are you looking to send?</p>
            </div>

            {/* Recipient summary block */}
            <div className="bg-white rounded-2xl p-3 border border-slate-100 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCountry.flag}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-none">{selectedRecipient.fullName}</h4>
                  <p className="text-[9px] text-slate-400 font-semibold mt-1">
                    Route: {deliveryMethod} ({selectedCountry.currency})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStep('recipient')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>

            {/* Inputs & Rate formulas */}
            <div className="space-y-3">
              {/* You Send (CAD) Input */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs relative">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">You Send (CAD)</label>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      min="10"
                      value={sendAmountText}
                      onChange={(e) => {
                        let val = e.target.value;
                        // Forbid negative numbers or signs
                        val = val.replace(/[-+eE]/g, '');
                        setSendAmountText(val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      placeholder="0.00"
                      className="text-2xl font-black text-slate-900 border-none outline-none w-32 focus:ring-0 bg-transparent p-0"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-full border border-slate-200">
                    <span className="text-sm">🇨🇦</span>
                    <span className="text-xs font-extrabold text-slate-700">CAD</span>
                  </div>
                </div>
                {sendAmountText !== '' && sendAmount < 10 && (
                  <p className="text-[10px] text-rose-600 font-extrabold mt-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                    <span>Minimum transfer amount is $10.00 CAD</span>
                  </p>
                )}
              </div>

              {/* Conversion Factor Visual link */}
              <div className="flex items-center justify-between px-3 text-slate-400">
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  <span>Exchange Rate: </span>
                  <span className={`font-bold ${selectedCountry.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    1.00 CAD = {getExchangeRate().toFixed(2)} {selectedCountry.currency}
                  </span>
                  <span className={`text-[8.5px] font-black px-1.5 py-0.2 rounded-sm ${selectedCountry.trend === 'up' ? 'bg-emerald-55 text-emerald-700' : 'bg-rose-55 text-rose-700'}`}>
                    {selectedCountry.trend === 'up' ? '▲' : '▼'}{selectedCountry.trendPercent}
                  </span>
                </div>
                <div className="h-4 border-l border-slate-200/80"></div>
                <span className="text-[9px] font-semibold text-slate-400">Locked Rate for 15m</span>
              </div>

              {/* They Receive (Target Currency) Input */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative shadow-inner">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">They Receive</label>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xl font-black text-emerald-600 tracking-tight">
                    {getReceiveAmount().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center gap-2 bg-white py-1.5 px-3 rounded-full border border-slate-150">
                    <span className="text-sm">{selectedCountry.flag}</span>
                    <span className="text-xs font-black text-slate-750 uppercase">{selectedCountry.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code & Fee Calculation Box */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3">
              {/* Promo Code field */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. GLOBESAVE"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-grow p-3 bg-slate-100/60 rounded-xl border border-slate-150 text-xs font-black focus:ring-1 focus:ring-blue-600 uppercase outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center"
                  >
                    Apply
                  </button>
                </div>
                {promoDiscount > 0 && (
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                    <Sparkles className="w-3.5 h-3.5" /> Promo Code Active: Saves $5.00 CAD
                  </p>
                )}
              </div>

              {/* Fee and Totals summary line items */}
              <div className="border-t border-slate-100/60 pt-3 space-y-2 text-xs font-semibold text-slate-650">
                <div className="flex justify-between">
                  <span>Transfer Fee</span>
                  <span>
                    {getFee() === 0 ? (
                      <span className="text-emerald-600 font-extrabold">Free (0.00 CAD)</span>
                    ) : (
                      `$${getFee().toFixed(2)} CAD`
                    )}
                  </span>
                </div>

                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo Discount</span>
                    <span>-$5.00 CAD</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-slate-100/80 pt-2 text-slate-900 font-black">
                  <span>Total Charges</span>
                  <span>${getTotalCharge().toFixed(2)} CAD</span>
                </div>
              </div>
            </div>

            {/* Delivery Methods Options */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Select Delivery Location & Mode</span>
              <div className="flex gap-2">
                {selectedCountry.deliveryMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setDeliveryMethod(method)}
                    className={`flex-1 py-3 px-1 border rounded-xl text-xs font-black transition flex flex-col items-center gap-1 ${
                      deliveryMethod === method
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {method === 'Bank Transfer' ? <Landmark className="w-4 h-4" /> : method === 'Mobile Wallet' ? <Smartphone className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                    <span>{method}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Continue */}
            <button
              onClick={handleAmountContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4.5 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Continue Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 4: REVIEW TRANSFER */}
        {step === 'review' && selectedRecipient && (
          <div className="p-4 space-y-4">
            <h2 className="text-sm font-black text-slate-800">Review Transfer Ledger</h2>
            
            {/* Recipient Details Card */}
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100/80">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">
                  {selectedRecipient.fullName.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 leading-none">{selectedRecipient.fullName}</h4>
                  <p className="text-[10px] text-slate-450 mt-1">{selectedRecipient.country} ({selectedCountry.currency})</p>
                </div>
              </div>

              {/* Delivery info */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">DELIVERY CHANNEL</span>
                  <span className="font-bold text-slate-700">{deliveryMethod}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block">METHOD DESTINATION</span>
                  <span className="font-bold text-slate-700 font-mono truncate max-w-[150px] block">
                    {deliveryMethod === 'Bank Transfer' 
                      ? `${selectedRecipient.bankName}: ••••${selectedRecipient.accountNumber?.slice(-4) || 'Account'}`
                      : `${selectedRecipient.bankName || 'GCash'}: ${selectedRecipient.phoneNumber || '+1'}`
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Calculations review card */}
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">You Send</span>
                <span className="font-extrabold text-slate-800">${sendAmount.toFixed(2)} CAD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Exchange Rate</span>
                <div className="text-right flex items-center gap-1.5 justify-end">
                  <span className={`text-[9.5px] font-bold flex items-center gap-0.5 ${selectedCountry.trend === 'up' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedCountry.trend === 'up' ? '▲' : '▼'}{selectedCountry.trendPercent}
                  </span>
                  <span className="font-extrabold text-slate-800 font-mono">
                    1 CAD = {getExchangeRate().toFixed(2)} {selectedCountry.currency}
                  </span>
                </div>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">They Receive</span>
                <span className="font-black text-emerald-600 text-sm">
                  {selectedCountry.flag} {getReceiveAmount().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedCountry.currency}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-bold">Transfer Fee</span>
                <span>{getFee() === 0 ? <span className="text-emerald-600 font-extrabold">Free ($0.00)</span> : `$${getFee().toFixed(2)} CAD`}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between py-1 text-emerald-600 border-b border-slate-50">
                  <span className="font-bold">Promo Discount (GLOBESAVE)</span>
                  <span className="font-extrabold">-$5.00 CAD</span>
                </div>
              )}
              <div className="flex justify-between py-1.5 text-slate-900 font-black border-t border-slate-100 pt-3">
                <span className="text-sm">Total Sandbox Amount</span>
                <span className="text-sm">${getTotalCharge().toFixed(2)} CAD</span>
              </div>
            </div>

            {/* Quick alert bar */}
            <div className="bg-blue-50/50 border border-blue-105 rounded-xl p-3 flex gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-[10px] text-slate-500 leading-normal">
                You are proceeding under sandbox regulatory monitoring. No real financial debit occurs. Click payment to clear.
              </p>
            </div>

            {/* Continue to payment */}
            <button
              onClick={handleReviewContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4.5 rounded-2xl shadow-sm transition cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 5: SELECT PAYMENT METHODS */}
        {step === 'payment' && (
          <div className="p-4 space-y-4">
            <h2 className="text-sm font-black text-slate-800">Select Payment Source</h2>

            {/* CAD Wallet balance payment option */}
            <div
              onClick={() => setSelectedPaymentId('wallet_payment')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedPaymentId === 'wallet_payment'
                  ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-100 bg-white shadow-2xs hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">Maal Pay Balance</h4>
                  <p className="text-[10px] text-slate-450 font-semibold">Available: ${walletBalance.toFixed(2)} CAD</p>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedPaymentId === 'wallet_payment' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-350 bg-white'
              }`}>
                {selectedPaymentId === 'wallet_payment' && <Check className="w-3 h-3 text-white stroke-[3px]" />}
              </div>
            </div>

            {/* Custom Payment list */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Linked Cards & Banks</span>
              
              {paymentMethods.map((pm) => (
                <div
                  key={pm.id}
                  onClick={() => setSelectedPaymentId(pm.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer hover:border-slate-300 transition-all flex items-center justify-between ${
                    selectedPaymentId === pm.id
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getProviderLogo(pm.provider, { className: 'w-9 h-9', isSelected: selectedPaymentId === pm.id })}
                    <div>
                      <h4 className="text-xs font-black text-slate-800 capitalize leading-tight">
                        {pm.provider} {pm.type === 'card' ? 'Debit/Credit' : pm.type === 'wallet' ? 'Wallet' : 'Clearing bank'}
                      </h4>
                      {pm.last4 && (
                        <p className="text-[9px] text-slate-400 font-mono font-medium">•••• •••• •••• {pm.last4}</p>
                      )}
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedPaymentId === pm.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {selectedPaymentId === pm.id && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowAddPaymentModal('card')}
                className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-center text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-blue-650" />
                <span>Add Visa/Debit</span>
              </button>
              <button
                onClick={() => setShowAddPaymentModal('bank')}
                className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-center text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-blue-650" />
                <span>Link Chequing</span>
              </button>
            </div>

            {/* Dynamic Checkout Bottom Line */}
            <div className="border-t border-slate-200/60 pt-4 text-center space-y-3">
              <div className="text-xs font-black text-slate-800">
                Total Amount To Pay: <span className="text-blue-600">${getTotalCharge().toFixed(2)} CAD</span>
              </div>
              <button
                onClick={handlePayNowSubmit}
                disabled={!selectedPaymentId}
                className={`w-full text-white font-extrabold text-sm py-4.5 rounded-2xl shadow-sm transition flex items-center justify-center gap-1.5 ${
                  selectedPaymentId 
                    ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md cursor-pointer' 
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <span>Authorize & Pay Now</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: SENDING / PROCESSING LOGS (TIMELINE COMPLETED PROGRESSIVELY) */}
        {step === 'processing' && activeTx && (
          <div className="p-6 flex flex-col items-center justify-start h-full space-y-6 pt-12 text-center bg-white">
            {/* Spinning glowing rising arrow representing the transaction loading */}
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-black text-slate-900 leading-tight">Your Money is on its Way!</h2>
              <p className="text-[11px] text-slate-450 max-w-sm mx-auto">
                Clearing payments securely in sandbox sandbox...
              </p>
            </div>

            {/* Sequential progress step timeline */}
            <div className="w-full max-w-xs space-y-4 text-left border-l border-slate-200 pl-5 relative self-center py-2.5">
              {stages.map((stage, idx) => {
                const isActive = processingIndex === idx;
                const isDone = processingIndex > idx;
                const isPending = processingIndex < idx;

                return (
                  <div key={idx} className="relative">
                    {/* Circle Dot inside the timeline */}
                    <span className={`absolute -left-8.5 top-1 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
                      isDone 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : isActive 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'bg-white border-slate-250'
                    }`}></span>

                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-black transition-all ${
                        isDone ? 'text-emerald-600' : isActive ? 'text-blue-600 animate-pulse' : 'text-slate-400'
                      }`}>
                        {stage.title}
                      </h4>
                      <p className={`text-[10px] leading-normal font-medium ${
                        isDone || isActive ? 'text-slate-500' : 'text-slate-350'
                      }`}>
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[9px] text-slate-400 max-w-xs leading-normal">
              Complying with standard SEC/FinCEN remittances criteria. Sandbox ledger completes status automatically in a few seconds.
            </p>
          </div>
        )}

        {/* STEP 7: SUCCESS SUMMARY PREVIEW */}
        {step === 'success' && activeTx && (
          <div className="p-6 flex flex-col items-center justify-between h-full bg-slate-50">
            <div className="space-y-4 text-center mt-6 w-full">
              {/* Success badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-bounce">
                <Check className="w-8 h-8 stroke-[3.5px]" />
              </div>
              
              <div className="space-y-0.5">
                <h2 className="text-xl font-black text-slate-900 leading-tight">Transfer Completed</h2>
                <p className="text-xs text-slate-400 font-bold">Successfully credited to the beneficiary ledger!</p>
              </div>

              {/* Box Info */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4 max-w-sm mx-auto text-left">
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] text-slate-400 font-bold">RECIPIENT NAME</span>
                  <span className="text-xs font-black text-slate-800">{activeTx.recipientName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] text-slate-400 font-bold">DESTINATION COUNTRY</span>
                  <span className="text-xs font-black text-slate-800">{selectedCountry.flag} {activeTx.country}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] text-slate-400 font-bold">AMOUNT SENT</span>
                  <span className="text-xs font-black text-slate-800">${activeTx.sendAmount.toFixed(2)} CAD</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] text-slate-400 font-bold">BENEFICIARY RECEIVED</span>
                  <span className="text-xs font-black text-emerald-600">
                    +{activeTx.receiveAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} {activeTx.receiveCurrency}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-[10px] text-slate-400 font-bold">TRANSACTION REFERENCE</span>
                  <span className="text-xs font-black text-slate-800 font-mono select-all flex items-center gap-1 bg-slate-50 px-1 rounded">
                    {activeTx.transactionReference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] text-slate-400 font-bold">PAYOR METHOD</span>
                  <span className="text-xs font-bold text-slate-650 truncate max-w-[150px]">{activeTx.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Succes check bottom buttons */}
            <div className="w-full space-y-2 mt-6">
              <button
                onClick={() => setStep('tracking')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Live Tracking Detail</span>
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onResetPrefilled();
                  onNavigateHome();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-4 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: TRANSFER TRACKING SCREEN */}
        {step === 'tracking' && activeTx && (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center bg-white border border-slate-100 p-3.5 rounded-2xl shadow-2xs">
              <div>
                <span className="text-[9px] text-slate-400 font-bold">TRANSACTION ID</span>
                <span className="text-xs font-black text-slate-800 font-mono block select-all">
                  {activeTx.transactionReference}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(activeTx.transactionReference)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-black rounded-lg transition flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Reference</span>
              </button>
            </div>

            {/* Tracking Realtime status indicator */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-2xs space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase">Live Delivery Timeline</h3>
              
              <div className="border-l-2 border-emerald-500 pl-4 space-y-5 relative py-1.5">
                {/* Point 1 */}
                <div className="relative">
                  <span className="absolute -left-6.5 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-800">Payment Secured</h4>
                    <p className="text-[9px] text-slate-400">Paid from {activeTx.paymentMethod}</p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="relative">
                  <span className="absolute -left-6.5 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-800">Liquidity Clearings Checked</h4>
                    <p className="text-[9px] text-slate-400">Sandbox KYC/OFAC monitoring complete</p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="relative">
                  <span className="absolute -left-6.5 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-800">Remitted securely</h4>
                    <p className="text-[9px] text-slate-400">Routing instructions finalized to foreign FX Partner</p>
                  </div>
                </div>

                {/* Point 4 */}
                <div className="relative">
                  <span className="absolute -left-6.5 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></span>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-emerald-600">Fund Delivered Successfully!</h4>
                    <p className="text-[9px] text-slate-450 mt-0.5">Beneficiary account successfully credited in full.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient summary details in tracking page */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3.5 text-xs font-semibold">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none pb-2 border-b border-slate-50">
                Billing & Transfer Overview
              </h3>

              <div className="flex justify-between">
                <span className="text-slate-400">Sender Country</span>
                <span className="font-bold text-slate-750">Canada</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination</span>
                <span className="font-bold text-slate-750">{selectedCountry.flag} {activeTx.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Beneficiary</span>
                <span className="font-bold text-slate-750">{activeTx.recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery Route</span>
                <span className="font-bold text-slate-750">{deliveryMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total charge</span>
                <span className="font-extrabold text-slate-900">${activeTx.totalCharge.toFixed(2)} CAD</span>
              </div>
            </div>

            {/* Actions for receipts */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setStep('receipt')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4 rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>View Full Receipt Invoice</span>
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onResetPrefilled();
                  onNavigateHome();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-4 rounded-xl border border-slate-200 transition cursor-pointer text-center block"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* STEP 9: RECEIPT INVOICE SCREEN */}
        {step === 'receipt' && activeTx && (
          <div className="p-4 space-y-4">
            <div className="bg-white border-x border-slate-200/60 p-6 pt-10 pb-8 shadow-md relative select-none overflow-visible mx-0.5 mt-2">
              {/* Jagged / Toothed top edge */}
              <div className="absolute left-0 right-0 h-2 flex overflow-hidden z-20" style={{ top: '-8px' }}>
                {Array.from({ length: 48 }).map((_, i) => (
                  <svg key={i} className="w-3 h-2 text-white fill-current flex-shrink-0" viewBox="0 0 12 8" preserveAspectRatio="none" style={{ transform: 'rotate(180deg)', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.03))' }}>
                    <polygon points="0,0 6,6 12,0 12,8 0,8" />
                  </svg>
                ))}
              </div>

              {/* Jagged / Toothed bottom edge */}
              <div className="absolute left-0 right-0 h-2 flex overflow-hidden z-20" style={{ bottom: '-8px' }}>
                {Array.from({ length: 48 }).map((_, i) => (
                  <svg key={i} className="w-3 h-2 text-white fill-current flex-shrink-0" viewBox="0 0 12 8" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 -1px 1px rgba(0,0,0,0.03))' }}>
                    <polygon points="0,0 6,6 12,0 12,8 0,8" />
                  </svg>
                ))}
              </div>

              {/* Left feed roller notch punch cutout */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-50 border border-slate-200/50 shadow-[inset_-2px_0_3px_rgba(0,0,0,0.04)] z-20" />
              {/* Right feed roller notch punch cutout */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-50 border border-slate-200/50 shadow-[inset_2px_0_3px_rgba(0,0,0,0.04)] z-20" />

              {/* Left margin line guides for printer alignment */}
              <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-slate-100 uppercase pointer-events-none" />

              {/* Receipt stamp lookalike to make it feel super realistic */}
              <div className="absolute right-3 top-3 border-2 border-emerald-500/30 text-emerald-500/50 text-[10px] font-black tracking-widest p-1 px-2.5 rounded-md rotate-12 select-none uppercase">
                PAID SECURE
              </div>

              <div className="text-center space-y-1.5 border-b border-dashed border-slate-200 pb-4.5">
                <div className="flex items-center justify-center gap-1 text-slate-900 text-lg font-extrabold">
                  <span>Maal<span className="text-emerald-500">Receipt</span></span>
                </div>
                <h4 className="text-[11px] bg-slate-100 text-slate-500 rounded-full py-1 px-3 inline-block font-extrabold uppercase tracking-wide font-mono">
                  REF: {activeTx.transactionReference}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium">{new Date(activeTx.createdAt).toLocaleString()}</p>
              </div>

              <div className="py-4 space-y-3.5 text-xs font-semibold text-slate-650">
                <div className="flex justify-between">
                  <span className="text-slate-455 font-bold">Remitted Amount</span>
                  <span className="font-black text-slate-850">${activeTx.sendAmount.toFixed(2)} CAD</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-455 font-bold">Exchange Rate value</span>
                  <span className="font-mono text-slate-800">1.00 CAD = {getExchangeRate().toFixed(2)} {selectedCountry.currency}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-455 font-bold">Target conversion gets</span>
                  <span className="font-black text-slate-850">{activeTx.receiveAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {activeTx.receiveCurrency}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-455 font-bold">Transfer channel fee</span>
                  <span>{activeTx.fee === 0 ? <span className="text-emerald-600 font-black">Free (0.00 CAD)</span> : `$${activeTx.fee.toFixed(2)} CAD`}</span>
                </div>

                {activeTx.promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="font-bold">Promo Subtract code</span>
                    <span className="font-black">-$5.00 CAD</span>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3 flex justify-between text-slate-900 font-black">
                  <span>Total final paid CAD</span>
                  <span className="text-sm">${activeTx.totalCharge.toFixed(2)} CAD</span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-3.5 space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-bold">Beneficiary Receiver</span>
                    <span className="font-bold text-slate-800">{activeTx.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-450 font-bold">Country destination</span>
                    <span className="font-bold text-slate-855">{selectedCountry.flag} {activeTx.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-455 font-bold">Selected settlement</span>
                    <span className="font-bold text-slate-855">{deliveryMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-455 font-bold">Checkout payment</span>
                    <span className="font-bold text-slate-800 truncate max-w-[170px]">{activeTx.paymentMethod}</span>
                  </div>
                </div>
              </div>

              {/* Thermal Barcode */}
              <div className="flex flex-col items-center justify-center pt-5 pb-3.5 border-t border-dashed border-slate-200 mt-2 space-y-1.5">
                <div className="flex items-stretch h-7 gap-[2px] opacity-80" aria-hidden="true">
                  {[1, 2.5, 4, 1.5, 3, 1, 2.5, 1, 4, 2, 1.5, 3.5, 2, 1, 1, 4, 1.5, 2.5, 3, 1.5, 4].map((width, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/90"
                      style={{ width: `${width}px` }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400">*{activeTx.transactionReference}*</span>
              </div>

              {/* Secure guarantee bottom */}
              <div className="border-t border-slate-100 pt-3 text-center text-[10px] text-slate-400 font-medium">
                Protected by 256-bit automated encryption. Thank you for using Maal Pay Sandbox Remittance.
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => showToast('PDF Receipt download triggered (sandbox)', 'success')}
                  className="p-3.5 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-xl text-xs font-black text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download receipt</span>
                </button>
                <button
                  onClick={() => showToast('Native sharing menu triggered (sandbox)', 'info')}
                  className="p-3.5 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-xl text-xs font-black text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Share receipt</span>
                </button>
              </div>

              <button
                onClick={() => {
                  onResetPrefilled();
                  onNavigateHome();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-4 rounded-xl border border-slate-200 text-center block"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add payment modals overlay */}
      {showAddPaymentModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-3 border-transparent z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl p-6 space-y-4 w-full max-w-md mx-auto animate-slide-up">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-slate-900 border-none">
                {showAddPaymentModal === 'card' ? 'Add Visa or Debit Card' : 'Link Bank Chequing Account'}
              </h3>
              <button
                onClick={() => setShowAddPaymentModal(null)}
                className="text-slate-400 font-bold bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPaymentFormSubmit} className="space-y-4 text-xs font-semibold">
              {showAddPaymentModal === 'card' ? (
                /* Card Input forms */
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCardBrand('Visa')}
                      className={`py-2 border rounded-xl text-center font-bold ${
                        newCardBrand === 'Visa' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500'
                      }`}
                    >
                      Visa Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCardBrand('Mastercard')}
                      className={`py-2 border rounded-xl text-center font-bold ${
                        newCardBrand === 'Mastercard' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500'
                      }`}
                    >
                      Mastercard Card
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450">Cardholder Name (Legal)</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Johnson"
                      defaultValue={user.fullName}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450">Card Number (16-Digit mock)</label>
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4321 0000 0000 1122"
                      value={newCardNumber}
                      onChange={(e) => setNewCardNumber(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-450">CVV Security Pin</label>
                      <input
                        type="password"
                        required
                        placeholder="•••"
                        maxLength={3}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Bank Account Input Forms */
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450">Select Partner Institution</label>
                    <select
                      value={newBankName}
                      onChange={(e) => setNewBankName(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none cursor-pointer"
                    >
                      <option value="">-- Choose Institution Key --</option>
                      <option value="RBC">Royal Bank of Canada (RBC)</option>
                      <option value="TD">TD Canada Trust</option>
                      <option value="Scotiabank">Scotiabank Bank</option>
                      <option value="BMO">Bank of Montreal (BMO)</option>
                      <option value="CIBC">CIBC Bank Ontario</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450">Transit & Block Number</label>
                    <input
                      type="text"
                      required
                      placeholder="5-digit Transit (e.g. 10293)"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-450">Account Number (Chequing)</label>
                    <input
                      type="text"
                      required
                      placeholder="Account Number (e.g. 73819203)"
                      value={newBankAccount}
                      onChange={(e) => setNewBankAccount(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none"
                    />
                  </div>
                </div>
              )}

              <p className="text-[9px] text-slate-400 mt-1 leading-tight text-center">
                Payment sources are cleared via sandbox secure gateway instantly. No real charges are processed.
              </p>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(null)}
                  className="py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold transition shadow-xs"
                >
                  Confirm Sandbox Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
