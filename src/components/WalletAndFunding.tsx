import React, { useState } from 'react';
import { IndigenousProject } from '../types';
import { INDIGENOUS_PROJECTS } from '../mockData';
import { Wallet, Sparkles, Send, Download, Upload, Sprout, Milestone, ThumbsUp, Medal, Users, UserPlus, HelpCircle, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, Gift } from 'lucide-react';

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

  // Single-hop capped referral credit
  const [referralCode, setReferralCode] = useState('');
  const [referralCredit, setReferralCredit] = useState(0);
  const [referralLog, setReferralLog] = useState<string[]>([]);
  const [usedCode, setUsedCode] = useState(false);

  const creditCap = 50;
  const remainingCredit = creditCap - referralCredit;

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
        alert('Insufficient balance.');
        return;
      }
      onUpdateWallet(walletBalance - parsed);
      setWithdrawAmount('50');
    }
  };

  const handleApplyReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const code = referralCode.trim().toLowerCase();
    if (!code) return;
    if (usedCode) {
      alert('Referral code already applied.');
      return;
    }

    const credit = Math.min(creditCap, 25 + Math.floor(Math.random() * 26));
    setReferralCredit(credit);
    onUpdateWallet(walletBalance + credit);
    setUsedCode(true);
    setReferralLog(prev => [
      ...prev,
      `Referral @${code} verified. Credit of ¤${credit} applied. Cap remaining: ¤${remainingCredit}.`
    ]);
  };

  const handleBackProject = (projectId: string, amount: number) => {
    if (walletBalance < amount) {
      alert(`Insufficient balance ($${amount}) to fund this project.`);
      return;
    }

    onUpdateWallet(walletBalance - amount);

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

  return (
    <div id="wallet-and-funding-root" className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* COLUMN 1: Sovereign Wallet & Referral */}
      <div className="lg:col-span-1 space-y-6 flex flex-col">

        {/* 1. Wallet Management */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-left shadow-lg">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Wallet
            </h4>
          </div>

          <div className="bg-black p-5 rounded-2xl border border-white/5 text-center relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
            <span className="text-[9px] text-zinc-500 uppercase tracking-[0.2em] font-bold block">BALANCE:</span>
            <span className="text-3xl font-black text-emerald-400 font-mono inline-flex items-center gap-1 mt-1">
              ¤ {walletBalance.toFixed(2)}
            </span>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono uppercase tracking-wider">
              Stable peg: 1.00 iCurrency = 1.00 USD
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <form onSubmit={handleDeposit} className="space-y-1 bg-zinc-950 p-3 rounded-xl border border-white/5">
              <label className="text-[9px] text-zinc-400 font-black uppercase tracking-wider block">
                Deposit:
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
                  <span>Add</span>
                </button>
              </div>
            </form>

            <form onSubmit={handleWithdraw} className="space-y-1 bg-zinc-950 p-3 rounded-xl border border-white/5">
              <label className="text-[9px] text-zinc-400 font-black uppercase tracking-wider block">
                Withdraw:
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

        {/* 2. Referral Credit (single-hop capped) */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-left shadow-lg">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-blue-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Referral Credit
              </h4>
            </div>
            <span className="text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
              ¤{creditCap} Cap
            </span>
          </div>

          <p className="text-[10px] text-zinc-400 leading-normal">
            Invite someone to join theplatform.top. When they sign up with your referral code, you earn a one-time capped credit. Single hop only — no chain.
          </p>

          <div className="bg-black p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest font-mono">Credit Earned:</span>
              <span className={`text-sm font-black font-mono ${usedCode ? 'text-emerald-400' : 'text-zinc-500'}`}>
                ¤{referralCredit} / ¤{creditCap}
              </span>
            </div>

            {!usedCode ? (
              <form onSubmit={handleApplyReferral} className="space-y-2">
                <label className="text-[8px] text-zinc-400 font-black uppercase tracking-wider block">Referral Code:</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="friend_username"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    id="referral-input"
                    className="flex-1 bg-zinc-950 border border-white/10 text-xs px-3 py-2 rounded-xl text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    id="btn-apply-referral"
                    className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold px-4 py-2 rounded-xl cursor-pointer shrink-0 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-[10px] text-emerald-400 font-bold font-mono">Credit of ¤{referralCredit} applied</p>
              </div>
            )}
          </div>

          {referralLog.length > 0 && (
            <div className="bg-zinc-950 p-2.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[7.5px] text-zinc-500 font-black tracking-widest uppercase block font-mono">Events:</span>
              <div className="max-h-[60px] overflow-y-auto text-[8.5px] font-mono text-zinc-400 space-y-1">
                {[...referralLog].reverse().map((log, idx) => (
                  <div key={idx} className="border-b border-white/5 pb-1">{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 2 & 3: Indigenous Projects */}
      <div className="lg:col-span-2 bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-left shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-blue-500" />
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Indigenous Tech Projects (Kickstarter)
            </h4>
          </div>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
            Community Pool
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 leading-normal">
          Using platform fees & referral credits to fund regional tech innovators — scaling projects without predatory venture capital.
        </p>

        {showCertification && (
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-3 relative animate-in fade-in duration-300">
            <div className="absolute top-3 right-3 text-zinc-400 hover:text-white cursor-pointer text-xs font-bold px-1" onClick={() => setShowCertification(null)}>
              ✕
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Medal className="w-5 h-5" />
              <h5 className="font-black text-xs uppercase tracking-[0.2em]">
                Co-Owner Certificate Awarded!
              </h5>
            </div>
            <p className="text-[11px] text-zinc-200 leading-normal">
              You backed <strong>{showCertification}</strong> with <strong className="text-emerald-400">¤ {backedAmount} iCurrency</strong>! Monitor progress in your verified portfolio.
            </p>
            <div className="border border-dashed border-amber-500/25 rounded-xl p-2.5 text-center bg-black text-[10px] text-amber-300 font-mono font-bold">
              CERT_HASH: SECURE_KICKSTART_DEED_VAL_#{Math.floor(Math.random() * 89999 + 10000)}
            </div>
          </div>
        )}

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
                    &ldquo;{p.description}&rdquo;
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-400">
                      ¤ {p.raised.toLocaleString()} / <strong>¤ {p.goal.toLocaleString()}</strong>
                    </span>
                    <span className="text-emerald-400 font-black">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
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
