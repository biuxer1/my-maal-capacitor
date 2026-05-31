/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, User, Shield, Key, Bell, CreditCard, HelpCircle, 
  Plus, ChevronRight, LogOut, Check, Building, Landmark, Smartphone, 
  MapPin, Upload, FileText, Fingerprint, Lock, Eye, CheckCircle2,
  Trash2, Trash
} from 'lucide-react';
import { User as UserType, Verification, PaymentMethod, Notification } from '../types';
import { getProviderLogo } from '../utils/providerLogos';

interface ProfileScreensProps {
  user: UserType;
  verification: Verification;
  paymentMethods: PaymentMethod[];
  onUpdateVerification: (updates: Partial<Verification>) => void;
  onUpdateUserVerification: (status: 'unverified' | 'pending' | 'verified') => void;
  onLogout: () => void;
  onBack: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onOpenHelp?: () => void;
  onUpdateUser?: (updates: Partial<UserType>) => void;
  notifications?: Notification[];
  onRestoreNotification?: (id: string) => void;
  onDeleteNotification?: (id: string) => void;
  onAddPaymentMethod?: (pm: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>) => void;
  onDeletePaymentMethod?: (id: string) => void;
  onSetDefaultPaymentMethod?: (id: string) => void;
}

type ProfileSubView = 'root' | 'verification' | 'payments' | 'info' | 'password-modal' | 'archived-alerts';

