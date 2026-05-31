/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, UserPlus, Shield, UserCheck, Plus, Check, MapPin, Building, PhoneCall, Gift, Heart, ArrowLeft } from 'lucide-react';
import { Recipient } from '../types';
import { COUNTRIES } from '../data/mockData';
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

interface RecipientsScreensProps {
  recipients: Recipient[];
  initialActiveTab?: 'saved' | 'new';
  onSelectRecipient: (recipient: Recipient) => void;
  onAddRecipient: (recipient: Omit<Recipient, 'id' | 'userId' | 'createdAt'>) => void;
  onBack: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function RecipientsScreens({
  recipients,
  initialActiveTab = 'saved',
  onSelectRecipient,
  onAddRecipient,
  onBack,
  showToast
}: RecipientsScreensProps) {
  const [activeTab, setActiveTab] = useState<'saved' | 'new'>(initialActiveTab);
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Form Fields for Add New Recipient
  const [fullName, setFullName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default India
  const [deliveryMethod, setDeliveryMethod] = useState<'Bank Transfer' | 'Mobile Wallet' | 'Cash Pickup'>('Bank Transfer');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('Family Support');
  const [purpose, setPurpose] = useState('Family Support');

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const freshCountry = COUNTRIES.find(c => c.name === e.target.value);
    if (freshCountry) {
      setSelectedCountry(freshCountry);
      // Auto assign first valid delivery method
      if (freshCountry.deliveryMethods && freshCountry.deliveryMethods.length > 0) {
        setDeliveryMethod(freshCountry.deliveryMethods[0] as any);
      } else {
        setDeliveryMethod('Bank Transfer');
      }
    }
  };

  const getCountryFlagAndCurrency = (countryName: string) => {
    const found = COUNTRIES.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    return {
      flag: found ? found.flag : '🌐',
      currency: found ? found.currency : 'CAD'
    };
  };

  const handleSaveRecipientSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      showToast('Please enter full recipient name.', 'error');
      return;
    }

    if (deliveryMethod === 'Bank Transfer') {
      if (!bankName.trim()) {
        showToast('Please enter their bank name.', 'error');
        return;
      }
      if (!accountNumber.trim()) {
        showToast('Please enter their bank account number.', 'error');
        return;
      }
    } else {
      if (!phoneNumber.trim()) {
        showToast('Please enter their phone/wallet number.', 'error');
        return;
      }
    }

    // Save
    onAddRecipient({
      fullName: fullName.trim(),
      country: selectedCountry.name,
      currency: selectedCountry.currency,
      deliveryMethod,
      bankName: deliveryMethod === 'Bank Transfer' ? bankName.trim() : undefined,
      accountNumber: deliveryMethod === 'Bank Transfer' ? accountNumber.trim() : undefined,
      phoneNumber: deliveryMethod !== 'Bank Transfer' ? phoneNumber.trim() : undefined,
      relationship,
      purpose
    });

    // Reset Form
    setFullName('');
    setBankName('');
    setAccountNumber('');
    setPhoneNumber('');
    setRelationship('Family Support');
    setPurpose('Family Support');
    
