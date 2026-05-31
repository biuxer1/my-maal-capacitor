/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bell, ArrowRight, ShieldCheck, Plus, TrendingUp, Gift, Users, Send, Wallet, History, ChevronRight, X, Copy, Mail, Sparkles, Check, Loader2 } from 'lucide-react';
import { User, Transfer, Recipient, CountryInfo } from '../types';
import { COUNTRIES } from '../data/mockData';
import { translate } from '../translations';

interface DashboardScreenProps {
  user: User;
  walletBalance: number;
  transfers: Transfer[];
  recipients: Recipient[];
  unreadNotificationsCount: number;
  onNavigate: (screen: any) => void;
  onOpenAddMoney: () => void;
  onStartSendMoneyFlow: (prefilledRecipient?: Recipient, prefilledCountry?: CountryInfo) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onUpdateWalletBalance?: (newBalance: number | ((prev: number) => number)) => void;
  language?: string;
  initialOpenReferral?: boolean;
}

export function DashboardScreen({
  user,
  walletBalance,
  transfers,
  recipients,
  unreadNotificationsCount,
  onNavigate,
  onOpenAddMoney,
  onStartSendMoneyFlow,
  showToast,
  onUpdateWalletBalance,
  language = 'English',
  initialOpenReferral = false
}: DashboardScreenProps) {
  const [selectedRateCountry, setSelectedRateCountry] = useState<CountryInfo>(COUNTRIES[0]); // India default
  const [showHeader, setShowHeader] = useState(true);

  // --- REFERRAL MODAL SUB SYSTEM ---
  const [showReferralModal, setShowReferralModal] = useState(initialOpenReferral);

  useEffect(() => {
    if (initialOpenReferral) {
      setShowReferralModal(true);
    }
  }, [initialOpenReferral]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<Array<{ email: string; status: 'Pending' | 'Completed' }>>(() => {
    const saved = localStorage.getItem('gs_invited_friends');
    if (saved) return JSON.parse(saved);
    return [
      { email: 'sam_rogers@example.com', status: 'Completed' },
      { email: 'jenny_k@gmail.com', status: 'Pending' }
    ];
  });
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [hasClaimedCode, setHasClaimedCode] = useState(() => {
    return localStorage.getItem('gs_has_claimed_referral_code') === 'true';
  });

  const saveInvitedFriends = (list: Array<{ email: string; status: 'Pending' | 'Completed' }>) => {
    setInvitedFriends(list);
    localStorage.setItem('gs_invited_friends', JSON.stringify(list));
  };
  
  // Get recent 3 transfers
  const recentTransfers = [...transfers]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const getCountryFlagAndCurrency = (countryName: string) => {
    const found = COUNTRIES.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    return {
      flag: found ? found.flag : '🌐',
      currency: found ? found.currency : 'USD'
    };
  };

  const getStatusColor = (status: Transfer['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Money Sent':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-100 border';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-slate-50 relative select-none w-full"
      dir={language === 'Arabic' ? 'rtl' : 'ltr'}
    >
      {/* Upper Dashboard Header representing the premium Fintech style */}
      {showHeader ? (
        <div className="bg-gradient-to-b from-blue-700 to-blue-600 text-white rounded-b-[2.5rem] px-6 pt-5 pb-8 shadow-md">
          {/* Profile and Logo Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div 
                onClick={() => onNavigate('profile-settings')}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-black text-sm border border-white/20 shadow-xs cursor-pointer text-white overflow-hidden"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  user.fullName.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div>
                <p className="text-[10px] text-blue-100/80 font-medium">{translate('welcomeBack', language)}</p>
                <h3 className="text-xs font-bold text-white line-clamp-1">{user.fullName}</h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Notification Bell */}
              <button
                onClick={() => onNavigate('notifications-screen')}
                className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer"
              >
                <Bell className="w-4 h-4 text-white" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 rounded-full text-[9px] font-black flex items-center justify-center border-2 border-blue-600 text-white shadow-sm">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Close Button to hide the Upper Dashboard Header */}
              <button
                onClick={() => setShowHeader(false)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition cursor-pointer flex items-center justify-center text-white"
                title="Hide Header"
                id="close-header-button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CAD Wallet Card */}
          <div className="bg-white text-slate-800 rounded-2xl p-5 border border-slate-100 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 bg-blue-50/40 w-32 h-32 rounded-full translate-x-12 -translate-y-12"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
                  <Wallet className="w-3.5 h-3.5 text-blue-600" />
                  <span>{translate('walletBalance', language)}</span>
                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide">
                    Demo Wallet
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-bold text-slate-500">CAD</span>
                </h2>
                {/* Secondary Conversion Preview */}
                <p className={`text-[10.5px] font-bold mt-1 transition-colors duration-250 ${
                  selectedRateCountry.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  ≈ {(walletBalance * selectedRateCountry.rate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {selectedRateCountry.currency}
                  <span className="text-[8px] ml-1 font-black">
                    ({selectedRateCountry.trend === 'up' ? '▲' : '▼'} {selectedRateCountry.trendPercent})
                  </span>
                </p>
              </div>

              {/* Quick Add Funds click */}
              <button
                onClick={onOpenAddMoney}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-3 py-2 rounded-xl shadow-xs hover:shadow-md transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{translate('topUp', language)}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-5 py-3 flex justify-between items-center shadow-md select-none transition-all flex-shrink-0 animate-fade-in">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-blue-100" />
            <span className="text-xs font-bold [text-shadow:0_1px_1px_rgba(0,0,0,0.1)]">
              {translate('walletBalance', language)}: ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD
            </span>
          </div>
          <button
            onClick={() => setShowHeader(true)}
            className="text-[10px] font-black bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg transition cursor-pointer uppercase tracking-wider"
          >
            {language === 'Arabic' ? 'توسيع العرض' : 'Expand View'}
          </button>
        </div>
      )}

      {/* Main Stats Scrollable Sandbox */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Quick Transfer Slider */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-[11px] font-black text-slate-855 tracking-tight uppercase">{translate('quickSend', language)}</h3>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{translate('selectCountryRemit', language)}</p>
            </div>
            <button 
              onClick={() => onNavigate('recipients-list')}
              className="text-[10px] font-black text-blue-600 hover:underline cursor-pointer"
            >
              {translate('viewAll', language)}
            </button>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-1.5 scrollbar-none">
            {/* "Add New" item */}
            <button
              onClick={() => onStartSendMoneyFlow()}
              className="flex flex-col items-center justify-center text-center flex-shrink-0 cursor-pointer group focus:outline-none"
            >
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 group-hover:border-blue-500 bg-slate-50/55 group-hover:bg-blue-50/50 flex items-center justify-center transition mb-1 shadow-xs">
                <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" />
              </div>
              <span className="text-[9px] font-black text-slate-500 group-hover:text-blue-600 transition truncate max-w-[64px]">
                {language === 'Arabic' ? 'جديد' : 'New Send'}
              </span>
            </button>
            
            {/* Recipients List */}
            {recipients.map((rec, idx) => {
              const { flag } = getCountryFlagAndCurrency(rec.country);
              const initials = rec.fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
              
              const firstName = rec.fullName.split(' ')[0];
              
              // Dynamic pleasant pastel colors based on index
              const colors = [
                'bg-blue-50 text-blue-700 border-blue-105',
                'bg-emerald-50 text-emerald-700 border-emerald-105',
                'bg-purple-50 text-purple-700 border-purple-105',
                'bg-amber-50 text-amber-700 border-amber-105',
                'bg-rose-50 text-rose-700 border-rose-105',
              ];
              const colorClass = colors[idx % colors.length];

              return (
                <button
                  key={rec.id}
                  onClick={() => onStartSendMoneyFlow(rec)}
                  className="flex flex-col items-center justify-center text-center flex-shrink-0 cursor-pointer group focus:outline-none"
                >
                  <div className="relative mb-1">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-xs font-black shadow-xs group-hover:scale-105 transition transform duration-150 ${colorClass}`}>
                      {initials}
                    </div>
                    {/* Small nested country flag badge */}
                    <span className="absolute -bottom-1 -right-1 text-xs bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-xs border border-slate-100">
                      {flag}
                    </span>
                  </div>
                  <span className="text-[9px] font-black text-slate-700 group-hover:text-slate-900 transition truncate max-w-[64px]">
                    {firstName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Rates & Conversion Calculator Mini card */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[11px] font-extrabold text-slate-850">{translate('liveExchangeRates', language)}</h3>
            </div>
            <span className="text-[9px] bg-emerald-55 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse flex items-center gap-1 text-[8px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 inline-block animate-ping"></span> Live
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Quick Country Selector inside rate card */}
            <div className="flex flex-col justify-between border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50/80 rounded-2xl p-3 transition duration-150 relative">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{translate('selectCountryRemit', language)}</span>
              <div className="relative mt-2 flex items-center gap-1.5">
                <select
                  value={selectedRateCountry.code}
                  onChange={(e) => {
                    const country = COUNTRIES.find(c => c.code === e.target.value);
                    if (country) setSelectedRateCountry(country);
                  }}
                  className="w-full text-xs font-black text-slate-800 bg-transparent pr-6 border-none py-1 focus:outline-none cursor-pointer appearance-none z-10"
                >
                  {[...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                    <option key={c.code} value={c.code}>
                      {c.flag}   {c.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-1 pointer-events-none text-slate-400 text-[10px]">
                  ▼
                </div>
              </div>
            </div>

            {/* Computed display rate */}
            <div className={`flex flex-col justify-between border rounded-2xl p-3 text-right transition duration-300 ${
              selectedRateCountry.trend === 'up' 
                ? 'border-emerald-100 bg-emerald-50/15' 
                : 'border-rose-100 bg-rose-50/15'
            }`}>
              <span className={`text-[9px] uppercase tracking-wider font-extrabold ${
                selectedRateCountry.trend === 'up' ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'
              }`}>
                {language === 'Arabic' ? 'أسعار اليوم' : "Today's Rate"}
              </span>
              <div className="flex flex-col items-end mt-2">
                <span className={`text-xs font-black transition-colors ${
                  selectedRateCountry.trend === 'up' ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  1 CAD = {selectedRateCountry.rate.toFixed(2)} {selectedRateCountry.currency}
                </span>
                <span className={`text-[8.5px] font-black flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded-md uppercase tracking-wide transition-all ${
                  selectedRateCountry.trend === 'up' ? 'text-emerald-700 bg-emerald-100/50' : 'text-rose-700 bg-rose-100/50'
                }`}>
                  {selectedRateCountry.trend === 'up' ? '▲' : '▼'} {selectedRateCountry.trendPercent}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              onStartSendMoneyFlow(undefined, selectedRateCountry);
            }}
            className="w-full mt-3 text-center py-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 bg-blue-50/30 hover:bg-blue-50/80 rounded-xl transition cursor-pointer"
          >
            <span>{language === 'Arabic' ? `أرسل إلى ${selectedRateCountry.name} الآن` : `Send to ${selectedRateCountry.name} now`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Invite Referral Card */}
        <div 
          onClick={() => setShowReferralModal(true)}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/60 rounded-2xl p-4 flex gap-3.5 items-center relative overflow-hidden cursor-pointer hover:shadow-md hover:border-blue-200 hover:scale-[1.01] active:scale-95 transition-all duration-300 group select-none"
        >
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 group-hover:scale-110 transition duration-300">
            <Gift className="w-24 h-24 text-blue-600" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:rotate-12 transition duration-300">
            <Gift className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-black text-slate-800">{language === 'Arabic' ? 'اكسب $20 كندي لكل إحالة!' : 'Earn $20 CAD for Invites!'}</h4>
              <span className="bg-blue-600/10 text-blue-700 px-1.5 py-0.5 rounded text-[7.5px] font-extrabold uppercase animate-pulse">{language === 'Arabic' ? 'احصل على المكافأة' : 'Claim Reward'}</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              {language === 'Arabic' ? 'اهدي $5 من المكافآت باستخدام الكود GLOBESAVE واكسب $20 كندي بعد اكتمال أول تحويل لهم.' : 'Gift $5 rewards with code GLOBESAVE and earn $20 after their first transfer completes successfully. Tap to invite!'}
            </p>
          </div>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowReferralModal(true);
            }}
            className="self-center p-2 rounded-full bg-white text-blue-600 border border-slate-100 shadow-sm hover:bg-blue-50 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent Transfers Section */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-855 tracking-tight uppercase">{translate('recentTransactions', language)}</h3>
            <button
              onClick={() => onNavigate('activity')}
              className="text-[11px] font-black text-blue-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          {recentTransfers.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 shadow-xs">
              <p className="text-xs text-slate-400 font-bold">No transfers sent yet.</p>
              <button
                onClick={() => onStartSendMoneyFlow()}
                className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-black text-blue-600 hover:underline"
              >
                <span>Send your first transfer now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransfers.map((tx) => {
                const conData = getCountryFlagAndCurrency(tx.country);
                return (
                  <div
                    key={tx.id}
                    onClick={() => {
                      // Navigate to Transaction tracking or receipt detail
                      // Let's set the transfer state and navigate
                      onNavigate({ screen: 'transfer-tracking', data: tx });
                    }}
                    className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:border-blue-100 hover:shadow-xs transition flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-lg shadow-inner relative">
                        {conData.flag}
                        <span className="absolute bottom-0 right-0 text-[8px] bg-white border border-slate-150 px-0.5 rounded-sm font-extrabold text-blue-600">
                          {tx.sendCurrency}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 leading-tight">{tx.recipientName}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 border rounded-md leading-none ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold">
                            {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <h4 className="text-xs font-black text-slate-900 leading-tight">
                        -${tx.sendAmount.toFixed(2)} CAD
                      </h4>
                      <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                        +{tx.receiveAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} {tx.receiveCurrency}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Security & Regulatory Compliance Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-3.5 items-center">
          <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 border border-blue-100">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-[11px] font-extrabold text-slate-800">FINTRAC Regulated Safe remits</h4>
            <p className="text-[10px] text-slate-400 leading-normal">
              256-bit encrypted ledger safeguards your fund transfers. In sandbox mode, no real currency is transferred.
            </p>
          </div>
        </div>
      </div>

      {/* Referral Program and Redeem Modal (Sandbox Active) */}
      {showReferralModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs border-transparent z-50 flex items-end justify-center select-none" id="referral-modal-overlay">
          <div className="bg-white rounded-t-3xl p-6 space-y-4 w-full max-w-sm mx-auto animate-slide-up max-h-[85%] overflow-y-auto" id="referral-modal-content">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 leading-tight">Referral & Earn Center</h3>
                  <p className="text-[9px] text-slate-400 font-semibold leading-none mt-0.5">Invite friends • Redeem bonus codes</p>
                </div>
              </div>
              <button
                onClick={() => setShowReferralModal(false)}
                className="text-slate-400 hover:text-slate-705 bg-slate-100 hover:bg-slate-200 transition rounded-full w-6 h-6 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Main scroll contents */}
            <div className="space-y-4 text-xs font-semibold">
              
              {/* Copy Promo Code Section */}
              <div className="bg-blue-50/40 border border-blue-105 rounded-2xl p-4 text-center space-y-2">
                <span className="text-[9.5px] uppercase tracking-wider font-extrabold text-blue-605 block">Your Personal Referral Code</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-black text-slate-800 bg-white border border-blue-150 px-4 py-1.5 rounded-xl tracking-wider select-all shadow-3xs">
                    GLOBESAVE
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('GLOBESAVE');
                      showToast('Referral code GLOBESAVE copied to clipboard!', 'success');
                    }}
                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer flex items-center justify-center shadow-xs"
                    title="Copy Code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[9.5px] text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
                  Share this code. When they sign up and send over $100 CAD, they get <span className="font-black text-emerald-600">$5.00 CAD bonus</span>, and we'll credit you <span className="font-black text-blue-605">$20.00 CAD</span>!
                </p>
              </div>

              {/* Form: Invite friends */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block">Invite Friends via Email</span>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="friend@example.com"
                      className="w-full pl-8.5 pr-3 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!inviteEmail || !inviteEmail.includes('@')) {
                        showToast('Please specify a valid email address', 'error');
                        return;
                      }
                      setIsSendingInvite(true);
                      setTimeout(() => {
                        setIsSendingInvite(false);
                        const updated = [{ email: inviteEmail, status: 'Pending' as const }, ...invitedFriends];
                        saveInvitedFriends(updated);
                        setInviteEmail('');
                        showToast(`Invitation sent successfully to ${inviteEmail}!`, 'success');
                      }, 1000);
                    }}
                    disabled={isSendingInvite}
                    className="px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    {isSendingInvite ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Send</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Redeem Promo/Referral Code to instantly win $5 Wallet Balance! */}
              <div className="border-t border-dashed border-slate-200 pt-4 space-y-2">
                <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block">Redeem Invite Promo Code</span>
                
                {hasClaimedCode ? (
                  <div className="bg-emerald-50/55 border border-emerald-100 p-2.5 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-[10.5px]">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold bg-emerald-100/60 rounded-full p-0.5" />
                    <span>You've already claimed your <span className="font-bold">$5.00 CAD</span> welcome bonus.</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      placeholder="e.g. FRIEND5"
                      className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-205 rounded-xl text-xs outline-none font-mono uppercase focus:ring-1 focus:ring-blue-600"
                    />
                    <button
                      onClick={() => {
                        if (!promoCodeInput.trim()) {
                          showToast('Please type a coupon code', 'error');
                          return;
                        }
                        if (promoCodeInput.trim().toUpperCase() === 'GLOBESAVE') {
                          if (onUpdateWalletBalance) {
                            onUpdateWalletBalance(prev => prev + 5.00);
                            setHasClaimedCode(true);
                            localStorage.setItem('gs_has_claimed_referral_code', 'true');
                            showToast('Referral Coupon GLOBESAVE applied! $5.00 welcome bonus added!', 'success');
                            setPromoCodeInput('');
                          } else {
                            showToast('Wallet balance modifier unavailable.', 'error');
                          }
                        } else if (promoCodeInput.trim().length >= 5) {
                          if (onUpdateWalletBalance) {
                            onUpdateWalletBalance(prev => prev + 5.00);
                            setHasClaimedCode(true);
                            localStorage.setItem('gs_has_claimed_referral_code', 'true');
                            showToast(`Mock coupon ${promoCodeInput} applied! $5.00 bonus added!`, 'success');
                            setPromoCodeInput('');
                          } else {
                            showToast('Wallet balance modifier unavailable.', 'error');
                          }
                        } else {
                          showToast('Invalid referral code format.', 'error');
                        }
                      }}
                      className="px-4 bg-emerald-605 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply</span>
                    </button>
                  </div>
                )}
              </div>

              {/* History of invited friends */}
              <div className="border-t border-dashed border-slate-200 pt-4 space-y-1.5 animate-fade-in">
                <span className="text-[9.5px] font-extrabold text-slate-450 uppercase tracking-widest block">Invites Sandbox Status Ledger</span>
                <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                  {invitedFriends.map((friend, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl text-[10px]">
                      <span className="font-mono text-slate-600 font-semibold truncate max-w-[190px]">{friend.email}</span>
                      <span className={`px-1.5 py-0.5 rounded-md text-[8.5px] font-black ${
                        friend.status === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100/50 animate-pulse'
                      }`}>
                        {friend.status === 'Completed' ? '+$20.00 CAD Earned' : 'Pending transfer'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sandbox Notice footer */}
            <div className="text-[9px] text-slate-400 text-center pt-2 leading-relaxed font-semibold">
              This is a sandbox referral center. Applying codes instantly credits the demo wallet so you can test complete end-to-end currency transfers.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
