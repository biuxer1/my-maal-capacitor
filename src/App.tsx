/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Send, History, User, CreditCard, Bell, Shield, Wallet, Plus, ChevronRight,
  Loader2, Sparkles, X, MessageSquare, HelpCircle, CheckCircle2
} from 'lucide-react';

// Types
import { ScreenId, User as UserType, Recipient, Transfer, PaymentMethod, Notification, Verification, CountryInfo } from './types';

// Mock Data
import { 
  INITIAL_USER, INITIAL_VERIFICATION, INITIAL_RECIPIENTS, 
  INITIAL_TRANSFERS, INITIAL_PAYMENT_METHODS, INITIAL_NOTIFICATIONS 
} from './data/mockData';

// Modular Screen Components
import { OnboardingAndAuth } from './components/OnboardingAndAuth';
import { DashboardScreen } from './components/DashboardScreen';
import { RecipientsScreens } from './components/RecipientsScreens';
import { SendMoneyFlow } from './components/SendMoneyFlow';
import { ProfileScreens } from './components/ProfileScreens';
import { ActivityAndDetails } from './components/ActivityAndDetails';
import { SupportAndInfo } from './components/SupportAndInfo';

export default function App() {
  // --- Persistent Local Database State ---
  const [user, setUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('gs_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [verification, setVerification] = useState<Verification>(() => {
    const saved = localStorage.getItem('gs_verification');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATION;
  });

  const [recipients, setRecipients] = useState<Recipient[]>(() => {
    const saved = localStorage.getItem('gs_recipients');
    return saved ? JSON.parse(saved) : INITIAL_RECIPIENTS;
  });

  const [transfers, setTransfers] = useState<Transfer[]>(() => {
    const saved = localStorage.getItem('gs_transfers');
    return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('gs_payment_methods');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_METHODS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('gs_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('gs_wallet_balance');
    return saved ? parseFloat(saved) : 1250.00; // Starter demo wallet amount
  });

  // --- UI Routing States ---
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    const savedUser = localStorage.getItem('gs_user');
    return savedUser ? 'dashboard' : 'onboarding';
  });

  // Navigation stack state for detailed objects (like viewing a transaction tracking in activity log)
  const [activeDetailData, setActiveDetailData] = useState<any>(null);
  
  // --- Repeat Transaction Prefill State ---
  const [prefilledRecipient, setPrefilledRecipient] = useState<Recipient | null>(null);
  const [prefilledCountry, setPrefilledCountry] = useState<CountryInfo | null>(null);

  // --- Sub views controller ---
  const [language, setLanguage] = useState('English');
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>>([]);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [addMoneyAmountText, setAddMoneyAmountText] = useState('200');
  const [addMoneyPaymentId, setAddMoneyPaymentId] = useState('');
  const [showSandboxBanner, setShowSandboxBanner] = useState(true);

  // --- Sync database to localStorage ---
  useEffect(() => {
    if (user) {
      localStorage.setItem('gs_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gs_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gs_verification', JSON.stringify(verification));
  }, [verification]);

  useEffect(() => {
    localStorage.setItem('gs_recipients', JSON.stringify(recipients));
  }, [recipients]);

  useEffect(() => {
    localStorage.setItem('gs_transfers', JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem('gs_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('gs_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('gs_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  // --- Mock Status Ticking Time ---
  const [currentTime, setCurrentTime] = useState('9:41');
  useEffect(() => {
    const updateLocalTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 12 instead of 0
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateLocalTime();
    const interval = setInterval(updateLocalTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- Toast Trigger helper ---
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // --- State modifiers ---
  const handleAddNewRecipient = (newRec: Omit<Recipient, 'id' | 'userId' | 'createdAt'>): Recipient | undefined => {
    if (!user) return;
    const added: Recipient = {
      ...newRec,
      id: `rec_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    setRecipients((prev) => [added, ...prev]);
    
    // Add Notification
    addInternalNotification(
      'New Recipient Created!',
      `${added.fullName} in ${added.country} is registered as a secure beneficiary for funds transfers.`,
      'system'
    );
    showToast(`Recipient ${added.fullName} saved!`, 'success');
    return added;
  };

  const handleCreateTransfer = (newTx: Omit<Transfer, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'transactionReference'>): string => {
    if (!user) return '';
    const txId = `tx_${Date.now()}`;
    const txRef = `MS-${Math.floor(100000 + Math.random() * 900000)}-INR`;
    
    const added: Transfer = {
      ...newTx,
      id: txId,
      userId: user.id,
      transactionReference: txRef,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTransfers((prev) => [added, ...prev]);

    // Send notification
    addInternalNotification(
      'Transfer Triggered!',
      `Sent $${added.sendAmount.toFixed(2)} CAD to ${added.recipientName} in ${added.country}. Clearing complete.`,
      'transfer'
    );

    return txId;
  };

  const handleAddPaymentMethod = (newPm: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const added: PaymentMethod = {
      ...newPm,
      id: `pm_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    setPaymentMethods((prev) => [...prev, added]);
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
  };

  const addInternalNotification = (title: string, message: string, type: Notification['type']) => {
    if (!user) return;
    const newNot: Notification = {
      id: `not_${Date.now()}`,
      userId: user.id,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications((prev) => [newNot, ...prev]);
  };

  const handleToggleNotificationRead = (notId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notId ? { ...n, isRead: true } : n))
    );
  };

  const handleArchiveNotification = (notId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notId ? { ...n, isArchived: true, isRead: true } : n))
    );
  };

  const handleRestoreNotification = (notId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notId ? { ...n, isArchived: false } : n))
    );
  };

  const handleDeleteNotification = (notId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notId));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleUpdateVerification = (updates: Partial<Verification>) => {
    setVerification((prev) => ({ ...prev, ...updates }));
  };

  const handleUpdateUserStatus = (status: UserType['verificationStatus']) => {
    if (user) {
      setUser({ ...user, verificationStatus: status });
    }
  };

  const handleUpdateUser = (updates: Partial<UserType>) => {
    if (user) {
      setUser((prev) => prev ? { ...prev, ...updates } : null);
    }
  };

  const handleLoginSuccess = (fullName: string, email: string, phone: string) => {
    const loggedUser: UserType = {
      id: 'usr_new',
      fullName,
      email,
      phone,
      country: 'Canada',
      verificationStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    setUser(loggedUser);
    setWalletBalance(1250.00); // Reset balance on new account entrance
    setVerification(INITIAL_VERIFICATION);
    setRecipients(INITIAL_RECIPIENTS);
    setTransfers(INITIAL_TRANSFERS);
    setPaymentMethods(INITIAL_PAYMENT_METHODS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gs_user');
    localStorage.removeItem('gs_verification');
    localStorage.removeItem('gs_recipients');
    localStorage.removeItem('gs_transfers');
    localStorage.removeItem('gs_payment_methods');
    localStorage.removeItem('gs_notifications');
    localStorage.removeItem('gs_wallet_balance');
    setCurrentScreen('onboarding');
  };

  // Fund mock CAD wallet balance
  const handleFundWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(addMoneyAmountText) || 0;
    if (amount <= 5) {
      showToast('Minimum funding amount is $5.00 CAD', 'error');
      return;
    }

    setWalletBalance((prev) => prev + amount);

    let providerLabel = 'Linked Visa Debit';
    const chosenPm = paymentMethods.find(p => p.id === addMoneyPaymentId);
    if (chosenPm) {
      providerLabel = chosenPm.brand ? `${chosenPm.brand} (•••• ${chosenPm.last4})` : chosenPm.provider;
    }

    // Append Alert Notification
    addInternalNotification(
      'Wallet Balance Funded!',
      `Charged $${amount.toFixed(2)} CAD from ${providerLabel} successfully. Funding sandbox balance complete.`,
      'system'
    );

    showToast(`Added $${amount.toFixed(2)} CAD to wallet!`, 'success');
    setShowAddMoneyModal(false);
    setAddMoneyAmountText('200');
  };

  // Nav helper supporting data transfers
  const handleNavigate = (route: any) => {
    if (typeof route === 'object' && route !== null) {
      setCurrentScreen(route.screen);
      if (route.data) {
        setActiveDetailData(route.data);
      }
    } else {
      setCurrentScreen(route);
      setActiveDetailData(null);
    }
  };

  // Active unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Render correct sub-screen inside mockup frame
  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
      case 'login-signup':
        return (
          <OnboardingAndAuth
            currentView={currentScreen}
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
            showToast={showToast}
            language={language}
            setLanguage={setLanguage}
          />
        );
      case 'dashboard':
        return (
          <DashboardScreen
            user={user!}
            walletBalance={walletBalance}
            transfers={transfers}
            recipients={recipients}
            unreadNotificationsCount={unreadCount}
            onNavigate={handleNavigate}
            onUpdateWalletBalance={setWalletBalance}
            onOpenAddMoney={() => {
              const defaultPm = paymentMethods.find((p) => p.isDefault) || paymentMethods[0];
              if (defaultPm) {
                setAddMoneyPaymentId(defaultPm.id);
              }
              setShowAddMoneyModal(true);
            }}
            onStartSendMoneyFlow={(prefilled, prefilledCountryData) => {
              if (prefilled) {
                setPrefilledRecipient(prefilled);
              } else {
                setPrefilledRecipient(null);
              }
              if (prefilledCountryData) {
                setPrefilledCountry(prefilledCountryData);
              } else {
                setPrefilledCountry(null);
              }
              setCurrentScreen('send-country');
            }}
            showToast={showToast}
            language={language}
            initialOpenReferral={activeDetailData?.openReferral}
          />
        );
      case 'send-country':
      case 'enter-amount':
      case 'review-transfer':
      case 'payment-methods':
      case 'sending-processing':
      case 'transfer-success':
      case 'transfer-tracking':
      case 'receipt-details':
        return (
          <SendMoneyFlow
            user={user!}
            walletBalance={walletBalance}
            recipients={recipients}
            paymentMethods={paymentMethods}
            onAddPaymentMethod={handleAddPaymentMethod}
            onNavigateHome={() => handleNavigate('dashboard')}
            onNavigate={handleNavigate}
            onDeductWallet={(amt) => setWalletBalance((p) => Math.max(0, p - amt))}
            onAddTransaction={handleCreateTransfer}
            onAddRecipient={handleAddNewRecipient}
            showToast={showToast}
            prefilledRecipient={prefilledRecipient}
            prefilledCountry={prefilledCountry}
            prefilledTransfer={currentScreen === 'transfer-tracking' || currentScreen === 'receipt-details' ? activeDetailData : null}
            initialStep={currentScreen === 'transfer-tracking' ? 'tracking' : currentScreen === 'receipt-details' ? 'receipt' : undefined}
            onResetPrefilled={() => {
              setPrefilledRecipient(null);
              setPrefilledCountry(null);
              setActiveDetailData(null);
            }}
            language={language}
          />
        );
      case 'recipients-list':
      case 'add-recipient':
        return (
          <RecipientsScreens
            recipients={recipients}
            initialActiveTab={currentScreen === 'add-recipient' ? 'new' : 'saved'}
            onSelectRecipient={(rec) => {
              setPrefilledRecipient(rec);
              setCurrentScreen('send-country');
            }}
            onAddRecipient={handleAddNewRecipient}
            onBack={() => handleNavigate('dashboard')}
            showToast={showToast}
          />
        );
      case 'activity':
        return (
          <ActivityAndDetails
            transfers={transfers}
            recipients={recipients}
            onNavigateDetail={(tx) => {
              // Navigate to transfer-tracking with data payload
              handleNavigate({ screen: 'transfer-tracking', data: tx });
            }}
            onRepeatTransfer={(rec) => {
              setPrefilledRecipient(rec);
              setCurrentScreen('send-country');
            }}
            onBack={() => handleNavigate('dashboard')}
            showToast={showToast}
          />
        );
      case 'profile-settings':
        return (
          <ProfileScreens
            user={user!}
            verification={verification}
            paymentMethods={paymentMethods}
            onUpdateVerification={handleUpdateVerification}
            onUpdateUserVerification={handleUpdateUserStatus}
            onLogout={handleLogout}
            onBack={() => handleNavigate('dashboard')}
            showToast={showToast}
            onOpenHelp={() => handleNavigate('help-support')}
            onUpdateUser={handleUpdateUser}
            notifications={notifications}
            onRestoreNotification={handleRestoreNotification}
            onDeleteNotification={handleDeleteNotification}
            onAddPaymentMethod={handleAddPaymentMethod}
            onDeletePaymentMethod={handleDeletePaymentMethod}
            onSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
          />
        );
      case 'notifications-screen':
        return (
          <SupportAndInfo
            viewId="notifications"
            notifications={notifications}
            onToggleRead={handleToggleNotificationRead}
            onClearAll={handleClearNotifications}
            onBack={() => handleNavigate('dashboard')}
            showToast={showToast}
            onNavigate={handleNavigate}
            onArchiveNotification={handleArchiveNotification}
            onDeleteNotification={handleDeleteNotification}
            transfers={transfers}
          />
        );
      case 'help-support':
        return (
          <SupportAndInfo
            viewId="support"
            notifications={notifications}
            onToggleRead={handleToggleNotificationRead}
            onClearAll={handleClearNotifications}
            onBack={() => handleNavigate('profile-settings')}
            showToast={showToast}
            user={user || undefined}
            verification={verification}
            paymentMethods={paymentMethods}
            transfers={transfers}
            onNavigate={handleNavigate}
            onArchiveNotification={handleArchiveNotification}
            onDeleteNotification={handleDeleteNotification}
          />
        );
      default:
        return <div className="p-4">Unknown Route: {currentScreen}</div>;
    }
  };

  // Check if current screen should display the global bottom navigation tabs
  const shouldShowBottomNav = user && [
    'dashboard', 'recipients-list', 'activity', 'profile-settings', 'notifications-screen', 'help-support'
  ].includes(currentScreen);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-5 font-sans relative antialiased overflow-hidden">
      {/* Background Ambience highlights */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none"></div>

      {/* --- RESPONSIVE APP CONTAINER PANEL --- */}
      <div className="relative w-full max-w-[425px] h-screen sm:h-[840px] bg-slate-50 sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden sm:border sm:border-slate-800/10 z-10">
        
        {/* Simulated Sandbox Banner */}
        {showSandboxBanner && (
          <div className="bg-amber-500 text-[#451a03] text-[9px] font-black py-2.5 px-4 text-center tracking-wider select-none z-50 shadow-inner uppercase flex items-center justify-between">
            <span className="flex-1 text-center font-bold">SANDBOX MODE • DEMO TRANSFER GATEWAY ONLY</span>
            <button
              onClick={() => setShowSandboxBanner(false)}
              className="hover:bg-black/10 p-0.5 rounded-sm transition flex items-center justify-center cursor-pointer flex-shrink-0"
              title="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Global Floating Toasts overlay inside screen */}
        <div className="absolute top-4 left-4 right-4 z-100 pointer-events-none space-y-1.5 flex flex-col items-center">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-3 rounded-2xl shadow-lg border text-xs max-w-sm pointer-events-auto flex items-center gap-2 animate-slide-down ${
                toast.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : toast.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <span className="font-extrabold flex-1 leading-normal">{toast.message}</span>
            </div>
          ))}
        </div>

        {/* SCREEN ADAPTER CONTAINER */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 relative">
          <div className="flex-1 overflow-hidden relative">
            {renderScreen()}
          </div>

          {/* --- CORE BOTTOM TAB BAR NAVIGATION --- */}
          {shouldShowBottomNav && (
            <div className="bg-white/95 backdrop-blur-md border-t border-slate-100/80 shadow-[0_-8px_24px_rgba(15,23,42,0.03)] grid grid-cols-5 p-2 pb-4 flex-shrink-0 z-50 select-none">
              <button
                onClick={() => handleNavigate('dashboard')}
                className="py-1 flex flex-col items-center justify-center transition-all duration-100 active:scale-90 cursor-pointer relative group"
              >
                <div className={`p-1.5 rounded-xl transition ${
                  currentScreen === 'dashboard' 
                    ? 'bg-blue-50/70 text-blue-600' 
                    : 'text-slate-400 group-active:text-slate-600'
                }`}>
                  <Home className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider mt-0.5 leading-none transition ${
                  currentScreen === 'dashboard' ? 'text-blue-600 font-extrabold' : 'text-slate-400'
                }`}>
                  Home
                </span>
                {currentScreen === 'dashboard' && (
                  <span className="absolute bottom-0 w-1 h-0.5 rounded-full bg-blue-600 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => handleNavigate('recipients-list')}
                className="py-1 flex flex-col items-center justify-center transition-all duration-100 active:scale-90 cursor-pointer relative group"
              >
                <div className={`p-1.5 rounded-xl transition ${
                  currentScreen === 'recipients-list' || currentScreen === 'add-recipient'
                    ? 'bg-blue-50/70 text-blue-600' 
                    : 'text-slate-400 group-active:text-slate-600'
                }`}>
                  <Users className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider mt-0.5 leading-none transition ${
                  currentScreen === 'recipients-list' || currentScreen === 'add-recipient' ? 'text-blue-600 font-extrabold' : 'text-slate-400'
                }`}>
                  People
                </span>
                {(currentScreen === 'recipients-list' || currentScreen === 'add-recipient') && (
                  <span className="absolute bottom-0 w-1 h-0.5 rounded-full bg-blue-650 bg-blue-605 bg-blue-600 animate-pulse"></span>
                )}
              </button>

              {/* Central Elevated Send Button */}
              <div className="relative flex flex-col items-center justify-center">
                <button
                  onClick={() => {
                    setPrefilledRecipient(null);
                    handleNavigate('send-country');
                  }}
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center -translate-y-4.5 shadow-lg shadow-indigo-600/35 hover:shadow-indigo-600/55 transition-all duration-150 active:scale-85 cursor-pointer ring-4 ring-slate-50 relative z-10 flex-shrink-0"
                  title="Send Money"
                >
                  <Send className="w-5 h-5 transform rotate-0 hover:rotate-6 transition duration-300 stroke-[2.5]" />
                </button>
                <span className={`text-[8px] font-black uppercase tracking-wider -translate-y-2 leading-none transition ${
                  ['send-country', 'enter-amount', 'review-transfer', 'payment-methods', 'sending-processing', 'transfer-success', 'transfer-tracking', 'receipt-details'].includes(currentScreen)
                    ? 'text-indigo-600 font-extrabold'
                    : 'text-slate-400'
                }`}>
                  Send
                </span>
              </div>

              <button
                onClick={() => handleNavigate('activity')}
                className="py-1 flex flex-col items-center justify-center transition-all duration-100 active:scale-90 cursor-pointer relative group"
              >
                <div className={`p-1.5 rounded-xl transition ${
                  currentScreen === 'activity' 
                    ? 'bg-blue-50/70 text-blue-600' 
                    : 'text-slate-400 group-active:text-slate-600'
                }`}>
                  <History className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider mt-0.5 leading-none transition ${
                  currentScreen === 'activity' ? 'text-blue-600 font-extrabold' : 'text-slate-400'
                }`}>
                  Activity
                </span>
                {currentScreen === 'activity' && (
                  <span className="absolute bottom-0 w-1 h-0.5 rounded-full bg-blue-600 animate-pulse"></span>
                )}
              </button>

              <button
                onClick={() => handleNavigate('profile-settings')}
                className="py-1 flex flex-col items-center justify-center transition-all duration-100 active:scale-90 cursor-pointer relative group"
              >
                <div className={`p-1.5 rounded-xl transition ${
                  currentScreen === 'profile-settings' 
                    ? 'bg-blue-50/70 text-blue-600' 
                    : 'text-slate-400 group-active:text-slate-600'
                }`}>
                  <User className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-wider mt-0.5 leading-none transition ${
                  currentScreen === 'profile-settings' ? 'text-blue-600 font-extrabold' : 'text-slate-400'
                }`}>
                  Settings
                </span>
                {currentScreen === 'profile-settings' && (
                  <span className="absolute bottom-0 w-1 h-0.5 rounded-full bg-blue-600 animate-pulse"></span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- ADD MONEY / FUND MOCK WALLET MODAL DRAWER --- */}
      {showAddMoneyModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-3 z-200 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-[390px] p-5 space-y-4 animate-scale-up border border-slate-100 select-none">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900">Fund Sandbox Wallet</h3>
              <button
                onClick={() => setShowAddMoneyModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Add sandbox funds immediately using any linked card or bank account. The funds are created for demo purposes.
            </p>

            <form onSubmit={handleFundWalletSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Funding Amount (CAD)</label>
                <div className="flex items-center gap-1 mt-1 text-slate-900">
                  <span className="text-xl font-black">$</span>
                  <input
                    type="number"
                    value={addMoneyAmountText}
                    onChange={(e) => setAddMoneyAmountText(e.target.value)}
                    required
                    placeholder="200"
                    className="text-xl font-black border-none outline-none bg-transparent w-full p-0 focus:ring-0"
                  />
                  <span className="font-black text-slate-600">CAD</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-405">Funding Method Source</label>
                <select
                  value={addMoneyPaymentId}
                  onChange={(e) => setAddMoneyPaymentId(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer font-bold text-slate-800"
                >
                  {paymentMethods.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.provider} {pm.type === 'card' ? 'Debit' : 'Chequing'} (•••• {pm.last4})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-4 rounded-xl transition shadow-xs flex items-center justify-center placeholder-gray-400"
              >
                <span>Confirm Sandbox Deposit</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
