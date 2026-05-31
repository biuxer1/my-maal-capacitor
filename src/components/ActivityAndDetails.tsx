/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, RotateCcw, ChevronRight, Activity, ArrowDownLeft, ArrowUpRight, Filter, Clipboard, Calendar } from 'lucide-react';
import { Transfer, Recipient } from '../types';
import { COUNTRIES } from '../data/mockData';

interface ActivityAndDetailsProps {
  transfers: Transfer[];
  recipients: Recipient[];
  onNavigateDetail: (tx: Transfer) => void;
  onRepeatTransfer: (recipient: Recipient) => void;
  onBack: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

type TabType = 'All' | 'Sent' | 'Received';
type StatusFilterType = 'All Status' | 'Completed' | 'Processing' | 'Delivered' | 'Failed';

export function ActivityAndDetails({
  transfers,
  recipients,
  onNavigateDetail,
  onRepeatTransfer,
  onBack,
  showToast
}: ActivityAndDetailsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('All Status');

  const getCountryFlagAndCurrency = (countryName: string) => {
    const found = COUNTRIES.find(c => c.name.toLowerCase() === countryName.toLowerCase());
    return {
      flag: found ? found.flag : '🌐',
      currency: found ? found.currency : 'CAD'
    };
  };

  const getStatusStyle = (status: Transfer['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Money Sent':
        return 'bg-blue-50 text-blue-750 border-blue-100';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse';
      case 'Failed':
        return 'bg-rose-50 text-rose-750 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-150';
    }
  };

  // Filter transfers list
  const filteredTransfers = transfers.filter((tx) => {
    // 1. Tab type
    if (activeTab === 'Sent' && tx.sendCurrency !== 'CAD') return false;
    if (activeTab === 'Received' && tx.sendCurrency === 'CAD') return false; // In sandbox CAD is strictly sent

    // 2. Status filter
    if (statusFilter !== 'All Status') {
      if (statusFilter === 'Completed' && tx.status !== 'Delivered') return false;
      if (statusFilter !== 'Completed' && tx.status !== statusFilter) return false;
    }

    // 3. Search query
    const query = searchQuery.toLowerCase();
    return (
      tx.recipientName.toLowerCase().includes(query) ||
      tx.country.toLowerCase().includes(query) ||
      tx.transactionReference.toLowerCase().includes(query)
    );
  });

  const handleRepeatClick = (e: React.MouseEvent, tx: Transfer) => {
    e.stopPropagation(); // Avoid opening details drawer
    // Find matching recipient saved model
    const foundRec = recipients.find(r => r.id === tx.recipientId);
    if (foundRec) {
      onRepeatTransfer(foundRec);
      showToast(`Prefilled details to send to ${foundRec.fullName}!`, 'success');
    } else {
      // Create lightweight helper recipient if deleted
      const tempRec: Recipient = {
        id: tx.recipientId,
        userId: tx.userId,
        fullName: tx.recipientName,
        country: tx.country,
        currency: tx.receiveCurrency,
        deliveryMethod: tx.deliveryMethod as any,
        relationship: 'Friend',
        purpose: 'Family Support',
        createdAt: new Date().toISOString()
      };
      onRepeatTransfer(tempRec);
      showToast(`Prefilled details to send to ${tx.recipientName}!`, 'success');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative select-none">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 bg-white border-b border-slate-100 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-1 px-2.5 rounded-full hover:bg-slate-100 text-slate-600 font-bold text-sm bg-slate-50 transition"
        >
          ←
        </button>
        <span className="font-extrabold text-slate-900 text-sm">Transfer History Log</span>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 pb-0 flex items-center border-b border-slate-100 flex-shrink-0">
        {['All', 'Sent', 'Received'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`flex-1 text-center py-2.5 text-xs font-black border-b-2 transition ${
              activeTab === tab 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-400 hover:text-slate-650'
            }`}
          >
            {tab} remits
          </button>
        ))}
      </div>

      {/* Filters Area */}
      <div className="p-3.5 bg-white border-b border-slate-100 flex gap-2 flex-shrink-0">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search receiver name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8.5 pr-3 py-2 bg-slate-50 border border-slate-205 rounded-xl text-xs font-medium outline-none"
          />
        </div>

        {/* Status drop down */}
        <div className="flex items-center border border-slate-205 rounded-xl bg-slate-50 px-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
            className="text-[10px] font-black text-slate-700 bg-transparent py-2.5 outline-none border-none cursor-pointer"
          >
            <option>All Status</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto index-100 p-4">
        {filteredTransfers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center flex flex-col items-center justify-center space-y-2">
            <Activity className="w-8 h-8 text-slate-350" />
            <h4 className="text-xs font-black text-slate-700">No transfers logged</h4>
            <p className="text-[10px] text-slate-400 max-w-sm leading-normal">
              Ensure that your search parameters are clear or initiate a new money transfer checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <span className="text-[10px] font-extrabold text-slate-440 uppercase tracking-widest leading-none pl-1 block">
              Logged Transactions ({filteredTransfers.length})
            </span>

            {filteredTransfers.map((tx) => {
              const details = getCountryFlagAndCurrency(tx.country);
              return (
                <div
                  key={tx.id}
                  onClick={() => onNavigateDetail(tx)}
                  className="bg-white border border-slate-100 hover:border-blue-150 rounded-2xl p-4 shadow-3xs hover:shadow-xs transition flex flex-col space-y-3 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-lg shadow-inner relative">
                        {details.flag}
                        <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full border border-slate-200">
                          {tx.sendCurrency === 'CAD' ? (
                            <ArrowUpRight className="w-2.5 h-2.5 text-blue-600" />
                          ) : (
                            <ArrowDownLeft className="w-2.5 h-2.5 text-emerald-600" />
                          )}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition leading-tight">
                          {tx.recipientName}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5 mt-1">
                          <span className={`text-[8.5px] px-1.5 py-0.5 rounded border leading-none font-bold ${getStatusStyle(tx.status)}`}>
                            {tx.status}
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <h4 className="text-xs font-black text-slate-800 leading-none">
                        -${tx.sendAmount.toFixed(2)} {tx.sendCurrency}
                      </h4>
                      <p className="text-[10.5px] text-emerald-600 font-semibold mt-1">
                        +{tx.receiveAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} {tx.receiveCurrency}
                      </p>
                    </div>
                  </div>

                  {/* Summary Block + Repeat Transfer Row */}
                  <div className="border-t border-slate-100/75 pt-3.5 flex justify-between items-center text-xs">
                    <span className="text-[9px] text-slate-400 font-mono">REF: {tx.transactionReference}</span>
                    <button
                      onClick={(e) => handleRepeatClick(e, tx)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 font-black text-[10px] text-slate-650 transition flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 text-blue-600" />
                      <span>Repeat Transfer</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