export function ProfileScreens({
  user,
  verification,
  paymentMethods,
  onUpdateVerification,
  onUpdateUserVerification,
  onLogout,
  onBack,
  showToast,
  onOpenHelp,
  onUpdateUser,
  notifications = [],
  onRestoreNotification,
  onDeleteNotification,
  onAddPaymentMethod,
  onDeletePaymentMethod,
  onSetDefaultPaymentMethod
}: ProfileScreensProps) {
  const [subView, setSubView] = useState<ProfileSubView>('root');
  
  // 1:1 Premium Profile Cropper state
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [cropperZoom, setCropperZoom] = useState<number>(1);
  const [cropperX, setCropperX] = useState<number>(0);
  const [cropperY, setCropperY] = useState<number>(0);
  const [cropperDragging, setCropperDragging] = useState<boolean>(false);
  const [cropperDragStart, setCropperDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  // Verification field state
  const [addressRaw, setAddressRaw] = useState('');
  const [cityRaw, setCityRaw] = useState('');
  const [postalRaw, setPostalRaw] = useState('');
  const [submittingDoc, setSubmittingDoc] = useState(false);

  // Personal Info Form Edit fields
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedName, setEditedName] = useState(user.fullName);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [editedPhone, setEditedPhone] = useState(user.phone);
  const [editedCountry, setEditedCountry] = useState(user.country);
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  // Add custom funding payment source states
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPmType, setNewPmType] = useState<'card' | 'bank' | 'wallet'>('card');
  const [newPmProvider, setNewPmProvider] = useState('Visa');
  const [newPmCustomProvider, setNewPmCustomProvider] = useState('');
  const [newPmNumber, setNewPmNumber] = useState('');
  const [newPmIsDefault, setNewPmIsDefault] = useState(false);

  // Sync fields when user prop changes
  useEffect(() => {
    setEditedName(user.fullName);
    setEditedEmail(user.email);
    setEditedPhone(user.phone);
    setEditedCountry(user.country);
  }, [user]);

  const handleUpdatePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedName.trim()) {
      showToast('Please specify a valid full name.', 'error');
      return;
    }
    if (!editedEmail.trim() || !editedEmail.includes('@')) {
      showToast('Please specify a valid email address.', 'error');
      return;
    }
    if (!editedPhone.trim()) {
      showToast('Please specify a valid phone number.', 'error');
      return;
    }

    setIsSavingInfo(true);
    setTimeout(() => {
      if (onUpdateUser) {
        onUpdateUser({
          fullName: editedName,
          email: editedEmail,
          phone: editedPhone,
          country: editedCountry
        });
        showToast('Personal info updated successfully!', 'success');
      } else {
        showToast('Error: Personal info updater unconfigured.', 'error');
      }
      setIsSavingInfo(false);
      setIsEditingInfo(false);
    }, 800);
  };

  const handleCancelEditInfo = () => {
    setEditedName(user.fullName);
    setEditedEmail(user.email);
    setEditedPhone(user.phone);
    setEditedCountry(user.country);
    setIsEditingInfo(false);
  };

  // Password reset fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const getVerificationBadge = () => {
    switch (user.verificationStatus) {
      case 'verified':
        return (
          <span className="bg-emerald-500/15 text-emerald-400 text-[8.5px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center shadow-sm uppercase tracking-wider">
            Verified
          </span>
        );
      case 'pending':
        return (
          <span className="bg-amber-500/15 text-amber-400 text-[8.5px] font-black px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center uppercase tracking-wider">
            Pending Address
          </span>
        );
      default:
        return (
          <span className="bg-slate-500/15 text-slate-400 text-[8.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Unverified
          </span>
        );
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressRaw.trim() || !cityRaw.trim() || !postalRaw.trim()) {
      showToast('Please enter complete address credentials.', 'error');
      return;
    }

    setSubmittingDoc(true);
    setTimeout(() => {
      onUpdateVerification({ addressStatus: 'verified' });
      onUpdateUserVerification('verified');
      showToast('Address Verified! Upgrade to Level 2 active.', 'success');
      setSubmittingDoc(false);
      setSubView('root');
    }, 1500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('New password should be at least 6 characters long.', 'error');
      return;
    }
    showToast('Security Password updated successfully!', 'success');
    setSubView('root');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          {subView !== 'root' ? (
            <button
              onClick={() => {
                setSubView('root');
                setIsEditingInfo(false);
              }}
              className="p-1 px-2.5 rounded-full hover:bg-slate-100 text-slate-600 font-bold text-sm bg-slate-50 transition"
            >
              ← Back
            </button>
          ) : (
            <button
              onClick={onBack}
              className="p-1 px-2.5 rounded-full hover:bg-slate-100 text-slate-600 font-bold text-sm bg-slate-50 transition"
            >
              ←
            </button>
          )}
          <span className="font-extrabold text-slate-900 text-sm">
            {subView === 'root' && 'My Profile Settings'}
            {subView === 'verification' && 'Security & Verification'}
            {subView === 'payments' && 'Linked Payment accounts'}
            {subView === 'info' && 'Personal Information'}
            {subView === 'password-modal' && 'Change Secure Password'}
            {subView === 'archived-alerts' && 'Archived Notifications'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        
        {/* ROOT PROFILE LIST */}
        {subView === 'root' && (
          <div className="p-4 space-y-4">
            
             {/* User Info Header Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-5 border border-slate-800 shadow-xl flex items-center justify-between relative overflow-hidden group">
              {/* Subtle background abstract elements */}
              <div className="absolute right-0 top-0 bg-blue-500/10 w-24 h-24 rounded-full translate-x-6 -translate-y-6 blur-md"></div>
              <div className="absolute left-12 bottom-0 bg-indigo-500/5 w-16 h-16 rounded-full translate-y-6 blur-md"></div>
              
              <div className="flex items-center gap-4 relative z-10 w-full justify-between">
                <div className="flex items-center gap-3.5">
                  <div 
                    onClick={() => document.getElementById('profile-pic-uploader')?.click()}
                    className="relative group/avatar cursor-pointer"
                  >
                    <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 font-extrabold text-white flex items-center justify-center text-sm shadow-md shadow-indigo-950/40 uppercase group-hover/avatar:scale-105 transition duration-300 overflow-hidden relative">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        user.fullName.split(' ').map(n=>n[0]).join('')
                      )}
                      
                      {/* Premium Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition duration-200">
                        <Upload className="w-3.5 h-3.5 text-white animate-pulse" />
                        <span className="text-[7.5px] font-black text-white uppercase mt-0.5 tracking-wider font-sans">Update</span>
                      </div>
                    </div>
                    
                    {/* Floating Mini Action Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-indigo-600 p-1.5 rounded-full border border-slate-900 group-hover/avatar:scale-110 active:scale-95 transition duration-300 shadow-md flex items-center justify-center">
                      <Upload className="w-2.5 h-2.5 text-white font-bold" />
                    </div>
                    
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      id="profile-pic-uploader"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') {
                              setCropperImage(reader.result);
                              setCropperZoom(1.0);
                              setCropperX(0);
                              setCropperY(0);
                              showToast('Please adjust and resize your picture to a perfect 1:1 layout.', 'info');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-white flex items-center gap-2 leading-none">
                      <span>{user.fullName}</span>
                      {getVerificationBadge()}
                    </h3>
                    <p className="text-[10px] text-slate-350 font-semibold font-mono tracking-wide">{user.email}</p>
                    <div className="flex items-center gap-1.5 text-[8.5px] text-indigo-200/70 font-bold">
                      <span className="p-0.5 rounded bg-white/10 uppercase text-[7px] tracking-wider px-1">Active Account</span>
                      <span>•</span>
                      <span>{user.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Overview Rows */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none pl-1">
                Account Overview
              </span>

              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 shadow-3xs overflow-hidden">
                <div
                  onClick={() => setSubView('info')}
                  className="flex items-center justify-between p-4.5 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 text-slate-705">
                    <User className="w-4 h-4 text-blue-600 font-bold" />
                    <span className="text-xs font-bold font-sans">Personal Information</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={() => setSubView('verification')}
                  className="flex items-center justify-between p-4.5 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 text-slate-705">
                    <ShieldCheck className="w-4 h-4 text-blue-600 font-bold" />
                    <span className="text-xs font-bold font-sans">Account Security & KYC Verification</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-1.5 py-0.5 rounded">Level 2 Limit</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payments preference details */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none pl-1">
                Payments & Settings
              </span>

              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 shadow-3xs overflow-hidden">
                <div
                  onClick={() => setSubView('payments')}
                  className="flex items-center justify-between p-4.5 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 text-slate-705">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold">Manage Linked Funding accounts</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">({paymentMethods.length})</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={() => setSubView('password-modal')}
                  className="flex items-center justify-between p-4.5 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 text-slate-750">
                    <Key className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold">Update Account Password</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div
                  onClick={() => setSubView('archived-alerts')}
                  className="flex items-center justify-between p-4.5 hover:bg-slate-50 transition cursor-pointer font-sans"
                >
                  <div className="flex items-center gap-3.5 text-slate-750">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold">Archived Notifications</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9.5px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg uppercase">
                      {notifications.filter(n => n.isArchived).length} Archived
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Support section info */}
            <div className="space-y-2">
              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 shadow-3xs overflow-hidden">
                <div
                  onClick={() => showToast('Biometrics updated instantly', 'success')}
                  className="flex items-center justify-between p-4.5"
                >
                  <div className="flex items-center gap-3.5 text-slate-705">
                    <Fingerprint className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold">Biometric Face ID Unlock</span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={verification.biometricEnabled}
                    onChange={(e) => {
                      onUpdateVerification({ biometricEnabled: e.target.checked });
                      showToast(`Face ID biometric unlock ${e.target.checked ? 'Enabled' : 'Disabled'}`, 'success');
                    }}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4.5">
                  <div className="flex items-center gap-3.5 text-slate-705">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold">Two-Factor Authentication (2FA)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={verification.twoFactorEnabled}
                    onChange={(e) => {
                      onUpdateVerification({ twoFactorEnabled: e.target.checked });
                      showToast(`2FA security verification ${e.target.checked ? 'Enabled' : 'Disabled'}`, 'success');
                    }}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none pl-1 block">
                Help & Troubleshooting
              </span>

              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 shadow-3xs overflow-hidden">
                <div
                  onClick={() => {
                    if (onOpenHelp) {
                      onOpenHelp();
                    } else {
                      showToast('Help center loaded', 'info');
                    }
                  }}
                  className="flex items-center justify-between p-4.5 hover:bg-slate-50 transition cursor-pointer animate-fade-in"
                  id="help-center-trigger"
                >
                  <div className="flex items-center gap-3.5 text-slate-705">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold font-sans">Help Center & FAQ Guides</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9.5px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase font-mono leading-none">24/7 ACTIVE</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                onLogout();
                showToast('Logged out of Profile session.', 'info');
              }}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs py-4.5 rounded-2xl border border-rose-100 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of session</span>
            </button>
            
            <p className="text-[10px] text-center text-slate-400 font-semibold uppercase leading-none">
              Client Applet ID: MaalPay-MV-2.4 (Sandbox)
            </p>
          </div>
        )}

        {/* 1. KYC VERIFICATION SCREEN */}
        {subView === 'verification' && (
          <div className="p-4 space-y-4">
            {/* Limit Banner */}
            <div className="bg-indigo-950 rounded-2xl p-4.5 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5">
                <Shield className="w-32 h-32" />
              </div>
              <p className="text-[9px] font-black uppercase text-indigo-300 tracking-wider">KYC Compliance status</p>
              <h3 className="text-sm font-black text-white mt-1">Level 1 Spending Limits Status</h3>
              <p className="text-[10px] text-indigo-200 mt-1.5 leading-normal max-w-sm">
                Address Verification unlocks Level 2 limits, enabling unlimited card pay-ins and remittances up to $10,000 CAD daily.
              </p>
              
              {/* Progress Level bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-[9px] text-indigo-200 font-bold">
                  <span>KYC Progress Checklist</span>
                  <span>{user.verificationStatus === 'verified' ? '100% Verified' : '75% Complete'}</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: user.verificationStatus === 'verified' ? '100%' : '75%' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Compliance Checklist</span>

              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 p-1 shadow-3xs">
                
                {/* ID verified card */}
                <div className="p-3.5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3px]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 leading-none">Government Photo ID</h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">Passport/Driver License submitted successfully</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[8px] font-black border border-emerald-100 rounded">COMPLETE</span>
                </div>

                {/* Selfie checked */}
                <div className="p-3.5 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Check className="w-4 h-4 stroke-[3px]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 leading-none">Biometric Face Check</h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">Automated portrait check matched successfully</p>
                    </div>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[8px] font-black border border-emerald-100 rounded">COMPLETE</span>
                </div>

                {/* Address verified (Conditional Form or complete) */}
                <div className="p-3.5 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        verification.addressStatus === 'verified' ? 'bg-emerald-55 text-emerald-650' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {verification.addressStatus === 'verified' ? <Check className="w-4 h-4 stroke-[3px]" /> : <MapPin className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 leading-none">Residential Address Verifications</h4>
                        <p className="text-[9px] text-slate-400 mt-1">Ontario / Canada residential address ledger</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[8px] font-black border rounded ${
                      verification.addressStatus === 'verified' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {verification.addressStatus === 'verified' ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>

                  {verification.addressStatus !== 'verified' && (
                    <form onSubmit={handleAddressSubmit} className="mt-4 space-y-3 p-3 bg-amber-50/20 rounded-xl border border-slate-100">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500">Street Address</label>
                        <input
                          type="text"
                          required
                          value={addressRaw}
                          onChange={(e) => setAddressRaw(e.target.value)}
                          placeholder="e.g. 100 Queen St W"
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500">City</label>
                          <input
                            type="text"
                            required
                            value={cityRaw}
                            onChange={(e) => setCityRaw(e.target.value)}
                            placeholder="Toronto"
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-500">Postal Code (6-char)</label>
                          <input
                            type="text"
                            required
                            maxLength={7}
                            value={postalRaw}
                            onChange={(e) => setPostalRaw(e.target.value)}
                            placeholder="M5H 2N2"
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingDoc}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] py-2.5 rounded-lg transition"
                      >
                        {submittingDoc ? 'Verifying Sandbox...' : 'Verify Address Details'}
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </div>

            {/* Document Upload panel */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4.5 shadow-2xs space-y-3.5">
              <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5 leading-none">
                <Upload className="w-4 h-4 text-slate-400" />
                <span>Upload Proof of Residency</span>
              </h4>
              <p className="text-[10px] text-slate-400 leading-normal">
                Upload a utility bill, telecom invoice, or bank statement clearly showing your legal name and Canadian address credentials.
              </p>

              <div 
                onClick={() => showToast('Documents added successfully in sandbox!', 'success')}
                className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-slate-50/50 transition"
              >
                <FileText className="w-8 h-8 text-neutral-300" />
                <span className="text-[10px] font-black text-blue-600 underline">Browse files or drag here</span>
                <span className="text-[9px] text-slate-400 font-semibold uppercase">PDF, PNG, JPG (Max 5MB)</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. PAYMENT METHODS LIST */}
        {subView === 'payments' && (
          <div className="p-4 space-y-4 font-sans select-none relative">
            
            {/* Header Block with Add Button */}
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-3xs flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-slate-850 leading-none">Funding Sources</h4>
                <p className="text-[9.5px] text-slate-400 leading-tight">
                  Linked accounts & cards for instant checkouts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewPmType('card');
                  setNewPmProvider('Visa');
                  setNewPmCustomProvider('');
                  setNewPmNumber('');
                  setNewPmIsDefault(false);
                  setShowAddPaymentModal(true);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100/70 text-blue-600 font-extrabold text-[10px] uppercase tracking-wider transition cursor-pointer border border-blue-100 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Link New</span>
              </button>
            </div>

            {/* List of Payment Methods */}
            <div className="grid grid-cols-1 gap-4">
              {paymentMethods.length === 0 ? (
                <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-250 p-6 text-center text-slate-400 text-xs">
                  No linked funding sources found. Add one to complete payments.
                </div>
              ) : (
                paymentMethods.map((pm) => {
                  // Determine premium gradient background based on type & brand
                  let cardBg = "bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-950 text-white shadow-md";
                  const provLower = pm.provider.toLowerCase();
                  
                  if (pm.type === 'card') {
                    if (provLower.includes('visa')) {
                      cardBg = "bg-gradient-to-br from-[#0B1530] via-[#102354] to-[#050C1E] text-white shadow-lg shadow-indigo-950/20";
                    } else if (provLower.includes('mastercard')) {
                      cardBg = "bg-gradient-to-br from-[#1E1E24] via-[#2D2D35] to-[#121215] text-white shadow-lg shadow-zinc-950/25";
                    } else {
                      cardBg = "bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-black text-white shadow-lg shadow-indigo-950/20";
                    }
                  } else if (pm.type === 'bank') {
                    if (provLower.includes('rbc') || provLower.includes('royal')) {
                      cardBg = "bg-gradient-to-br from-[#003B7C] via-[#005ABF] to-[#002652] text-white shadow-lg shadow-blue-950/20";
                    } else {
                      cardBg = "bg-gradient-to-br from-[#0F3C3C] via-[#1A5C5C] to-[#0A2626] text-white shadow-lg shadow-emerald-950/20";
                    }
                  } else {
                    // Digital wallet
                    if (provLower.includes('apple')) {
                      cardBg = "bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-white shadow-lg shadow-black/30 border border-zinc-800";
                    } else {
                      cardBg = "bg-gradient-to-br from-[#0A0D1A] via-[#121A30] to-[#05060D] text-white shadow-lg shadow-slate-950/35 border border-slate-900";
                    }
                  }

                  return (
                    <div
                      key={pm.id}
                      onClick={() => {
                        if (!pm.isDefault && onSetDefaultPaymentMethod) {
                          onSetDefaultPaymentMethod(pm.id);
                          showToast(`${pm.provider} is now your primary funding source.`, 'success');
                        }
                      }}
                      className={`relative overflow-hidden aspect-[1.58/1] w-full rounded-2xl p-5 flex flex-col justify-between select-none ${cardBg} border border-white/5 active:scale-[0.98] transition-all duration-100 ease-out cursor-pointer group`}
                    >
                      {/* Glossy radial overlay for premium shine */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                      
                      {/* Card branding vector curves */}
                      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/2 rounded-full blur-2xl pointer-events-none"></div>

                      {/* Header row: Card Typology & Logo */}
                      <div className="flex items-start justify-between relative z-10">
                        <div className="space-y-0.5">
                          <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-white/50 block leading-none">
                            {pm.type === 'card' ? 'Secure Card' : pm.type === 'wallet' ? 'Digital Wallet' : 'Direct ACH Debit'}
                          </span>
                          <span className="text-xs font-black text-white tracking-tight">
                            {pm.brand || pm.provider}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getProviderLogo(pm.provider, { className: 'w-10 h-7 object-contain bg-white/5 border border-white/10 rounded-lg p-0.5' })}
                        </div>
                      </div>

                      {/* Middle Row: EMV Gold Chip + Waves/Wireless graphic */}
                      <div className="flex items-center gap-3 relative z-10">
                        {pm.type === 'card' && (
                          <div className="w-8 h-6 rounded-md bg-gradient-to-tr from-amber-200 via-yellow-100 to-amber-300 p-0.5 flex flex-col justify-between shadow-[0_2px_8px_rgba(251,191,36,0.15)] relative overflow-hidden">
                            <div className="flex-1 grid grid-cols-3 gap-0.5 opacity-40">
                              <div className="border-r border-amber-800/30"></div>
                              <div className="border-r border-amber-800/30"></div>
                              <div></div>
                            </div>
                            <div className="h-[1px] bg-amber-800/15 w-full my-0.5"></div>
                            <div className="flex-1 grid grid-cols-3 gap-0.5 opacity-40">
                              <div className="border-r border-amber-800/30"></div>
                              <div className="border-r border-amber-800/30"></div>
                              <div></div>
                            </div>
                          </div>
                        )}
                        
                        {pm.type === 'bank' && (
                          <div className="w-8 h-6 rounded-md bg-white/10 flex items-center justify-center border border-white/15">
                            <Landmark className="w-4 h-4 text-white/80" />
                          </div>
                        )}

                        {pm.type === 'wallet' && (
                          <div className="w-8 h-6 rounded-md bg-white/10 flex items-center justify-center border border-white/15">
                            <Smartphone className="w-4 h-4 text-white/80" />
                          </div>
                        )}

                        {pm.type === 'card' && (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/40 stroke-current fill-none stroke-2">
                            <path d="M5 8c.1.5.2 1 .4 1.5M7 6c.2 1 .4 2 .8 3M9 4c.3 1.2.6 2.4 1 3.5M11 2c.4 1.5.8 3 1.2 4.5" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>

                      {/* Content Row: Masked Numbers */}
                      <div className="relative z-10">
                        {pm.type === 'card' ? (
                          <p className="text-[14px] font-mono font-medium tracking-[0.25em] text-white">
                            <span className="opacity-45 text-[11px] mr-1.5 font-sans">••••  ••••  ••••</span> 
                            <span className="font-semibold text-white/95">{pm.last4 || '1122'}</span>
                          </p>
                        ) : pm.type === 'wallet' ? (
                          <p className="text-xs font-mono font-medium tracking-wide text-white/90">
                            ID: <span className="text-white/70">••••••</span>{pm.last4 || '0199'}
                          </p>
                        ) : (
                          <p className="text-xs font-mono font-medium tracking-[0.05em] text-white flex items-center gap-1">
                            <span className="text-white/45 uppercase text-[8px] font-bold">Transit</span>
                            <span>{pm.last4 ? `00012-321-${pm.last4}` : '00012-321-4'}</span>
                          </p>
                        )}
                      </div>

                      {/* Footer Row: Account Details & Action Buttons */}
                      <div className="flex items-end justify-between relative z-10 border-t border-white/10 pt-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[7px] font-bold uppercase tracking-wider text-white/40 block leading-none">
                            {pm.type === 'bank' ? 'Account Holder' : 'Cardholder'}
                          </span>
                          <span className="text-[9px] font-extrabold uppercase tracking-wide text-white/90 block leading-none truncate max-w-[170px]">
                            {user.fullName || 'Valued Customer'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {pm.type === 'card' && (
                            <div className="text-right mr-1.5">
                              <span className="text-[6.5px] font-bold uppercase tracking-wider text-white/35 block leading-none">Expires</span>
                              <span className="text-[9px] font-mono font-bold text-white/80 block mt-0.5 leading-none">12/29</span>
                            </div>
                          )}

                          {pm.isDefault ? (
                            <span className="flex items-center gap-1 text-[7.5px] bg-emerald-500/20 text-emerald-300 font-extrabold px-1.5 py-1 rounded-full border border-emerald-400/30 uppercase tracking-widest leading-none">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>Default</span>
                            </span>
                          ) : (
                            <span className="transition duration-100 opacity-0 group-hover:opacity-100 group-active:opacity-100 text-[7px] bg-white/10 text-white/70 font-extrabold px-1.5 py-1 rounded-full border border-white/5 uppercase tracking-widest leading-none">
                              Use Primary
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onDeletePaymentMethod) {
                                if (paymentMethods.length <= 1) {
                                  showToast('You must keep at least one active funding source for your account.', 'error');
                                  return;
                                }
                                if (confirm(`Are you sure you want to unlink this source (ending in ${pm.last4})?`)) {
                                  onDeletePaymentMethod(pm.id);
                                  showToast(`${pm.provider} has been unlinked successfully.`, 'info');
                                }
                              }
                            }}
                            className="w-6 h-6 rounded-lg bg-black/45 hover:bg-red-600/90 text-white/70 hover:text-white border border-white/10 flex items-center justify-center transition cursor-pointer z-20 shadow-xs"
                            title="Unlink Card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <p className="text-[9px] leading-normal font-bold p-1 text-slate-400 text-center uppercase tracking-wider">
              Linked sources are encrypted and secured under Bank-Grade AES-256
            </p>

            {/* PREMIUM ADD PAYMENT METHOD OVERLAY SCREEN */}
            {showAddPaymentModal && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col justify-between p-6 select-none animate-fade-in text-slate-100">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest block">System Integration</span>
                    <span className="text-sm font-black text-white block">Link Funding Source</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowAddPaymentModal(false)}
                    className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-4">
                  
                  {/* Select Method Type */}
                  <div className="space-y-1.5ClassName">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Select Funding Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'card', name: 'Credit/Debit', desc: 'Secure Cards' },
                        { id: 'bank', name: 'Bank Transfer', desc: 'ACH/EFT Direct' },
                        { id: 'wallet', name: 'Digital Wallet', desc: 'Web Accounts' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            const val = item.id as 'card' | 'bank' | 'wallet';
                            setNewPmType(val);
                            // Autofill reasonable provider defaults
                            if (val === 'card') setNewPmProvider('Visa');
                            else if (val === 'bank') setNewPmProvider('RBC');
                            else setNewPmProvider('Google Pay');
                          }}
                          className={`p-2.5 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                            newPmType === item.id 
                              ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                              : 'bg-slate-900/60 border-slate-800/80 text-slate-305'
                          }`}
                        >
                          <span className="text-[10px] font-black">{item.name}</span>
                          <span className="text-[8px] text-slate-400 leading-none mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brand Presets (No Generic shit - High Fidelity SVGs!) */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      Select official brand name
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {newPmType === 'card' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setNewPmProvider('Visa')}
                            className={`p-2 rounded-xl flex items-center gap-2 border transition ${
                              newPmProvider === 'Visa' ? 'bg-slate-900 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            {getProviderLogo('Visa', { className: 'w-6 h-6' })}
                            <span className="text-[10.5px] font-bold">Visa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewPmProvider('Mastercard')}
                            className={`p-2 rounded-xl flex items-center gap-2 border transition ${
                              newPmProvider === 'Mastercard' ? 'bg-slate-900 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            {getProviderLogo('Mastercard', { className: 'w-6 h-6' })}
                            <span className="text-[10.5px] font-bold">Mastercard</span>
                          </button>
                        </>
                      )}

                      {newPmType === 'bank' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setNewPmProvider('RBC')}
                            className={`p-2 rounded-xl flex items-center gap-2 border transition ${
                              newPmProvider === 'RBC' ? 'bg-slate-900 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            {getProviderLogo('RBC', { className: 'w-6 h-6' })}
                            <span className="text-[10.5px] font-bold">RBC (Royal Bank)</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewPmProvider('Custom')}
                            className={`p-2 rounded-xl flex items-center gap-2 border transition ${
                              newPmProvider === 'Custom' ? 'bg-slate-900 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[8px] text-indigo-400">?</div>
                            <span className="text-[10.5px] font-bold">Other Bank</span>
                          </button>
                        </>
                      )}

                      {newPmType === 'wallet' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setNewPmProvider('Apple Pay')}
                            className={`p-2 rounded-xl flex items-center gap-2 border transition ${
                              newPmProvider === 'Apple Pay' ? 'bg-slate-900 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            {getProviderLogo('Apple Pay', { className: 'w-6 h-6' })}
                            <span className="text-[10.5px] font-bold">Apple Pay</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewPmProvider('Google Pay')}
                            className={`p-2 rounded-xl flex items-center gap-2 border transition ${
                              newPmProvider === 'Google Pay' ? 'bg-slate-900 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            {getProviderLogo('Google Pay', { className: 'w-6 h-6' })}
                            <span className="text-[10.5px] font-bold">Google Pay</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Custom Provider (if needed) */}
                  {newPmProvider === 'Custom' && (
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Custom Bank/Provider Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Scotiabank, Chase, TD"
                        value={newPmCustomProvider}
                        onChange={(e) => setNewPmCustomProvider(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition font-sans"
                      />
                    </div>
                  )}

                  {/* Account / card details */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      {newPmType === 'card' ? 'Card Number (16 Digits)' : newPmType === 'wallet' ? 'Connected Phone/Email' : 'Account or Transit Number'}
                    </label>
                    <input
                      type="text"
                      placeholder={newPmType === 'card' ? 'e.g. 4111 2222 3333 4444' : newPmType === 'wallet' ? 'e.g. name@wallet.me or +1 416-555-0199' : 'e.g. 00012-321-4'}
                      value={newPmNumber}
                      onChange={(e) => setNewPmNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-indigo-200 focus:outline-none focus:border-indigo-500 transition font-mono tracking-wider"
                    />
                  </div>

                  {/* Real-time brand logo preview inside the add form */}
                  <div className="flex items-center gap-3 bg-slate-900 border border-slate-800/80 p-3.5 rounded-2xl">
                    {getProviderLogo(newPmProvider === 'Custom' ? (newPmCustomProvider || 'Other') : newPmProvider, { className: 'w-10 h-10' })}
                    <div className="space-y-0.5">
                      <h5 className="text-[9px] font-extrabold uppercase text-indigo-400 tracking-wider">Branding Preview</h5>
                      <p className="text-xs font-black text-white leading-none">
                        {newPmProvider === 'Custom' ? (newPmCustomProvider || 'Custom Provider') : newPmProvider}
                      </p>
                      <p className="text-[9px] text-slate-400 font-mono leading-none">
                        •••• •••• •••• {newPmNumber ? newPmNumber.replace(/\D/g, '').slice(-4) || '4444' : '4444'}
                      </p>
                    </div>
                  </div>

                  {/* Set default option */}
                  <div className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold text-white block">Set as Primary</span>
                      <span className="text-[8.5px] text-slate-400 block max-w-xs">Instantly selected first when sending currency.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={newPmIsDefault}
                      onChange={(e) => setNewPmIsDefault(e.target.checked)}
                      className="w-4 h-4 accent-indigo-500 cursor-pointer rounded bg-slate-800"
                    />
                  </div>

                </div>

                {/* Footer Controls */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/60 bg-slate-950/60">
                  <button
                    type="button"
                    onClick={() => setShowAddPaymentModal(false)}
                    className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-350 font-black text-xs transition uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const finalProviderName = newPmProvider === 'Custom' ? (newPmCustomProvider || 'Other Bank') : newPmProvider;
                      const digitsOnly = newPmNumber.replace(/\D/g, '');
                      const last4 = digitsOnly ? digitsOnly.slice(-4) : '2468';

                      if (onAddPaymentMethod) {
                        onAddPaymentMethod({
                          type: newPmType,
                          provider: finalProviderName,
                          brand: `${finalProviderName} ${newPmType === 'card' ? 'Card' : newPmType === 'wallet' ? 'Wallet' : 'Account'}`,
                          last4,
                          isDefault: newPmIsDefault
                        });
                        showToast(`Linked ${finalProviderName} successfully!`, 'success');
                      }
                      setShowAddPaymentModal(false);
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs transition-all duration-300 uppercase tracking-wider cursor-pointer shadow-lg shadow-indigo-950/45 flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Authorize Source</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}
        
        {/* 3. PERSONAL INFORMATION */}
        {subView === 'info' && (
          <div className="p-4 space-y-4 text-xs font-semibold">
            {!isEditingInfo ? (
              <div className="space-y-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-3xs space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-400">Legal Full Name</span>
                    <span className="font-black text-slate-800">{user.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-400">Main Email</span>
                    <span className="font-bold text-slate-800">{user.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-400">Phone Contact</span>
                    <span className="font-bold text-slate-800 font-mono">{user.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-slate-400">Residence Country</span>
                    <span className="font-black text-slate-800">{user.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Created At</span>
                    <span className="font-bold text-slate-650 font-mono">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditingInfo(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Edit Personal Details</span>
                  </button>
                </div>
                
                <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-3.5 flex gap-2.5 text-slate-700">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-[10px] text-slate-500 leading-normal">
                    This sandbox profile supports real-time editing. Modifying your contact details instantly adjusts active remittance billing information.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdatePersonalInfo} className="space-y-4 animate-fade-in">
                <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-3xs space-y-4">
                  <h4 className="text-xs font-black text-slate-800 leading-none pb-1 border-b border-slate-50">
                    Update profile credentials
                  </h4>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-550">Legal Full Name</label>
                    <input
                      type="text"
                      required
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="e.g. Samuel Rogers"
                      className="w-full p-3 bg-slate-50 border border-slate-205 rounded-xl outline-none font-bold text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-550">Main Email</label>
                    <input
                      type="email"
                      required
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      placeholder="e.g. friend@example.com"
                      className="w-full p-3 bg-slate-50 border border-slate-205 rounded-xl outline-none font-bold text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-550">Phone Contact</label>
                    <input
                      type="tel"
                      required
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      placeholder="e.g. +1 416-555-0199"
                      className="w-full p-3 bg-slate-50 border border-slate-205 rounded-xl outline-none font-bold text-slate-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-550">Residence Country</label>
                    <select
                      value={editedCountry}
                      onChange={(e) => setEditedCountry(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-205 rounded-xl outline-none font-bold text-slate-800 focus:border-blue-600 cursor-pointer"
                    >
                      <option value="Canada">Canada 🇨🇦</option>
                      <option value="United States">United States 🇺🇸</option>
                      <option value="United Kingdom">United Kingdom 🇬🇧</option>
                      <option value="Australia">Australia 🇦🇺</option>
                      <option value="India">India 🇮🇳</option>
                      <option value="Philippines">Philippines 🇵🇭</option>
                      <option value="Pakistan">Pakistan 🇵🇰</option>
                      <option value="Bangladesh">Bangladesh 🇧🇩</option>
                      <option value="Nepal">Nepal 🇳🇵</option>
                      <option value="Nigeria">Nigeria 🇳🇬</option>
                      <option value="Ghana">Ghana 🇬🇭</option>
                      <option value="Somalia">Somalia 🇸🇴</option>
                      <option value="Kenya">Kenya 🇰🇪</option>
                      <option value="Ethiopia">Ethiopia 🇪🇹</option>
                      <option value="Germany">Germany 🇩🇪</option>
                      <option value="France">France 🇫🇷</option>
                      <option value="Italy">Italy 🇮🇹</option>
                      <option value="Spain">Spain 🇪🇸</option>
                      <option value="Japan">Japan 🇯🇵</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancelEditInfo}
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-bold transition cursor-pointer text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingInfo}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3.5 font-black transition shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isSavingInfo ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 4. PASSWORD MODAL INLINE */}
        {subView === 'password-modal' && (
          <form onSubmit={handlePasswordSubmit} className="p-5 space-y-4 text-xs font-semibold">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500">Current Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••"
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500">New Password (min 6 chars)</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••"
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl outline-none"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setSubView('root')}
                className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl p-3.5 font-bold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3.5 font-black transition shadow-xs"
              >
                Save New Password
              </button>
            </div>
          </form>
        )}

        {/* 5. ARCHIVED NOTIFICATIONS VIEW */}
        {subView === 'archived-alerts' && (
          <div className="p-4 space-y-4 font-sans">
            {notifications.filter(n => n.isArchived).length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center flex flex-col items-center justify-center space-y-3.5 shadow-3xs">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-700">No archived alerts</h4>
                  <p className="text-[10px] text-slate-400 max-w-sm leading-normal">
                    Notifications you archive by swiping right will appear here. You can restore them to active alerts or delete them permanently.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center pl-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    Archived Logs ({notifications.filter(n => n.isArchived).length})
                  </span>
                </div>

                <div className="space-y-3">
                  {notifications.filter(n => n.isArchived).map((not) => (
                    <div
                      key={not.id}
                      className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-3xs hover:border-slate-200 transition relative"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-black text-slate-800 leading-tight">
                          {not.title}
                        </h4>
                        <span className="text-[9px] text-slate-400 font-semibold font-mono">
                          {new Date(not.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-1 leading-normal font-medium">
                        {not.message}
                      </p>
                      
                      <div className="flex justify-end gap-2 mt-4.5 pt-3.5 border-t border-slate-50/80">
                        <button
                          type="button"
                          onClick={() => {
                            onRestoreNotification?.(not.id);
                            showToast('Notification restored to active alerts.', 'success');
                          }}
                          className="text-[10px] font-black text-blue-600 hover:bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteNotification?.(not.id);
                            showToast('Notification deleted permanently.', 'error');
                          }}
                          className="text-[10px] font-black text-rose-600 hover:bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* PREMIUM 1:1 PROFILE IMAGE CROPPER & RESIZER SCREEN OVERLAY */}
      {cropperImage && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col justify-between p-6 select-none animate-fade-in font-sans">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/60">
            <div className="space-y-0.5">
              <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block">Adjustment Studio</span>
              <span className="text-sm font-black text-white block">Crop & Fit Profile Picture</span>
            </div>
            <button 
              type="button"
              onClick={() => setCropperImage(null)}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Interactive Preview Container */}
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <p className="text-[10px] text-slate-400 font-bold mb-4 text-center max-w-xs">
              Drag the photo to reposition and use the zoom slider to align exactly inside the circle.
            </p>

            {/* Crop Circle Frame */}
            <div 
              className="w-56 h-56 rounded-full border-4 border-indigo-500 shadow-2xl shadow-indigo-500/15 bg-slate-950 overflow-hidden relative cursor-move"
              onMouseDown={(e) => {
                setCropperDragging(true);
                setCropperDragStart({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                if (cropperDragging) {
                  const dx = e.clientX - cropperDragStart.x;
                  const dy = e.clientY - cropperDragStart.y;
                  setCropperX(prev => prev + dx);
                  setCropperY(prev => prev + dy);
                  setCropperDragStart({ x: e.clientX, y: e.clientY });
                }
              }}
              onMouseUp={() => setCropperDragging(false)}
              onMouseLeave={() => setCropperDragging(false)}
              onTouchStart={(e) => {
                setCropperDragging(true);
                if (e.touches[0]) {
                  setCropperDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                }
              }}
              onTouchMove={(e) => {
                if (cropperDragging && e.touches[0]) {
                  const dx = e.touches[0].clientX - cropperDragStart.x;
                  const dy = e.touches[0].clientY - cropperDragStart.y;
                  setCropperX(prev => prev + dx);
                  setCropperY(prev => prev + dy);
                  setCropperDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                }
              }}
              onTouchEnd={() => setCropperDragging(false)}
            >
              {/* Live Transformed Image */}
              <img 
                src={cropperImage} 
                className="absolute pointer-events-none"
                style={{
                  transform: `translate(calc(-50% + ${cropperX}px), calc(-50% + ${cropperY}px)) scale(${cropperZoom})`,
                  top: '50%',
                  left: '50%',
                  maxWidth: '100%',
                  height: 'auto',
                  minWidth: '100%',
                }}
                referrerPolicy="no-referrer"
              />

              {/* Aesthetic Target Reticle Overlay */}
              <div className="absolute inset-0 border border-white/20 rounded-full pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 border border-dashed border-white/10 rounded-full"></div>
              </div>
            </div>

             {/* Indicator Badge */}
             <div className="mt-3.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 text-[9px] font-semibold text-slate-400 font-mono">
               Alignment: X: {cropperX}px, Y: {cropperY}px
             </div>
          </div>

          {/* Scale Slider and Controls */}
          <div className="space-y-5 bg-slate-900/60 p-5 rounded-3xl border border-slate-800">
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                  🔍 Zoom Factor: <span className="text-indigo-400 font-mono">{cropperZoom.toFixed(1)}x</span>
                </span>
                <button 
                  type="button"
                  onClick={() => { setCropperX(0); setCropperY(0); setCropperZoom(1.0); }}
                  className="text-[8.5px] font-black uppercase text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                >
                  Reset Center
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-500">1x</span>
                <input 
                  type="range" 
                  min="1.0" 
                  max="4.0" 
                  step="0.05"
                  value={cropperZoom}
                  onChange={(e) => setCropperZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-indigo-500 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                />
                <span className="text-[10px] font-bold text-indigo-405">4x</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setCropperImage(null)}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-black text-xs transition uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const img = new Image();
                  img.src = cropperImage;
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 300;
                    canvas.height = 300;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.fillStyle = "#000000";
                      ctx.fillRect(0, 0, 300, 300);

                      ctx.save();
                      // translate to center of destination crop circle
                      ctx.translate(150, 150);
                      // translate by absolute drag distance scaled to the 300px canvas
                      ctx.translate(cropperX * (300 / 224), cropperY * (300 / 224));
                      // apply scale
                      ctx.scale(cropperZoom, cropperZoom);

                      const w = img.width;
                      const h = img.height;
                      let dw = 300;
                      let dh = 300;
                      if (w > h) {
                        dw = 300 * (w / h);
                      } else if (h > w) {
                        dh = 300 * (h / w);
                      }

                      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
                      ctx.restore();

                      const croppedResult = canvas.toDataURL('image/jpeg', 0.9);
                      if (onUpdateUser) {
                        onUpdateUser({ avatar: croppedResult });
                        showToast('Profile image resized & updated successfully!', 'success');
                      }
                      setCropperImage(null);
                    }
                  };
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs transition-all duration-300 uppercase tracking-wider cursor-pointer shadow-lg shadow-indigo-950/45 flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply & Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
