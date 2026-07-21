/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { IndigenousProject } from '../types';
import { INDIGENOUS_PROJECTS } from '../mockData';
import { Wallet, Sparkles, Send, Download, Upload, Sprout, Milestone, ThumbsUp, Medal, Users, UserPlus, HelpCircle, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface WalletAndFundingProps {
  walletBalance: number;
  onUpdateWallet: (newBalance: number) => void;
}

export const WalletAndFunding: React.FC<WalletAndFundingProps> = ({
  walletBalance,
  onUpdateWallet,
}) => {
  const [projects, setProjects] = useState<IndigenousProject[]>(INDIGENOUS_PROJECTS);
  const [depositAmount, setDepositAmount] = useState('50');
  const [withdrawAmount, setWithdrawAmount] = useState('50');
  
  const [showCertification, setShowCertification] = useState<string | null>(null);
  const [backedAmount, setBackedAmount] = useState(0);

  // MLM Interactive Simulator States
  const [initialInvestmentLedger, setInitialInvestmentLedger] = useState<number>(150);
  const [commissionAgreed, setCommissionAgreed] = useState<number>(75);
  const [userCJoined, setUserCJoined] = useState<boolean>(false);
  const [userDJoined, setUserDJoined] = useState<boolean>(false);
  
  const [mlmLogs, setMlmLogs] = useState<string[]>([
    "Sovereign account initiated with ¤150.00 investment ceiling.",
    "User A (You) referred User B. Agreements settled at ¤75.00 (FROZEN in B's vault)."
  ]);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(depositAmount);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateWallet(walletBalance + parsed);
      setDepositAmount('50');
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(withdrawAmount);
    if (!isNaN(parsed) && parsed > 0) {
      if (parsed > walletBalance) {
        alert('❌ Insufficient iCurrency balance for withdrawal.');
        return;
      }
      onUpdateWallet(walletBalance - parsed);
      setWithdrawAmount('50');
    }
  };

  const handleAddInvestmentLedger = (amount: number) => {
    setInitialInvestmentLedger(prev => prev + amount);
    setMlmLogs(prev => [
      ...prev,
      `Ledger initial deposit increased by ¤${amount}. New commission ceiling: ¤${(initialInvestmentLedger + amount).toFixed(2)}.`
    ]);
  };

  const handleSimulateBInviteC = () => {
    if (commissionAgreed > initialInvestmentLedger) {
      alert("❌ TRIGGER DENIED: Your agreed commission exceeds your initial investment. Increase your initial deposit to claim!");
      return;
    }
    
    // Unlock B's commission and add to user A's wallet balance
    onUpdateWallet(walletBalance + commissionAgreed);
    setUserCJoined(true);
    
    setMlmLogs(prev => [
      ...prev,
      `✦ FLASH SUCCESS: User B referred User C!`,
      `¤${commissionAgreed.toFixed(2)} UNLOCKED from B's account and credited to User A!`,
      `User B and C settle intermediate commission at ¤45.00 (Frozen in C's vault).`
    ]);
  };

  const handleSimulateCInviteD = () => {
    if (!userCJoined) return;
    setUserDJoined(true);
    
    setMlmLogs(prev => [
      ...prev,
      `✦ FLASH SUCCESS: User C referred User D!`,
      `¤45.00 UNLOCKED from C's account and paid out to User B!`,
      `Affiliate chain continues securely in sovereign storage circles.`
    ]);
  };

  const handleResetMlm = () => {
    setUserCJoined(false);
    setUserDJoined(false);
    setCommissionAgreed(75);
    setInitialInvestmentLedger(150);
    setMlmLogs([
      "Sovereign account initiated with ¤150.00 investment ceiling.",
      "User A (You) referred User B. Agreements settled at ¤75.00 (FROZEN in B's vault)."
    ]);
  };

  const handleBackProject = (projectId: string, amount: number) => {
    if (walletBalance < amount) {
      alert(`❌ Insufficient iCurrency balance ($${amount}) to fund this project. Deposit mock currency above!`);
      return;
    }

    // Deduct wallet
    onUpdateWallet(walletBalance - amount);

    // Update local projects raising tracker
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          raised: p.raised + amount,
          supporters: p.supporters + 1,
        };
      }
      return p;
    });

    setProjects(updated);
    setBackedAmount(amount);
    
    const matched = projects.find(p => p.id === projectId);
    if (matched) {
      setShowCertification(matched.title);
    }
  };

  const isCommissionCeilingTriggered = commissionAgreed > initialInvestmentLedger;

  return (
    <div id="wallet-and-funding-root" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* COLUMN 1: Sovereign Wallet & Ledger actions */}
      <div className="lg:col-span-1 space-y-6 flex flex-col">
        
        {/* 1. Wallet Management Container */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-left shadow-lg">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Sovereign Wallet
            </h4>
          </div>

          {/* Current Balance Card */}
          <div className="bg-black p-5 rounded-2xl border border-white/5 text-center relative overflow-hidden">
            {/* Decorative flare */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            
            <span className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-bold block">WALLET BALANCE:</span>
            <span className="text-3xl font-black text-emerald-400 font-mono inline-flex items-center gap-1 mt-1">
              ¤ {walletBalance.toFixed(2)}
            </span>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">
              Stable peg: 1.00 iCurrency = 1.00 USD
            </p>
          </div>

          {/* Action simulators: deposit, withdraw */}
          <div className="space-y-3 pt-1">
            {/* Deposit Simulation */}
            <form onSubmit={handleDeposit} className="space-y-1 bg-zinc-950 p-3 rounded-xl border border-white/5">
              <label className="text-[9px] text-zinc-400 font-black uppercase tracking-wider block">
                Simulate Dollar Deposit:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  id="wallet-deposit-input"
                  className="w-full bg-black border border-white/10 text-xs px-3 py-2 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  id="btn-wallet-deposit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer shrink-0 transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>Add $</span>
                </button>
              </div>
            </form>

            {/* Withdraw Simulation */}
            <form onSubmit={handleWithdraw} className="space-y-1 bg-zinc-950 p-3 rounded-xl border border-white/5">
              <label className="text-[9px] text-zinc-400 font-black uppercase tracking-wider block">
                Real-Time Withdrawal:
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  id="wallet-withdraw-input"
                  className="w-full bg-black border border-white/10 text-xs px-3 py-2 rounded-xl text-white font-mono focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  id="btn-wallet-withdraw"
                  className="bg-zinc-800 hover:bg-zinc-750 text-white border border-white/15 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-0.5 cursor-pointer shrink-0 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Withdraw</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 2. iCurrency MLM Multi-Level Referral Commission Simulator */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-left shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Affiliate MLM Engine
              </h4>
            </div>
            <button 
              onClick={handleResetMlm}
              id="btn-reset-mlm"
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              title="Reset Simulation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-zinc-400 leading-normal">
            Commission arrangements represent multi-level trust agreements. Initial deposits in the system cap maximum referral unlocks to maintain cash solvency.
          </p>

          {/* Initial ledger setup */}
          <div className="bg-black p-3.5 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest block font-mono">
                Your Vault Cap (X):
              </span>
              <span className="text-xs font-black text-amber-400 font-mono">
                ¤ {initialInvestmentLedger.toFixed(2)}
              </span>
            </div>
            <div className="flex gap-1.5 pt-1">
              <button
                onClick={() => handleAddInvestmentLedger(50)}
                id="btn-mlm-add-50"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/5 py-1 text-[9px] uppercase tracking-wider font-extrabold rounded-lg transition-colors cursor-pointer"
              >
                + ¤50 Cap
              </button>
              <button
                onClick={() => handleAddInvestmentLedger(100)}
                id="btn-mlm-add-100"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/5 py-1 text-[9px] uppercase tracking-wider font-extrabold rounded-lg transition-colors cursor-pointer"
              >
                + ¤100 Cap
              </button>
            </div>
          </div>

          {/* Commission agreement setting A to B */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[8px] text-zinc-400 font-black uppercase tracking-[0.15em]">
                Settle Commission (A ➔ B):
              </label>
              <span className={`text-[10px] font-black font-mono ${isCommissionCeilingTriggered ? 'text-red-500' : 'text-blue-400'}`}>
                ¤ {commissionAgreed.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="250"
              step="5"
              value={commissionAgreed}
              onChange={(e) => setCommissionAgreed(parseFloat(e.target.value))}
              id="mlm-slider-commission"
              className="w-full accent-blue-500 bg-black h-1 rounded cursor-pointer"
            />
            {isCommissionCeilingTriggered && (
              <p className="text-[8px] text-red-400 font-mono uppercase font-black tracking-wide flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />
                Agreed contract (¤{commissionAgreed.toFixed(2)}) exceeds Vault Cap (¤{initialInvestmentLedger.toFixed(2)})!
              </p>
            )}
          </div>

          {/* Graphic/Visual Connection Chain */}
          <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5">
            <span className="text-[8.5px] text-zinc-500 font-black uppercase tracking-wider block mb-1">
              Sovereign Invitation Chain:
            </span>
            <div className="space-y-2 text-left">
              {/* Node A (You) */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <div className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center font-black text-[8px]">A</div>
                <div className="flex-1">
                  <span className="font-bold text-white uppercase tracking-wider text-[9px]">Sovereign User A (You)</span>
                  <span className="text-[8px] text-zinc-500 block font-mono">Ledger: ¤{initialInvestmentLedger.toFixed(2)} (Max Limit)</span>
                </div>
              </div>

              <div className="h-2 border-l border-dashed border-white/20 ml-2" />

              {/* Node B */}
              <div className="flex items-center gap-1.5 text-[10px] relative">
                <div className="w-4 h-4 rounded-full bg-blue-500 text-black flex items-center justify-center font-black text-[8px]">B</div>
                <div className="flex-1">
                  <span className="font-bold text-white uppercase tracking-wider text-[9px]">Referred User B</span>
                  <span className="text-[8px] text-zinc-500 block font-mono">
                    Cut: ¤{commissionAgreed.toFixed(2)} — <span className="text-zinc-400 font-bold uppercase">{userCJoined ? "UNLOCKED & PAID" : "FROZEN"}</span>
                  </span>
                </div>
                {!userCJoined && (
                  <button 
                    onClick={handleSimulateBInviteC}
                    disabled={isCommissionCeilingTriggered}
                    id="btn-mlm-invite-c"
                    className={`absolute right-1 text-[8px] font-black uppercase px-2 py-1 rounded transition-colors ${
                      isCommissionCeilingTriggered 
                        ? 'bg-zinc-850 text-zinc-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    }`}
                  >
                    B refers C
                  </button>
                )}
              </div>

              <div className="h-2 border-l border-dashed border-white/20 ml-2" />

              {/* Node C */}
              <div className="flex items-center gap-1.5 text-[10px] relative">
                <div className="w-4 h-4 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-[8px]">C</div>
                <div className="flex-1">
                  <span className="font-bold text-zinc-400 uppercase tracking-wider text-[9px]">Referred User C</span>
                  {userCJoined ? (
                    <span className="text-[8px] text-zinc-500 block font-mono">
                      Settled ¤45.00 for B — <span className="text-zinc-400 font-mono uppercase font-bold">{userDJoined ? "UNLOCKED" : "FROZEN"}</span>
                    </span>
                  ) : (
                    <span className="text-[8px] text-zinc-600 block italic">Waiting B➔C link...</span>
                  )}
                </div>
                {userCJoined && !userDJoined && (
                  <button 
                    onClick={handleSimulateCInviteD}
                    id="btn-mlm-invite-d"
                    className="absolute right-1 bg-amber-550 hover:bg-amber-600 text-black text-[8px] font-black uppercase px-2 py-1 rounded cursor-pointer transition-colors"
                  >
                    C refers D
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* MLM Action Output logs */}
          <div className="bg-zinc-950 p-2.5 rounded-xl border border-white/5 space-y-1">
            <span className="text-[7.5px] text-zinc-500 font-black tracking-widest uppercase block font-mono">
              Live Ledger Events:
            </span>
            <div className="max-h-[80px] overflow-y-auto text-[8.5px] font-mono leading-normal text-zinc-400 space-y-1">
              {[...mlmLogs].reverse().map((log, idx) => (
                <div key={idx} className="border-b border-white/5 pb-1 text-zinc-400">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COLUMN 2 & 3: Kickstarter Technology Projects */}
      <div className="lg:col-span-2 bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-left shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-blue-500" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Indigenously Invested Local Tech Ideas (Kickstarter Mode)
            </h4>
          </div>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
            Social Re-Investment Pool
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 leading-normal">
          One of theplatform.top's highest vision pillars is using subscription fees & cuts to fund regional tech innovators natively, allowing them to scale projects without predatory venture capital, using local iCurrency crowdfunds.
        </p>

        {/* Celebration Certification Modal Overlay */}
        {showCertification && (
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-3 relative animate-in fade-in duration-300">
            <div className="absolute top-3 right-3 text-zinc-400 hover:text-white cursor-pointer text-xs font-bold px-1" onClick={() => setShowCertification(null)}>
              ✕
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Medal className="w-5 h-5" />
              <h5 className="font-black text-xs uppercase tracking-[0.2em]">
                theplatform.top Co-Owner Certificate Awarded!
              </h5>
            </div>
            <p className="text-[11px] text-zinc-200 leading-normal">
              You backed <strong>{showCertification}</strong> with <strong className="text-emerald-400">¤ {backedAmount} iCurrency</strong>! You have been awarded native digital shares. You can monitor progress securely in your verified portfolio pipeline.
            </p>
            <div className="border border-dashed border-amber-500/25 rounded-xl p-2.5 text-center bg-black text-[10px] text-amber-300 font-mono font-bold">
              CERT_HASH: SECURE_KICKSTART_DEED_VAL_#{Math.floor(Math.random() * 89999 + 10000)}
            </div>
          </div>
        )}

        {/* Seed Idea Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => {
            const pct = Math.min(100, (p.raised / p.goal) * 100);

            return (
              <div key={p.id} className="bg-zinc-950 border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:border-white/15">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] bg-black border border-white/10 text-zinc-400 px-2 py-0.5 rounded-full font-mono uppercase font-bold tracking-wider">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">
                      {p.location}
                    </span>
                  </div>

                  <h5 className="font-black text-white text-xs tracking-tight line-clamp-1 mt-1 uppercase">
                    {p.title}
                  </h5>
                  <p className="text-[10px] text-zinc-400 line-clamp-3 leading-normal mt-1.5 italic">
                    "{p.description}"
                  </p>
                </div>

                {/* Progress bar info */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-400">
                      ¤ {p.raised.toLocaleString()} / <strong>¤ {p.goal.toLocaleString()}</strong>
                    </span>
                    <span className="text-emerald-400 font-black">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  {/* Visual Bar */}
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[9px] text-zinc-500 font-bold uppercase font-mono mt-1">
                    <span>Founder: <strong className="text-zinc-300">{p.founder}</strong></span>
                    <span>{p.supporters} Supporters</span>
                  </div>

                  {/* Fund buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono">
                    <button
                      onClick={() => handleBackProject(p.id, 25)}
                      id={`btn-back-25-${p.id}`}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/15 text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-full text-center cursor-pointer transition-all"
                    >
                      Fund ¤25
                    </button>
                    <button
                      onClick={() => handleBackProject(p.id, 100)}
                      id={`btn-back-100-${p.id}`}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 rounded-full text-center cursor-pointer transition-all"
                    >
                      Fund ¤100
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
