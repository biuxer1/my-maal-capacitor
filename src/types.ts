/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  createdAt: string;
  avatar?: string;
}

export interface Recipient {
  id: string;
  userId: string;
  fullName: string;
  country: string;
  currency: string;
  deliveryMethod: 'Bank Transfer' | 'Mobile Wallet' | 'Cash Pickup';
  bankName?: string;
  accountNumber?: string;
  phoneNumber?: string;
  relationship: string;
  purpose: string;
  createdAt: string;
}

export interface Transfer {
  id: string;
  userId: string;
  recipientId: string;
  recipientName: string;
  country: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  receiveAmount: number;
  exchangeRate: number;
  fee: number;
  promoDiscount: number;
  totalCharge: number;
  paymentMethod: string;
  deliveryMethod: string;
  status: 'Pending' | 'Payment Received' | 'Processing' | 'Money Sent' | 'Delivered' | 'Failed';
  transactionReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank' | 'wallet';
  provider: string; // e.g., "Visa", "Mastercard", "RBC", "Apple Pay", "Google Pay"
  brand?: string;
  last4?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'transfer' | 'verification' | 'promo' | 'system';
  isRead: boolean;
  createdAt: string;
  isArchived?: boolean;
}

export interface Verification {
  id: string;
  userId: string;
  identityStatus: 'verified' | 'pending' | 'unverified';
  addressStatus: 'verified' | 'pending' | 'unverified';
  documentStatus: 'verified' | 'pending' | 'unverified';
  selfieStatus: 'verified' | 'pending' | 'unverified';
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  transactionPinEnabled: boolean;
}

export type ScreenId =
  | 'onboarding'
  | 'login-signup'
  | 'dashboard'
  | 'send-country'
  | 'recipients-list'
  | 'add-recipient'
  | 'enter-amount'
  | 'review-transfer'
  | 'payment-methods'
  | 'sending-processing'
  | 'transfer-success'
  | 'transfer-tracking'
  | 'receipt-details'
  | 'activity'
  | 'profile-settings'
  | 'verification-security'
  | 'notifications-screen'
  | 'help-support';

export interface CountryInfo {
  code: string;
  name: string;
  currency: string;
  flag: string;
  rate: number;
  deliveryMethods: ('Bank Transfer' | 'Mobile Wallet' | 'Cash Pickup')[];
  isTop?: boolean;
  trend?: 'up' | 'down';
  trendPercent?: string;
}

