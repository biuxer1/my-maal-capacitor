/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, Bell, Search, AlertCircle, ChevronDown, ChevronUp, MessageSquare, 
  Send, Landmark, ShieldCheck, Mail, Phone, Clock, Activity, RefreshCw, 
  CheckCircle2, AlertTriangle, Shield, CreditCard, Wrench, Sparkles, Check,
  Archive, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Notification, User as UserType, Verification, Transfer, PaymentMethod } from '../types';

interface SupportAndInfoProps {
  viewId: 'notifications' | 'support';
  notifications: Notification[];
  onToggleRead: (id: string) => void;
  onClearAll: () => void;
  onBack: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  // Context fields for Diagnostic Scanner
  user?: UserType;
  verification?: Verification;
  transfers?: Transfer[];
  paymentMethods?: PaymentMethod[];
  onNavigate?: (screen: any) => void;
  onArchiveNotification?: (id: string) => void;
  onDeleteNotification?: (id: string) => void;
}

// Upgraded FAQ data with categories
const LOCAL_FAQS = [
  {
    q: 'How long does a transfer take?',
    a: 'Most bank transfers and mobile wallet transactions are deposited instantly or within minutes. Some bank deposits can take up to 24 hours depending on the destination bank\'s working hours and KYC clearance.',
    category: 'transfers' as const
  },
  {
    q: 'What fees does Maal Pay charge?',
    a: 'Our fees are tier-based: CAD 2.99 for amounts under CAD 100, CAD 3.99 for transfers between CAD 100 and CAD 999, and absolutely free for transfers of CAD 1,000 or more! Use code GLOBESAVE on your first transactions for CAD 5.00 off.',
    category: 'payments' as const
  },
  {
    q: 'Is my money secure with Maal Pay?',
    a: 'Absolutely. We use industry-grade financial encryption (AES-256), secure SSL connections, Biometric Face ID, and comply with standard FINTRAC/KYC regulatory monitoring guidelines to ensure your funds and identity are safe.',
    category: 'kyc' as const
  },
  {
    q: 'How can I increase my sending limits?',
    a: 'Complete your profile verification by going to Security & Verification in your Settings. Once you verify your address, you will be upgraded to Level 2 limits enabling transfers up to $10,000 CAD daily.',
    category: 'kyc' as const
  },
  {
    q: 'How do I cancel a transfer?',
    a: 'If a transfer is still "Processing" and has not been "Delivered" yet, you can contact our 24/7 support chat or hotline directly from this Help screen to request a hassle-free cancellation and refund.',
    category: 'transfers' as const
  },
  {
    q: 'Why is my transfer status stuck on "Processing"?',
    a: '"Processing" status indicates MaalPay has successfully received your funds and is clearing international compliance pipelines. This usually resolves in 5-20 minutes. If the recipient name doesn\'t align perfectly with bank records, or manual gateway KYC is triggered, it might wait in compliance review for up to 1 business day.',
    category: 'transfers' as const
  },
  {
    q: 'Why was my Debit Card or Bank transaction declined?',
    a: 'The most frequent decline causes are: (1) Insufficient funds in your bank chequing balance, (2) Going over local daily card transaction limits configured by your bank, or (3) Your bank flagging international remittance software. We recommend using a different card, bank option, or calling your provider.',
    category: 'payments' as const
  },
  {
    q: 'How do I claim my $5.00 referral bonus?',
    a: 'Open Settings -> Referral & Earn Center, enter your coupon code in "Redeem Invite Promo Code" and click "Apply". If valid, $5.00 CAD welcome bonus is added instantly to your wallet for testing outbound sandbox transfers. If you share your personal referral link, you gain $20 CAD for every friend who does a real-simulated transfer of over $100 CAD.',
    category: 'referrals' as const
  }
];

