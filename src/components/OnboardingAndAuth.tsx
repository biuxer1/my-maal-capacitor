/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Zap, TrendingUp, Globe, Eye, EyeOff, Mail, Phone, Lock, ChevronDown, Check, ArrowRight } from 'lucide-react';
import { translate } from '../translations';

interface OnboardingAndAuthProps {
  currentView: 'onboarding' | 'login-signup';
  onNavigate: (view: 'onboarding' | 'login-signup' | 'dashboard') => void;
  onLoginSuccess: (fullName: string, email: string, phone: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export function OnboardingAndAuth({
  currentView,
  onNavigate,
  onLoginSuccess,
  showToast,
  language,
  setLanguage
}: OnboardingAndAuthProps) {
  // Onboarding state
  const [showLangMenu, setShowLangMenu] = useState(false);
  
  // Auth state
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  
  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const languages = ['English', 'Español', 'Français', 'Tagalog', 'Hindi', 'Arabic'];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'email') {
      if (!email.trim() || !email.includes('@')) {
        showToast(translate('enterValidEmail', language), 'error');
        return;
      }
    } else {
      if (!phoneNumber.trim() || phoneNumber.length < 8) {
        showToast(translate('enterValidPhone', language), 'error');
        return;
      }
    }

    if (password.length < 6) {
      showToast(translate('passwordLengthMsg', language), 'error');
      return;
    }

    // Success login
    const resolvedName = email.split('@')[0] || 'User';
    const formattedName = resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1);
    onLoginSuccess(
      formattedName,
      loginMethod === 'email' ? email : 'user@example.com',
      loginMethod === 'phone' ? phoneNumber : '+1 (416) 555-0199'
    );
    showToast(translate('loggedIn', language), 'success');
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast(translate('nameRequired', language), 'error');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      showToast(translate('enterValidEmail', language), 'error');
      return;
    }
    if (!signupPhone.trim()) {
      showToast(translate('phoneRequired', language), 'error');
      return;
    }
    if (password.length < 6) {
      showToast(translate('passwordLengthMsg', language), 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast(translate('passwordsMismatch', language), 'error');
      return;
    }

    // Success sign up
    onLoginSuccess(fullName, signupEmail, signupPhone);
    showToast(translate('accCreated', language), 'success');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      showToast(translate('enterValidEmail', language), 'error');
      return;
    }
    showToast(`Password reset link sent to ${forgotEmail}`, 'success');
    setShowForgotModal(false);
    setForgotEmail('');
  };

  const handleSocialLogin = (provider: string) => {
    showToast(`${provider} login will be connected later in production.`, 'info');
  };

  if (currentView === 'onboarding') {
    return (
      <div 
        className="flex flex-col h-full bg-slate-50 relative select-none"
        dir={language === 'Arabic' ? 'rtl' : 'ltr'}
      >
        {/* Top Header & Language Selector */}
        <div className="flex items-center justify-between p-4">
          <span className="text-slate-900 text-base font-extrabold tracking-tight">
            Maal<span className="text-emerald-500 font-medium">Pay</span>
          </span>
          
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              id="lang-btn"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
 
            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-36 rounded-xl border border-slate-100 bg-white shadow-lg py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                      showToast(`Language changed to ${lang}`, 'success');
                    }}
                    className="flex items-center justify-between w-full px-3 py-2 text-left text-xs font-medium text-slate-800 hover:bg-slate-50 transition"
                  >
                    <span>{lang}</span>
                    {language === lang && <Check className="w-3 h-3 text-blue-600 font-bold" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
 
        {/* Hero Section */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-center space-y-2 mt-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 leading-tight">
                {translate('sendMoneyAroundWorld', language)}
              </h1>
              <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
                {translate('globalRemittancesIntro', language)}
              </p>
            </div>
 
            {/* Glowing Globe Visual Area */}
            <div className="relative flex items-center justify-center py-6">
              <div className="absolute w-44 h-44 bg-blue-100 rounded-full blur-2xl opacity-75 animate-pulse"></div>
              <div className="relative w-40 h-40 flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full shadow-xl shadow-blue-200/50">
                <svg className="w-28 h-28 text-white/95 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                  <path d="M2 12h20"/>
                </svg>
                {/* Floating flag elements */}
                <span className="absolute top-2 left-4 text-2xl animate-bounce" style={{ animationDelay: '0.1s' }}>🇮🇳</span>
                <span className="absolute top-4 right-4 text-2xl animate-pulse" style={{ animationDelay: '0.3s' }}>🇵🇭</span>
                <span className="absolute bottom-4 left-6 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>🇳🇬</span>
                <span className="absolute bottom-2 right-4 text-2xl animate-bounce" style={{ animationDelay: '0.7s' }}>🇵🇰</span>
              </div>
            </div>
 
            {/* Feature Cards Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-100 shadow-3xs flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1.5">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-[10px] sm:text-[11px] font-black text-slate-800 leading-tight">{translate('fastDelivery', language)}</h3>
                <p className="text-[8.5px] text-slate-400 mt-0.5 leading-tight">{translate('instantTransfers', language)}</p>
              </div>
 
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-100 shadow-3xs flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-[10px] sm:text-[11px] font-black text-slate-800 leading-tight">{translate('greatRates', language)}</h3>
                <p className="text-[8.5px] text-slate-400 mt-0.5 leading-tight">{translate('saveOnRates', language)}</p>
              </div>
 
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-100 shadow-3xs flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <h3 className="text-[10px] sm:text-[11px] font-black text-slate-800 leading-tight">{translate('secure', language)}</h3>
                <p className="text-[8.5px] text-slate-400 mt-0.5 leading-tight">{translate('fullyEncrypted', language)}</p>
              </div>
            </div>
          </div>
 
          {/* Action Buttons */}
          <div className="space-y-2.5 mt-6">
            <button
              onClick={() => {
                setAuthTab('signup');
                onNavigate('login-signup');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4.5 rounded-2xl shadow-md hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{translate('getStarted', language)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setAuthTab('login');
                onNavigate('login-signup');
              }}
              className="w-full bg-white hover:bg-slate-100 text-slate-700 font-extrabold text-sm py-4.5 rounded-2xl border border-slate-200 transition cursor-pointer"
            >
              {translate('signIn', language)}
            </button>
            
            <p className="text-[9px] font-semibold text-slate-400 text-center uppercase tracking-wider">
              {translate('licensedSandbox', language)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Auth Screen (Log In & Sign Up)
  return (
    <div 
      className="flex flex-col h-full bg-slate-50 relative"
      dir={language === 'Arabic' ? 'rtl' : 'ltr'}
    >
      {/* Top Bar */}
      <div className="flex items-center gap-2 p-4">
        <button
          onClick={() => onNavigate('onboarding')}
          className="p-1 px-2.5 rounded-full hover:bg-slate-200 text-slate-600 font-bold text-sm bg-slate-100 transition"
        >
          {language === 'Arabic' ? '← رجوع' : '← Back'}
        </button>
        <span className="font-extrabold text-slate-900 text-sm">
          {authTab === 'login' ? translate('login', language) : translate('signup', language)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 w-full">
        {/* Brand identity */}
        <div className="flex flex-col items-center justify-center py-6 mt-1">
          <div className="w-15 h-15 shadow-xs bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 font-black" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-3 font-sans">
            {authTab === 'login' ? translate('login', language) : translate('signup', language)}
          </h2>
          <p className="text-xs font-semibold text-slate-400">
            {translate('licensedSandbox', language)}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center mb-6">
          <button
            onClick={() => setAuthTab('login')}
            className={`flex-1 py-3 text-xs font-black rounded-xl transition ${
              authTab === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {translate('login', language)}
          </button>
          <button
            onClick={() => setAuthTab('signup')}
            className={`flex-1 py-3 text-xs font-black rounded-xl transition ${
              authTab === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {translate('signup', language)}
          </button>
        </div>

        {/* LOGIN FORM */}
        {authTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Login Method Toggle */}
            <div className="flex border-b border-slate-200 pb-1 gap-4">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`py-1.5 text-xs font-extrabold border-b-2 transition ${
                  loginMethod === 'email' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
                }`}
              >
                {language === 'Arabic' ? 'البريد الإلكتروني' : 'Use Email Address'}
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`py-1.5 text-xs font-extrabold border-b-2 transition ${
                  loginMethod === 'phone' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
                }`}
              >
                {language === 'Arabic' ? 'رقم الهاتف' : 'Use Phone Number'}
              </button>
            </div>

            {/* Email Field */}
            {loginMethod === 'email' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{translate('emailAddress', language)}</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                />
              </div>
            ) : (
              /* Phone Field */
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{translate('phoneNumber', language)}</span>
                </label>
                <div className="flex gap-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500">
                    🇨🇦 +1
                  </div>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 p-4 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{translate('password', language)}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  {translate('forgotPassword', language)}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pr-11 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4.5 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {translate('login', language)}
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {authTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">{translate('fullName', language)}</label>
              <input
                type="text"
                placeholder="Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none transition"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">{translate('emailAddress', language)}</label>
              <input
                type="email"
                placeholder="name@email.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none transition"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">{translate('phoneNumber', language)}</label>
              <div className="flex gap-2">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500">
                  🇨🇦 +1
                </div>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  className="flex-1 p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">{translate('password', language)}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 pr-11 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">{translate('confirmPassword', language)}</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3.5 pr-11 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Continue */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm py-4.5 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer"
            >
              {translate('signup', language)}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Or log in with
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="flex items-center justify-center p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.55 14.96 1 12 1 7.37 1 3.42 3.66 1.48 7.55l3.83 2.97C6.26 7.4 8.89 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.46-1.1 2.69-2.33 3.51l3.63 2.82c2.12-1.95 3.35-4.83 3.35-8.44z" />
              <path fill="#FBBC05" d="M5.31 14.92c-.24-.72-.37-1.5-.37-2.3c0-.8.13-1.58.37-2.3L1.48 7.55C.54 9.42 0 11.53 0 13.8s.54 4.38 1.48 6.25l3.83-2.98l.001-.15z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.63-2.82c-1.01.68-2.3 1.09-3.96 1.09-3.11 0-5.74-2.36-6.69-5.48l-3.83 2.97C3.42 20.34 7.37 23 12 23y" />
            </svg>
          </button>
          
          <button
            onClick={() => handleSocialLogin('Apple')}
            className="flex items-center justify-center p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.72-1.16 1.86-1.01 2.98 1.11.08 2.25-.57 2.94-1.41z"/>
            </svg>
          </button>
          
          <button
            onClick={() => handleSocialLogin('Facebook')}
            className="flex items-center justify-center p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer"
          >
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </button>
        </div>

        {/* Security Message */}
        <div className="bg-blue-50/60 rounded-2xl border border-blue-100 p-4 mt-6 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-slate-800">State-of-the-Art Security</h4>
            <p className="text-[10px] text-slate-500 leading-normal">
              Every connection is encrypted with Bank-Grade security metrics. Your credentials are safe, and compliance rules are fully active.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full p-6 space-y-4 animate-slide-up max-w-md mx-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900">Reset Your Password</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 font-bold hover:text-slate-600 bg-slate-100 rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Enter your email address and we will immediately trigger a sandbox password reset link.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-1 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3.5 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3.5 rounded-xl transition"
                >
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
