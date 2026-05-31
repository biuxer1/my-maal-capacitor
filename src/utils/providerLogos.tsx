import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  isSelected?: boolean;
}

// Live Provider Logo Component that resolves official Clearbit Logo CDN or falls back on error.
const ProviderLogoComponent: React.FC<{ name: string; className: string; isSelected: boolean }> = ({ name, className, isSelected }) => {
  const [hasError, setHasError] = useState(false);
  const normalized = name.toLowerCase().trim();

  // --- Standard Premium Brand Interceptors ---
  if (normalized === 'visa' || normalized.includes('visa')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-xl bg-[#0F1C3F] border border-[#2B3B66] p-1 overflow-hidden ${className}`}>
        <svg viewBox="0 0 60 22" className="w-full h-full object-contain">
          <text x="30" y="17" fontSize="16" fontWeight="950" fontStyle="italic" fill="#FFF" textAnchor="middle" fontFamily="'Inter', system-ui, -apple-system, sans-serif">
            VISA
          </text>
          <path d="M 10 5 L 15 5 L 13 9 Z" fill="#FFC72C" />
        </svg>
      </div>
    );
  }

  if (normalized === 'mastercard' || normalized.includes('mastercard')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-xl bg-[#111827] border border-gray-800 p-1 overflow-hidden ${className}`}>
        <svg viewBox="0 0 60 36" className="w-full h-full object-contain">
          <circle cx="22" cy="18" r="10" fill="#EB001B" />
          <circle cx="38" cy="18" r="10" fill="#F79E1B" opacity="0.9" />
          <path d="M 30 10 A 10 10 0 0 0 30 26 A 10 10 0 0 0 30 10 Z" fill="#FF5F00" />
        </svg>
      </div>
    );
  }

  if (normalized === 'apple pay' || normalized.includes('apple pay') || normalized === 'applepay') {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-xl bg-black border border-gray-800 px-1 py-0.5 overflow-hidden ${className}`}>
        <div className="flex items-center justify-center gap-0.5 scale-90">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
            <path d="M18.71,19.5C17.88,20.74,17,21.95,15.66,22c-1.31,0-1.72-.8-3.22-.8s-2,.78-3.25.82C7.89,22,6.9,20.72,6.06,19.5c-1.72-2.49-3-7-1.28-10c.85-1.47,2.37-2.4,4-2.43,1.27,0,2.46.88,3.24.88s2.21-.88,3.72-.72A4.89,4.89,0,0,1,19.64,9.8C16.48,11.72,17.2,16,20,17.25C19.45,18.66,18.71,19.5,18.71,19.5M15.91,4.17a4.67,4.67,0,0,0,1.08-3.17,4.91,4.91,0,0,0-3.2,1.64,4.45,4.45,0,0,0-1.12,3.17A4.27,4.27,0,0,0,15.91,4.17Z" />
          </svg>
          <span className="text-white font-[950] tracking-tighter uppercase text-[9px] font-sans">Pay</span>
        </div>
      </div>
    );
  }

  if (normalized === 'google pay' || normalized === 'gpay' || normalized.includes('google pay') || normalized.includes('gpay')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-xl bg-[#FFFFFF] border border-gray-200 px-1 py-0.5 overflow-hidden ${className}`}>
        <div className="flex items-center justify-center gap-0.5 scale-90">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0">
            <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28-0.96,2.37-2.04,3.1l3.18,2.46c1.86-1.71,2.93-4.24,2.93-7.23C21.46,11.83,21.42,11.45,21.35,11.1z" fill="#4285F4" />
            <path d="M12,20.6c2.59,0,4.77-0.86,6.36-2.33l-3.18-2.46c-0.88,0.59-2,0.95-3.18,0.95c-2.45,0-4.52-1.65-5.26-3.88H3.45l-3.11,2.4C1.92,16.51,6.58,20.6,12,20.6z" fill="#34A853" />
            <path d="M6.74,12.87c-0.19-0.56-0.3-1.16-0.3-1.77s0.11-1.21,0.3-1.77V6.93H3.45c-0.64,1.28-1,2.72-1,4.27s0.36,3,1,4.27L6.74,12.87z" fill="#FBBC05" />
            <path d="M12,6.24c1.41,0,2.68,0.48,3.68,1.44l2.76-2.76C16.77,3.31,14.59,2.5,12,2.5C6.58,2.5,1.92,6.59,0.34,11.42l3.11,2.4C4.19,11.59,6.26,9.94,12,6.24z" fill="#EA4335" />
          </svg>
          <span className="text-[#5F6368] font-[950] tracking-tighter uppercase text-[9px] font-sans">Pay</span>
        </div>
      </div>
    );
  }

  if (normalized === 'rbc' || normalized === 'royal bank of canada' || normalized.includes('rbc') || normalized.includes('royal bank of canada')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-xl bg-[#0051A3] border border-[#1E6BCE] p-1 overflow-hidden ${className}`}>
        <div className="flex flex-col items-center justify-center leading-none text-center">
          <svg viewBox="0 0 24 16" className="w-5 h-3 flex-shrink-0 fill-yellow-400">
            <path d="M12,2 L17,6 L12,10 L7,6 Z" />
            <circle cx="12" cy="6" r="1.5" className="fill-blue-600" />
          </svg>
          <span className="text-[#FFFFFF] font-[950] tracking-widest text-[8px] font-sans">RBC</span>
        </div>
      </div>
    );
  }

  // Mapping of popular target names in mock database to clear real-world domains
  const domainMapping: Record<string, string> = {
    'state bank of india': 'sbi.co.in',
    'sbi': 'sbi.co.in',
    'hdfc bank': 'hdfcbank.com',
    'hdfc': 'hdfcbank.com',
    'icici bank': 'icicibank.com',
    'icici': 'icicibank.com',
    'axis bank': 'axisbank.com',
    'axis': 'axisbank.com',
    'punjab national bank': 'pnbindia.in',
    'pnb': 'pnbindia.in',
    'kotak mahindra': 'kotak.com',
    'kotak': 'kotak.com',
    'bdo unibank': 'bdo.com.ph',
    'bdo': 'bdo.com.ph',
    'bpi bank': 'bpi.com.ph',
    'bpi': 'bpi.com.ph',
    'metrobank': 'metrobank.com.ph',
    'land bank': 'landbank.com',
    'security bank': 'securitybank.com',
    'unionbank': 'unionbankph.com',
    'habib bank limited': 'hbl.com',
    'habib': 'hbl.com',
    'hbl': 'hbl.com',
    'national bank (nbp)': 'nbp.com.pk',
    'nbp': 'nbp.com.pk',
    'mcb bank': 'mcb.com.pk',
    'allied bank': 'abl.com',
    'meezan bank': 'meezanbank.com',
    'meezan': 'meezanbank.com',
    'sonali bank': 'sonalibank.com.bd',
    'islami bank': 'islamibankbd.com',
    'dutch-bangla bank': 'dutchbanglabank.com',
    'brac bank': 'bracbank.com',
    'brac': 'bracbank.com',
    'eastern bank/card': 'ebl.com.bd',
    'nabil bank': 'nabilbank.com',
    'nepal investment bank': 'nimb.com.np',
    'global ime bank': 'globalimebank.com',
    'nepal bank': 'nepalbank.com.np',
    'rastriya banijya bank': 'rbb.com.np',
    'access bank': 'accessbankplc.com',
    'access': 'accessbankplc.com',
    'gtbank': 'gtbank.com',
    'zenith bank': 'zenithbank.com',
    'zenith': 'zenithbank.com',
    'uba bank': 'ubagroup.com',
    'uba': 'ubagroup.com',
    'first bank': 'firstbanknigeria.com',
    'stanbic ibtc': 'stanbicibtcbank.com',
    'gcb bank': 'gcbbank.com.gh',
    'ecobank ghana': 'ecobank.com',
    'ecobank': 'ecobank.com',
    'absa bank': 'absa.africa',
    'absa': 'absa.africa',
    'stanbic bank': 'stanbicbank.com.gh',
    'fidelity bank': 'fidelitybank.com.gh',
    'premier bank': 'premierbank.so',
    'dahabshiil bank': 'dahabshiil.com',
    'dahabshiil': 'dahabshiil.com',
    'salaam somali bank': 'salaamsomalibank.com',
    'ibs bank': 'ibsbank.so',
    'kcb bank': 'kcbgroup.com',
    'kcb': 'kcbgroup.com',
    'equity bank': 'equitybank.co.ke',
    'equity': 'equitybank.co.ke',
    'co-operative bank': 'co-opbank.co.ke',
    'standard chartered': 'sc.com',
    'ncba bank': 'ncbagroup.com',
    'commercial bank of ethiopia': 'combanketh.et',
    'cbe': 'combanketh.et',
    'awash bank': 'awashbank.com',
    'dashen bank': 'dashenbanksc.com',
    'bank of abyssinia': 'bankofabyssinia.com',
    'visa': 'visa.com',
    'mastercard': 'mastercard.com',
    'apple pay': 'apple.com',
    'royal bank of canada': 'rbcroyalbank.com',
    'rbc': 'rbcroyalbank.com',
    'td canada trust': 'td.com',
    'td': 'td.com',
    'scotiabank': 'scotiabank.com',
    'bmo': 'bmo.com',
    'cibc': 'cibc.com',
    
    // Wallets & Payments
    'paytm': 'paytm.com',
    'phonepe': 'phonepe.com',
    'google pay': 'google.com',
    'gpay': 'google.com',
    'bhim upi': 'bhimupi.org.in',
    'mobikwik': 'mobikwik.com',
    'gcash': 'gcash.com',
    'maya': 'maya.ph',
    'coins.ph': 'coins.ph',
    'grabpay': 'grab.com',
    'shopeepay': 'shopee.com',
    'easypaisa': 'easypaisa.com.pk',
    'jazzcash': 'jazzcash.com.pk',
    'nayapay': 'nayapay.com',
    'sadapay': 'sadapay.pk',
    'ubl omni': 'unitedbank.com.pk',
    'bkash': 'bkash.com',
    'nagad': 'nagad.com.bd',
    'rocket': 'dutchbanglabank.com',
    'upay': 'upaybd.com',
    'mcash': 'mcb.com.pk',
    'esewa': 'esewa.com.np',
    'khalti': 'khalti.com',
    'ime pay': 'imepay.com.np',
    'prabhu pay': 'prabhupay.com',
    'opay': 'opayweb.com',
    'palmpay': 'palmpay.com',
    'paga': 'paga.com',
    'mtn momo': 'mtn.com',
    'mtn': 'mtn.com',
    'airtel money': 'airtel.in',
    'airtel': 'airtel.in',
    'telebirr': 'ethiotelecom.et',
    'cbe birr': 'combanketh.et',
    'hello cash': 'belcash.com',
    'shabelle bank': 'shabellebank.com',
    't-kash': 'telkom.co.ke',
    'equity cash': 'equitybank.co.ke',
    'muthoot finance': 'muthootfinance.com',
    'manappuram finance': 'manappuram.com',
    'western union': 'westernunion.com',
    'wu': 'westernunion.com',
    'moneygram': 'moneygram.com',
    'cebuana lhuillier': 'cebuanalhuillier.com',
    'palawan express': 'palawanpawnshop.com',
    'mlhuillier': 'mlhuillier.com',
    'lbc express': 'lbcexpress.com',
    'al ansari exchange': 'alansariexchange.com',
    'ria money transfer': 'riamoneytransfer.com',
    'ria': 'riamoneytransfer.com',
    'placid express': 'placidexpress.com',
    'ime transfer': 'imeservice.com',
    'prabhu money': 'prabhumoneytransfer.com',
    'small world': 'smallworldfs.com',
    'unitylink': 'unitylink.com',
    'express funds': 'expressfunds.com',
    'amal express': 'amal-express.com',
    'tawakal express': 'tawakalexpress.com',
    'postbank kenya': 'postbank.co.ke'
  };

  // Find exact or substring domain match
  let domain: string | null = null;
  if (domainMapping[normalized]) {
    domain = domainMapping[normalized];
  } else {
    for (const [key, value] of Object.entries(domainMapping)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        domain = value;
        break;
      }
    }
  }

  // If a domain was successfully loaded and hasn't errored out yet
  if (domain && !hasError) {
    return (
      <div className={`flex-shrink-0 relative flex items-center justify-center rounded-full bg-slate-50 border border-slate-100/80 overflow-hidden ${className}`}>
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={name}
          className="w-full h-full object-contain p-0.5"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // --- Beautiful Fallbacks if domain is missing or Clearbit logo failed to load ---
  // 1. STATE BANK OF INDIA (SBI)
  if (normalized.includes('state bank of india') || normalized === 'sbi') {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-full bg-[#00bfff] text-white font-black overflow-hidden relative ${className}`}>
        <div className="absolute inset-0.5 rounded-full border border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#00bfff]"></div>
      </div>
    );
  }

  // 2. HDFC BANK
  if (normalized.includes('hdfc')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-sm bg-[#1c3f94] text-white font-extrabold text-[7px] tracking-tight ${className}`}>
        <span>HDFC</span>
      </div>
    );
  }

  // 3. ICICI BANK
  if (normalized.includes('icici')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-full bg-[#f37021] text-white font-black text-[9px] ${className}`}>
        <span className="text-[#002e6e]">i</span>
      </div>
    );
  }

  // 4. AXIS BANK
  if (normalized.includes('axis')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-sm bg-[#aa184c] text-white font-black text-[9px] ${className}`}>
        <span className="scale-x-110">A</span>
      </div>
    );
  }

  // 5. GCASH
  if (normalized.includes('gcash')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-full bg-[#0047ba] text-white font-black text-[10px] relative ${className}`}>
        <span className="font-sans italic">g</span>
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-sky-400 rounded-full border border-blue-600"></span>
      </div>
    );
  }

  // 6. PAYTM
  if (normalized.includes('paytm')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-md bg-[#00baf2] text-white font-extrabold text-[8px] p-0.5 ${className}`}>
        <span className="text-[#002e6e]">Pay</span>
      </div>
    );
  }

  // 7. PHONEPE
  if (normalized.includes('phonepe')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-full bg-[#5f259f] text-white font-bold text-[8px] ${className}`}>
        <span>Pe</span>
      </div>
    );
  }

  // 9. M-PESA
  if (normalized.includes('m-pesa') || normalized.includes('mpesa')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-full bg-[#4cb748] text-white font-extrabold text-[9px] relative ${className}`}>
        <span className="text-white">m</span>
        <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#e41b23] rounded-full"></span>
      </div>
    );
  }

  // 10. BKASH
  if (normalized.includes('bkash')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-full bg-[#e2136e] text-white font-black text-[9px] ${className}`}>
        <span>bK</span>
      </div>
    );
  }

  // 11. WESTERN UNION
  if (normalized.includes('western union') || normalized.includes('wu')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-md bg-[#ffcc00] text-black font-black text-[8px] border border-black/10 ${className}`}>
        <span>WU</span>
      </div>
    );
  }

  // 12. MONEYGRAM
  if (normalized.includes('moneygram')) {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-full bg-[#e11b22] text-white font-black text-[7px] relative overflow-hidden ${className}`}>
        <span className="z-10">MG</span>
        <div className="absolute inset-y-0 right-0 w-1/2 bg-white/20 -skew-x-12"></div>
      </div>
    );
  }

  // 13. RIA
  if (normalized.includes('ria money') || normalized === 'ria') {
    return (
      <div className={`flex-shrink-0 flex items-center justify-center rounded-md bg-[#ff6600] text-white font-black text-[8px] italic ${className}`}>
        <span>ria</span>
      </div>
    );
  }

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const bgClasses = [
    'bg-gradient-to-br from-indigo-500 to-blue-600',
    'bg-gradient-to-br from-emerald-500 to-teal-600',
    'bg-gradient-to-br from-purple-500 to-pink-600',
    'bg-gradient-to-br from-sky-500 to-cyan-600',
    'bg-gradient-to-br from-amber-500 to-orange-600',
    'bg-gradient-to-br from-rose-500 to-red-600'
  ];
  const selectedBg = bgClasses[hash % bgClasses.length];

  return (
    <div className={`flex-shrink-0 flex items-center justify-center rounded-full ${isSelected ? 'bg-white text-blue-600' : `${selectedBg} text-white`} font-bold text-[9px] shadow-2xs border border-white/10 ${className}`}>
      <span>{initials || 'BK'}</span>
    </div>
  );
};

export const getProviderLogo = (name: string, { className = 'w-4 h-4', isSelected = false }: LogoProps = {}): React.ReactNode => {
  return <ProviderLogoComponent name={name} className={className} isSelected={isSelected} />;
};