    // Switch to list
    setActiveTab('saved');
  };

  // Filter Saved Recipients
  const filteredRecipients = recipients.filter(rec => {
    const query = searchQuery.toLowerCase();
    return (
      rec.fullName.toLowerCase().includes(query) ||
      rec.country.toLowerCase().includes(query) ||
      rec.deliveryMethod.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 relative select-none">
      {/* Premium Header */}
      <div className="bg-white border-b border-slate-100 flex-shrink-0 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-700 transition shadow-3xs cursor-pointer font-bold"
            >
              ←
            </button>
            <div className="space-y-0.5">
              <span className="font-black text-slate-900 text-sm tracking-tight block">Recipient Directory</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Send & Manage Beneficiaries</span>
            </div>
          </div>
        </div>

        {/* Premium Capsule Segmented Control */}
        <div className="bg-slate-100/80 p-1 rounded-2xl flex max-w-sm mx-auto border border-slate-200/35">
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 text-[10px] font-black rounded-xl transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Saved ({recipients.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 text-[10px] font-black rounded-xl transition duration-200 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'new'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Recipient</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        
        {/* SAVED RECIPIENTS TAB */}
        {activeTab === 'saved' && (
          <div className="p-4 space-y-4">
            {/* Search inputs */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, country or method..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-blue-650 outline-none"
              />
            </div>

            {/* List */}
            {filteredRecipients.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center space-y-2">
                <Search className="w-8 h-8 text-slate-300" />
                <h4 className="text-xs font-black text-slate-700">No saved recipients found</h4>
                <p className="text-[10px] text-slate-400 max-w-[200px] leading-tight">
                  No matches for "{searchQuery}". Try searching or add a new beneficiary.
                </p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-2 text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                >
                  Create Recipient
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                  Click a recipient to start sending money immediately
                </p>

                {filteredRecipients.map((rec) => {
                  const conInfo = getCountryFlagAndCurrency(rec.country);
                  return (
                    <div
                      key={rec.id}
                      onClick={() => onSelectRecipient(rec)}
                      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:border-blue-150 hover:shadow-sm transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center font-black text-blue-600 text-xs shadow-inner relative">
                          {rec.fullName.split(' ').slice(0, 2).map(n => n[0]).join('')}
                          <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full p-0.5 border border-slate-100 flex items-center justify-center">
                            {conInfo.flag}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-slate-800 leading-tight group-hover:text-blue-600 transition">
                            {rec.fullName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-semibold leading-normal">
                            {rec.country} • {rec.deliveryMethod} ({rec.currency})
                          </span>
                          
                          {/* Account Summary */}
                          <p className="text-[9px] text-slate-500 font-semibold italic truncate max-w-[180px]">
                            {rec.deliveryMethod === 'Bank Transfer' 
                              ? `${rec.bankName}: ••••${rec.accountNumber?.slice(-4) || rec.accountNumber}`
                              : `Wallet: ${rec.phoneNumber || 'Default phone'}`
                            }
                          </p>
                        </div>
                      </div>

                      <div className="p-2 rounded-full bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ADD RECIPIENT FORM TAB */}
        {activeTab === 'new' && (
          <form onSubmit={handleSaveRecipientSubmit} className="p-5 space-y-4">
            <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-4 flex gap-3 text-slate-800">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black">Authorized Beneficiary Entry</h4>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Beneficiary identity checks are done automatically to secure funds transfer against standard financial regulation guidelines.
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Recipient Full Legal Name</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Country Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Destination Country</label>
              <div className="relative">
                <select
                  value={selectedCountry.name}
                  onChange={handleCountryChange}
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none cursor-pointer"
                >
                  {[...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)).map((cty) => (
                    <option key={cty.code} value={cty.name}>
                      {cty.flag} {cty.name} ({cty.currency})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Preferred Delivery Route/Method</label>
              <div className="flex gap-2">
                {selectedCountry.deliveryMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setDeliveryMethod(method as any)}
                    className={`flex-1 py-3 px-2 rounded-xl border text-xs font-black transition ${
                      deliveryMethod === method
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* BANK ACCOUNT FIELDS (CONDITIONAL) */}
            {deliveryMethod === 'Bank Transfer' ? (
              <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Beneficiary Bank Ledger</span>
                </h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Bank Name</label>
                  <input
                    type="text"
                    required={deliveryMethod === 'Bank Transfer'}
                    placeholder={PARTNER_PROVIDERS[selectedCountry.name]?.['Bank Transfer'] 
                      ? `e.g. ${PARTNER_PROVIDERS[selectedCountry.name]['Bank Transfer'].slice(0, 3).join(', ')}`
                      : "e.g. HDFC Bank, Metrobank"
                    }
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                  {/* Smart Search & Suggestions for Bank Transfer */}
                  {(() => {
                    const countryBanks = PARTNER_PROVIDERS[selectedCountry.name]?.['Bank Transfer'] || [];
                    if (countryBanks.length === 0) return null;
                    const matches = bankName.trim() 
                      ? countryBanks.filter(b => b.toLowerCase().includes(bankName.toLowerCase()))
                      : countryBanks;
                    return (
                      <div className="mt-1.5 space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                          {selectedCountry.flag} Popular local banks ({matches.length})
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pb-0.5">
                          {matches.map(bank => {
                            const isSelected = bankName.toLowerCase() === bank.toLowerCase();
                            return (
                              <button
                                key={bank}
                                type="button"
                                onClick={() => setBankName(bank)}
                                className={`text-[10px] font-bold px-2 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                    : 'bg-white hover:bg-slate-150 text-slate-705 border-slate-200/80 hover:border-slate-300'
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

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Account Number or IBAN</label>
                  <input
                    type="text"
                    required={deliveryMethod === 'Bank Transfer'}
                    placeholder={`e.g. ${getCountryPlaceholder(selectedCountry.code).account}`}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono font-medium focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>
            ) : (
              /* MOBILE WALLET FIELDS (CONDITIONAL) */
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                  <span>Beneficiary Wallet Endpoint</span>
                </h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">
                    {deliveryMethod === 'Mobile Wallet' ? 'Mobile Wallet Provider' : 'Cash Pickup Provider'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={PARTNER_PROVIDERS[selectedCountry.name]?.[deliveryMethod]
                      ? `e.g. ${PARTNER_PROVIDERS[selectedCountry.name][deliveryMethod].slice(0, 3).join(', ')}`
                      : "e.g. Mobile Wallet Provider"
                    }
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                  {/* Smart Search & Suggestions for Mobile/Cash Providers */}
                  {(() => {
                    const countryProviders = PARTNER_PROVIDERS[selectedCountry.name]?.[deliveryMethod] || [];
                    if (countryProviders.length === 0) return null;
                    const matches = bankName.trim() 
                      ? countryProviders.filter(p => p.toLowerCase().includes(bankName.toLowerCase()))
                      : countryProviders;
                    return (
                      <div className="mt-1.5 space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                          {selectedCountry.flag} Popular local {deliveryMethod === 'Mobile Wallet' ? 'wallets' : 'agents'} ({matches.length})
                        </span>
                        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pb-0.5">
                          {matches.map(prov => {
                            const isSelected = bankName.toLowerCase() === prov.toLowerCase();
                            return (
                              <button
                                key={prov}
                                type="button"
                                onClick={() => setBankName(prov)}
                                className={`text-[10px] font-bold px-2 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
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

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500">Phone Number (with country code)</label>
                  <input
                    type="tel"
                    required={deliveryMethod !== 'Bank Transfer'}
                    placeholder={`e.g. ${getCountryPlaceholder(selectedCountry.code).phone}`}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Other Metadata */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 leading-none">Relationship</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none"
                >
                  <option>Brother</option>
                  <option>Sister</option>
                  <option>Father</option>
                  <option>Mother</option>
                  <option>Cousin</option>
                  <option>Uncle/Aunt</option>
                  <option>Friend</option>
                  <option>Business Partner</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 leading-none">Purpose of Transfer</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none"
                >
                  <option>Family Support</option>
                  <option>Savings & Investments</option>
                  <option>Medical Treatment</option>
                  <option>Educational Tuition</option>
                  <option>Gift/Allowance</option>
                  <option>Business Purchase</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs py-4 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-4 rounded-xl shadow-xs hover:shadow-md transition cursor-pointer"
              >
                Save Recipient
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