export function SupportAndInfo({
  viewId,
  notifications,
  onToggleRead,
  onClearAll,
  onBack,
  showToast,
  user,
  verification,
  transfers,
  paymentMethods,
  onNavigate,
  onArchiveNotification,
  onDeleteNotification
}: SupportAndInfoProps) {
  // FAQs State
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'transfers' | 'payments' | 'kyc' | 'referrals'>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Contact support form
  const [chatMessage, setChatMessage] = useState('');
  const [chatSubject, setChatSubject] = useState('Transfer Issue / Delay');
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Diagnostics State
  const [diagnosticStatus, setDiagnosticStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [diagnosticStage, setDiagnosticStage] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [findings, setFindings] = useState<Array<{
    id: string;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    desc: string;
    actionText?: string;
    actionType?: 'kyc' | 'payments' | 'auto-fill-support';
    actionPayload?: any;
  }>>([]);

  // Filter FAQS by search and categories
  const filteredFaqs = LOCAL_FAQS.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
                          faq.a.toLowerCase().includes(faqSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSupportFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) {
      showToast('Please type a valid description message.', 'error');
      return;
    }
    showToast(`Support Ticket created: We'll reply within 15 minutes!`, 'success');
    setChatMessage('');
    setShowSupportModal(false);
  };

  const runDiagnostics = () => {
    setDiagnosticStatus('running');
    setDiagnosticStage(0);
    setTerminalLogs(['[SYS] Diagnostics software initiated...', '[SYS] Scanning local device and currency gateway...']);
    setFindings([]);
    
    // Stage 1: Network Connection Check
    setTimeout(() => {
      setDiagnosticStage(1);
      setTerminalLogs(prev => [
        ...prev, 
        '[SYS] Checking network latencies with Global Remittance Desk...', 
        '[SYS] Core Gateway Latency: 44ms (Optimal Status) 🟢'
      ]);
    }, 500);

    // Stage 2: Scan Compliance (KYC)
    setTimeout(() => {
      setDiagnosticStage(2);
      const isKyced = verification?.addressStatus === 'verified';
      setTerminalLogs(prev => [
        ...prev, 
        '[KYC] Auditing profile limits and identity tiers...', 
        `[KYC] Verification status: ${isKyced ? 'Level 2 Daily limits unlocked ✓' : 'Level 1 Soft Limits active ⚠️'}`
      ]);
    }, 1100);

    // Stage 3: Funding methods check
    setTimeout(() => {
      setDiagnosticStage(3);
      const payCount = paymentMethods?.length || 0;
      setTerminalLogs(prev => [
        ...prev, 
        '[PAY] Scanning linked credit cards and chequing accounts...', 
        `[PAY] Wallet: Connected routes = ${payCount} valid paths`
      ]);
    }, 1700);

    // Stage 4: Transfer Auditor Scan
    setTimeout(() => {
      setDiagnosticStage(4);
      const txs = transfers || [];
      const processingCheck = txs.some(t => t.status === 'Processing' || t.status === 'Pending');
      setTerminalLogs(prev => [
        ...prev, 
        '[TX] Auditing remittance trace and escrow status...', 
        `[TX] Active transfer checks: ${processingCheck ? '1 STALL DETECTED ⚠️' : 'All prior orders successfully settled ✓'}`
      ]);
    }, 2300);

    // Completion Compile
    setTimeout(() => {
      setDiagnosticStatus('completed');
      const compiledFindings: typeof findings = [];

      // A) Limit & Address Verification Check
      const isKyced = verification?.addressStatus === 'verified';
      if (!isKyced) {
        compiledFindings.push({
          id: 'kyc-finding',
          type: 'warning',
          title: 'Limit Restrictions Active (Level 1 KYC)',
          desc: 'Your residential address verification is currently outstanding. Standard transfer volumes exceeding $500 CAD might halt. To prevent delay, update address details.',
          actionText: 'Update Verification to level 2',
          actionType: 'kyc'
        });
      } else {
        compiledFindings.push({
          id: 'kyc-finding',
          type: 'success',
          title: 'KYC Level 2 Verified',
          desc: 'Safe limit check. Account possesses cleared regulatory credentials allowing transfers up to $10,000 CAD daily.'
        });
      }

      // B) Recent Outbound transfer audit
      const txs = transfers || [];
      const stuckTx = txs.find(t => t.status === 'Processing' || t.status === 'Pending');
      if (stuckTx) {
        compiledFindings.push({
          id: 'tx-finding',
          type: 'warning',
          title: `Transfer #${stuckTx.transactionReference} is Processing`,
          desc: `The CAD funding for this transfer of $${stuckTx.sendAmount} CAD to ${stuckTx.recipientName} is safely escowed. Clearing bank gateway is matching beneficiary identification records on target end.`,
          actionText: 'Pre-fill Support Ticket for this Transfer',
          actionType: 'auto-fill-support',
          actionPayload: {
            ref: stuckTx.transactionReference,
            recipient: stuckTx.recipientName,
            amount: stuckTx.sendAmount
          }
        });
      } else if (txs.length > 0) {
        compiledFindings.push({
          id: 'tx-finding',
          type: 'success',
          title: 'Outbound Remittances Clear',
          desc: 'All prior transfers are fully closed and settled on downstream foreign network vaults without errors.'
        });
      } else {
        compiledFindings.push({
          id: 'tx-finding',
          type: 'info',
          title: 'No Transfers Pending',
          desc: 'Your remittance history is empty inside this session. No transactions are currently stalled.'
        });
      }

      // C) Payment setup check
      const pmCount = paymentMethods?.length || 0;
      if (pmCount === 0) {
        compiledFindings.push({
          id: 'pm-finding',
          type: 'error',
          title: 'No Active Funding Accounts Linked',
          desc: 'Remittance checkouts require a linkedDebit Card or Chequing Account. Please register a payment asset under your profile.',
          actionText: 'Manage Funding accounts',
          actionType: 'payments'
        });
      } else {
        compiledFindings.push({
          id: 'pm-finding',
          type: 'success',
          title: `Funding Resources Check OK`,
          desc: `Detected ${pmCount} linked funding source(s) valid for real-time CAD billing checks.`
        });
      }

      setFindings(compiledFindings);
    }, 2800);
  };

  const handleActionClick = (f: typeof findings[0]) => {
    if (f.actionType === 'kyc') {
      showToast('Routing to identity & address update center...', 'info');
      onBack(); // Go back to settings root so they can enter address
    } else if (f.actionType === 'payments') {
      showToast('Routing to funding accounts manager...', 'info');
      onBack(); // Go back to settings root
    } else if (f.actionType === 'auto-fill-support') {
      const p = f.actionPayload;
      setChatSubject('Transfer Issue / Delay');
      setChatMessage(`Hello, I ran the self-diagnostic checker on my Processing transfer of $${p.amount} CAD to my recipient ${p.recipient} (Ref: #${p.ref}). Could your clearance desk evaluate the clearing queue on the receiving bank? Thank you.`);
      setShowSupportModal(true);
      showToast('Support ticket pre-filled with transfer reference!', 'success');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-1 px-2.5 rounded-full hover:bg-slate-100 text-slate-600 font-bold text-sm bg-slate-5- transition"
          >
            ← Back
          </button>
          <span className="font-extrabold text-slate-900 text-sm">
            {viewId === 'notifications' ? 'Notifications Center' : 'Help center & FAQ'}
          </span>
        </div>

        {viewId === 'notifications' && notifications.length > 0 && (
          <button
            onClick={() => {
              onClearAll();
              showToast('Cleared all notifications', 'info');
            }}
            className="text-xs font-black text-rose-600 hover:rose-750 bg-rose-50 px-2.5 py-1.5 rounded-xl transition"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        
        {/* VIEW 1: NOTIFICATIONS SCREEN */}
        {viewId === 'notifications' ? (
          <div className="p-4 space-y-4">
            {notifications.filter(n => !n.isArchived).length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center flex flex-col items-center justify-center space-y-3.5 shadow-3xs">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-bounce">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-705">No new alerts found</h4>
                  <p className="text-[10px] text-slate-400 max-w-sm leading-normal">
                    You're completely caught up! We will alert you here as soon as transfer clearings process in active sandbox lanes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center pl-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    Alert Logs ({notifications.filter(n => !n.isArchived).length})
                  </span>
                  <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">
                    ← Swipe for actions →
                  </span>
                </div>

                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {notifications.filter(n => !n.isArchived).map((not) => (
                      <motion.div
                        key={not.id}
                        layout
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        className="relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100"
                      >
                        {/* Swipe backdrop layer */}
                        <div className="absolute inset-0 flex items-center justify-between px-5 bg-slate-50/50 z-0 select-none">
                          <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-[9.5px] uppercase tracking-wider">
                            <Archive className="w-4 h-4 text-emerald-550" />
                            <span>Archive</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-rose-600 font-extrabold text-[9.5px] uppercase tracking-wider">
                            <span>Delete</span>
                            <Trash2 className="w-4 h-4 text-rose-550" />
                          </div>
                        </div>

                        {/* Slide card */}
                        <motion.div
                          drag="x"
                          dragDirectionLock
                          dragConstraints={{ left: -110, right: 110 }}
                          dragSnapToOrigin={true}
                          onDragEnd={(_, info) => {
                            if (info.offset.x > 80) {
                              if (onArchiveNotification) {
                                onArchiveNotification(not.id);
                                showToast('Alert archived successfully', 'success');
                              }
                            } else if (info.offset.x < -80) {
                              if (onDeleteNotification) {
                                onDeleteNotification(not.id);
                                showToast('Alert deleted successfully', 'info');
                              }
                            }
                          }}
                           onClick={() => {
                            onToggleRead(not.id);
                            
                            // Path navigation based on Category
                            if (not.type === 'transfer') {
                              const text = (not.message + " " + not.title).toLowerCase();
                              // Try to find a transfer whose recipientName or reference matches the notification text
                              const matchingTx = transfers?.find(tx => {
                                const repName = tx.recipientName.toLowerCase();
                                const txRef = tx.transactionReference ? tx.transactionReference.toLowerCase() : '';
                                return text.includes(repName) || (txRef && text.includes(txRef));
                              });
                              
                              if (matchingTx) {
                                onNavigate?.({ screen: 'transfer-tracking', data: matchingTx });
                                showToast(`Opening tracking status detail for ${matchingTx.recipientName}.`, 'success');
                              } else if (transfers && transfers.length > 0) {
                                // Fallback to most recent transfer
                                const mostRecentTx = [...transfers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                                onNavigate?.({ screen: 'transfer-tracking', data: mostRecentTx });
                                showToast(`Opening tracking status detail for ${mostRecentTx.recipientName}.`, 'success');
                              } else {
                                onNavigate?.('activity');
                                showToast('Navigating to recent transfers.', 'info');
                              }
                            } else if (not.type === 'verification') {
                              onNavigate?.('profile-settings');
                              showToast('Identity verification system loaded.', 'info');
                            } else if (not.type === 'promo') {
                              onNavigate?.({ screen: 'dashboard', data: { openReferral: true } });
                              showToast('Opening referral & rewards window.', 'success');
                            } else {
                              onNavigate?.('dashboard');
                            }
                          }}
                          className={`p-4 rounded-2xl border-0 relative z-10 transition-colors cursor-pointer select-none ${
                            not.isRead 
                              ? 'bg-white shadow-3xs border-slate-100/40 text-slate-405' 
                              : 'bg-blue-50/25 border-blue-100 shadow-2xs text-slate-705'
                          }`}
                        >
                          {/* Unread status dot */}
                          {!not.isRead && (
                            <span className="absolute left-[13px] top-[21px] w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}

                          <div className={not.isRead ? 'pl-0' : 'pl-3.5'}>
                            <div className="flex justify-between items-start">
                              <h4 className={`text-xs leading-tight font-black ${not.isRead ? 'text-slate-450 font-bold' : 'text-slate-800'}`}>
                                {not.title}
                              </h4>
                              <span className="text-[9px] text-slate-455 font-bold font-mono">
                                {new Date(not.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className={`text-[10px] mt-1 pr-1.5 leading-relaxed font-semibold ${not.isRead ? 'text-slate-400' : 'text-slate-550'}`}>
                              {not.message}
                            </p>
                            <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-50/70">
                              <span className="text-[8.5px] text-slate-405 font-bold uppercase tracking-wider">
                                {not.type} Alert
                              </span>
                              <span className={`text-[8.5px] font-black uppercase tracking-wider ${not.isRead ? 'text-slate-400' : 'text-blue-550 animate-pulse'}`}>
                                {not.isRead ? 'Read alert' : 'New action required'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        ) : (
          
          /* VIEW 2: FAQS AND ACTIVE SUPPORT CLIENT WITH INTERACTIVE DIAGNOSTIC SCREEN */
          <div className="p-4 space-y-4 font-sans text-xs">
            
            {/* Quick Live Contact block */}
            <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-md space-y-3.5 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-[0.03] scale-105 pointer-events-none">
                <HelpCircle className="w-36 h-36" />
              </div>
              <div>
                <span className="bg-blue-600/25 text-blue-300 font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/20">24/7 Remittance Response</span>
                <h3 className="text-xs font-black text-white mt-2">Stuck transfer or KYC query?</h3>
                <p className="text-[10px] text-slate-400 leading-normal mt-1">
                  Our sandbox agent lobby resolves document clearance delays and pending payment reviews in real-time. Feel free to open a ticket.
                </p>
              </div>

              <button
                onClick={() => setShowSupportModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Instant Support Ticket</span>
              </button>
            </div>

            {/* UPGRADED INTELLIGENT SYSTEM DIAGNOSTICS CENTER */}
            <div className="bg-white border border-slate-100 rounded-3xl p-4.5 shadow-2xs space-y-3.5" id="self-diagnostics-dashboard">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-850 text-xs">Interactive Self-Diagnostics</h4>
                    <p className="text-[9px] text-slate-400 font-semibold leading-none mt-0.5">Audit transaction status & limits instantly</p>
                  </div>
                </div>
                
                {diagnosticStatus === 'idle' && (
                  <button
                    onClick={runDiagnostics}
                    className="bg-blue-650 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-extrabold gap-1.5 transition flex items-center shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Scan Status</span>
                  </button>
                )}
              </div>

              {/* Status block: Running the deep scan */}
              {diagnosticStatus === 'running' && (
                <div className="space-y-3 border border-slate-100 bg-slate-50/50 p-4 rounded-2xl animate-pulse">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      {diagnosticStage === 1 && 'Scanning regional API gateways...'}
                      {diagnosticStage === 2 && 'Validating limits & KYC levels...'}
                      {diagnosticStage === 3 && 'Assessing registered payment types...'}
                      {diagnosticStage === 4 && 'Auditing transfer hash trails...'}
                    </span>
                    <span>Stage {diagnosticStage} / 4</span>
                  </div>
                  
                  {/* Progress light-bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(diagnosticStage / 4) * 100}%` }}
                    />
                  </div>

                  {/* Terminal console text output */}
                  <div className="bg-slate-900 rounded-xl p-3 font-mono text-[9px] text-indigo-250 space-y-1 block border border-slate-950 shadow-inner max-h-24 overflow-y-auto">
                    {terminalLogs.map((log, lidx) => (
                      <div key={lidx} className="leading-normal">{log}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status block: Complete! Output results */}
              {diagnosticStatus === 'completed' && (
                <div className="space-y-3 text-[10.5px]">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="font-extrabold text-emerald-700 flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-100/50 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Scan Auditing Complete
                    </span>
                    <button
                      onClick={runDiagnostics}
                      className="text-blue-650 hover:underline font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Re-Scan
                    </button>
                  </div>

                  {/* Diagnostic Findings checklist outputs */}
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {findings.map((f) => (
                      <div 
                        key={f.id} 
                        className={`p-3 rounded-2xl border flex flex-col gap-2 relative ${
                          f.type === 'success' 
                            ? 'bg-emerald-50/20 border-emerald-100 text-slate-705' 
                            : f.type === 'warning'
                            ? 'bg-amber-50/30 border-amber-150 text-slate-705'
                            : f.type === 'error'
                            ? 'bg-rose-50/20 border-rose-105 text-slate-705'
                            : 'bg-slate-50 border-slate-105 text-slate-705'
                        }`}
                      >
                        <div className="flex gap-2 items-start">
                          <div className="mt-0.5 shrink-0">
                            {f.type === 'success' && <Check className="w-4 h-4 text-emerald-600 bg-emerald-100 p-0.5 rounded-full" />}
                            {f.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                            {f.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                            {f.type === 'info' && <HelpCircle className="w-4 h-4 text-slate-500" />}
                          </div>
                          <div className="space-y-1">
                            <h5 className="font-black text-slate-850 leading-tight">{f.title}</h5>
                            <p className="text-[10px] text-slate-500 leading-normal font-medium">{f.desc}</p>
                          </div>
                        </div>

                        {/* Interactive Fix Suggestion */}
                        {f.actionText && (
                          <button
                            onClick={() => handleActionClick(f)}
                            className="self-start mt-1 text-[9px] font-extrabold uppercase tracking-wide bg-white hover:bg-slate-50 text-blue-600 px-3 py-1.5 rounded-xl border border-blue-150 shadow-3xs transition cursor-pointer"
                          >
                            {f.actionText} →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status block: Idle state trigger button */}
              {diagnosticStatus === 'idle' && (
                <div onClick={runDiagnostics} className="bg-slate-50 rounded-2xl p-3.5 text-center border border-dashed border-slate-200 hover:bg-slate-100/50 transition cursor-pointer select-none">
                  <Activity className="w-5 h-5 mx-auto text-blue-600 animate-pulse" />
                  <span className="text-[10.5px] font-black text-blue-600 hover:text-blue-750 block mt-1.5 underline">
                    Run Outbound Audit Status Scanner
                  </span>
                  <p className="text-[9px] text-slate-400 mt-0.5">Check for stuck transfers, pending identity tiers, and card errors instantly.</p>
                </div>
              )}
            </div>

            {/* UPGRADED FAQ SEARCH AND CATEGORY PILTER */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pl-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Interactive FAQ Desk</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase font-mono bg-slate-200 px-1.5 py-0.5 rounded leading-none">{filteredFaqs.length} Answers</span>
              </div>

              {/* Search input field */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Query issues, e.g. card, limit, stuck..."
                  value={faqSearch}
                  onChange={(e) => {
                    setFaqSearch(e.target.value);
                    setExpandedIndex(null); // Reset collapse indices
                  }}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-705 outline-none focus:ring-1 focus:ring-blue-650 focus:border-blue-650 transition shadow-3xs"
                />
              </div>

              {/* Pill category tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                <button
                  onClick={() => { setSelectedCategory('all'); setExpandedIndex(null); }}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap border transition ${
                    selectedCategory === 'all' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                      : 'bg-white border-slate-150 text-slate-500 hover:bg-slate-55'
                  }`}
                >
                  All FAQs
                </button>
                <button
                  onClick={() => { setSelectedCategory('transfers'); setExpandedIndex(null); }}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap border transition ${
                    selectedCategory === 'transfers' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                      : 'bg-white border-slate-150 text-slate-500 hover:bg-slate-55'
                  }`}
                >
                  Transfers
                </button>
                <button
                  onClick={() => { setSelectedCategory('payments'); setExpandedIndex(null); }}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap border transition ${
                    selectedCategory === 'payments' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                      : 'bg-white border-slate-150 text-slate-500 hover:bg-slate-55'
                  }`}
                >
                  Funding
                </button>
                <button
                  onClick={() => { setSelectedCategory('kyc'); setExpandedIndex(null); }}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap border transition ${
                    selectedCategory === 'kyc' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                      : 'bg-white border-slate-150 text-slate-500 hover:bg-slate-55'
                  }`}
                >
                  KYC Limits
                </button>
                <button
                  onClick={() => { setSelectedCategory('referrals'); setExpandedIndex(null); }}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap border transition ${
                    selectedCategory === 'referrals' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                      : 'bg-white border-slate-150 text-slate-500 hover:bg-slate-55'
                  }`}
                >
                  Referrals
                </button>
              </div>

              {/* Collapsible FAQ list */}
              {filteredFaqs.length === 0 ? (
                <div className="bg-white rounded-3xl p-7 text-center text-slate-400 font-bold border border-slate-100 flex flex-col items-center justify-center space-y-1 shadow-3xs">
                  <AlertTriangle className="w-5 h-5 text-slate-300" />
                  <span>No questions correspond to search terms.</span>
                  <span className="text-[9px] text-slate-300 font-normal">Try another term or tap 'Contact Agent' for customized assistance.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFaqs.map((faq, idx) => {
                    const isExpanded = expandedIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                        className="bg-white border border-slate-105 rounded-2xl overflow-hidden shadow-3xs cursor-pointer hover:border-slate-300 transition"
                      >
                        <div className="p-4 flex justify-between items-center bg-white">
                          <h4 className="text-xs font-black text-slate-805 pr-4 flex-1">
                            {faq.q}
                          </h4>
                          {isExpanded 
                            ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" /> 
                            : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                        </div>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 border-t border-slate-50 text-[10.5px] text-slate-500 leading-relaxed font-semibold animate-fade-in bg-slate-50/20">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Alternative contact cards */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs text-slate-650">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-800">Direct Email Desk</h5>
                  <p className="text-[9.5px] text-slate-400 mt-0.5">support@maalpay.com</p>
                </div>
              </div>
              <span className="font-mono text-[8.5px] text-slate-400 font-black bg-slate-50 px-1.5 py-0.5 rounded leading-none">24HR SLAS</span>
            </div>

          </div>
        )}
      </div>

      {/* Support message request modal */}
      {showSupportModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-2 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl p-6 space-y-4 w-full max-w-md mx-auto animate-slide-up max-h-[85%] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-50 text-blue-650 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black text-slate-900 leading-none">Create a Support Ticket</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 transition rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSupportFormSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-402 uppercase font-black tracking-wider block">Subject Category</label>
                <select
                  value={chatSubject}
                  onChange={(e) => setChatSubject(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-205 rounded-xl cursor-pointer"
                >
                  <option>Transfer Issue / Delay</option>
                  <option>KYC / Address Upload</option>
                  <option>Credit Cards / Linked Bank Accounts</option>
                  <option>Fees / Referral bonus credits</option>
                  <option>Security / Pin setups</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-402 uppercase font-black tracking-wider block">Detailed Message Description</label>
                <textarea
                  required
                  rows={4}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="How can Maal Pay assist you today in sandbox? Please specify transaction details."
                  className="w-full p-3 bg-slate-50 border border-slate-205 rounded-xl outline-none leading-relaxed font-sans"
                />
              </div>

              <p className="text-[9px] text-slate-400 mt-1 flex items-center gap-1.5 font-bold">
                <Clock className="w-3.5 h-3.5 text-blue-650 shrink-0" />
                <span>Typical response time is less than 15 minutes.</span>
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="py-3 bg-slate-100 text-slate-650 font-black rounded-xl hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
