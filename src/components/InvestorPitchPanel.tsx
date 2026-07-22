/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Sparkles, DollarSign, Copy, Check, ShieldCheck } from 'lucide-react';

export const InvestorPitchPanel: React.FC = () => {
  // Calculator states
  const [tier, setTier] = useState<'local' | 'national' | 'international' | 'vintage'>('local');
  const [backgroundStrength, setBackgroundStrength] = useState<'none_weak' | 'moderate' | 'strong'>('moderate');
  const [usesSalesAlternative, setUsesSalesAlternative] = useState(false);
  const [estimatedSubscribers, setEstimatedSubscribers] = useState(1500);

  // SSL-Style Website Badge Creator state
  const [badgedUrl, setBadgedUrl] = useState('https://nike-official-stock.cn');
  const [badgedName, setBadgedName] = useState('Golden Sourdough SF');
  const [badgedTier, setBadgedTier] = useState<'local' | 'national' | 'international'>('local');
  const [isSecureModalOpen, setIsSecureModalOpen] = useState(false);
  const [simulateCopy, setSimulateCopy] = useState(false);

  // Calculates rates dynamically based on the pitch criteria
  const calculateRates = () => {
    let dailySub = 0;
    let oneTimeSub = 0;
    let transactionCut = 0;
    let statusMessage = '';

    // If strong background -> FREE subscription!
    if (backgroundStrength === 'strong') {
      dailySub = 0;
      oneTimeSub = 0;
      transactionCut = 1.5; // very low baseline cut on merchant
      statusMessage = '🎉 waived Model: Free Tier applied to incentivize high-reputation celebrity growth!';
    } else {
      // Base calculation by target authority tier
      if (tier === 'local') {
        dailySub = 0.50; // equivalent of targeted ad penny costs
        oneTimeSub = 49.00;
        transactionCut = 5.0; // standard commission
      } else if (tier === 'national') {
        dailySub = 2.50;
        oneTimeSub = 199.00;
        transactionCut = 4.0;
      } else if (tier === 'international') {
        dailySub = 10.00;
        oneTimeSub = 999.00;
        transactionCut = 2.5;
      } else {
        // Vintage
        dailySub = 0.10; // nominal server tribute
        oneTimeSub = 15.00;
        transactionCut = 1.0;
      }

      // If weak background, high sub rate. If moderate background, small discount.
      if (backgroundStrength === 'moderate') {
        dailySub = dailySub * 0.6; // 40% discount
        oneTimeSub = oneTimeSub * 0.6;
        statusMessage = '📉 Moderate Background Discount: 40% off subscription applied due to healthy starting clout!';
      } else {
        statusMessage = '💼 Standard Merchant Tier: Full subscription active for organic brand seed incubation.';
      }
    }

    // Small store sales alternative override
    if (usesSalesAlternative && backgroundStrength !== 'strong') {
      dailySub = 0;
      oneTimeSub = 0;
      transactionCut = 8.0; // higher transaction cut in exchange for free sign-up risk-sharing
      statusMessage = '🔁 Sales-Cut Alternative: Free daily/one-time signup fee. theplatform.top takes an 8% split on products. (If weekly sales fail threshold, shifts back to monthly fee).';
    }

    // Projects based on sliding scale of expected merchants
    const projectedMonthlyRevenue = (dailySub * 30 * estimatedSubscribers) + (oneTimeSub * (estimatedSubscribers * 0.12)); // assuming 12% monthly growth signups

    return {
      dailySub,
      oneTimeSub,
      transactionCut,
      statusMessage,
      projectedMonthlyRevenue,
    };
  };

  const rates = calculateRates();

  const handleCopySnippet = () => {
    setSimulateCopy(true);
    setTimeout(() => {
      setSimulateCopy(false);
    }, 2000);
  };

  const badgeTierColors = {
    local: { bg: 'bg-rose-500/10 border-rose-500/20 text-rose-500', fill: '#f43f5e', label: 'Local (Red)' },
    national: { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', fill: '#10b981', label: 'National (Green)' },
    international: { bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400', fill: '#0ea5e9', label: 'Global (Blue)' },
  };

  const currentBadgeStyle = badgeTierColors[badgedTier];

  return (
    <div className="space-y-6">
      <div id="investor-pitch-panel-root" className="space-y-6 text-left">
        
        {/* Dynamic Investor Calculator */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  Income Engine Calculator
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mt-0.5 font-bold">Yield Modeler</span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              {/* 1. Tier Selection */}
              <div>
                <label className="text-[9px] text-zinc-400 font-black uppercase tracking-widest block mb-2">
                  A) Requested Badge Class:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { value: 'local', label: 'Local (Red)' },
                    { value: 'national', label: 'National (Green)' },
                    { value: 'international', label: 'Global (Blue)' },
                    { value: 'vintage', label: 'Vintage (Black)' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setTier(item.value as any)}
                      id={`btn-calc-tier-${item.value}`}
                      className={`p-2 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all text-center cursor-pointer ${
                        tier === item.value
                          ? 'bg-blue-500 text-black border-blue-500 font-extrabold'
                          : 'bg-black border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Existing Clout / Background Strength */}
              <div>
                <label className="text-[9px] text-zinc-400 font-black uppercase tracking-widest block mb-2">
                  B) Sign-up Audience Authority:
                </label>
                <select
                  value={backgroundStrength}
                  onChange={(e) => setBackgroundStrength(e.target.value as any)}
                  id="calc-clout-select"
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="none_weak">Weak / Seed Stage (No waived fee)</option>
                  <option value="moderate">Moderate Clout (10k-100k views elsewhere)</option>
                  <option value="strong">Mega Authority / Celebrities (Sub waived)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {/* 3. Transaction sales alternative */}
              <div>
                <label className="text-[9px] text-zinc-400 font-black uppercase tracking-widest block mb-2">
                  C) Merchant Agreement:
                </label>
                <div className="bg-black p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-white uppercase tracking-wider block">Cut Split alternate?</span>
                    <span className="text-[8px] text-zinc-500 block leading-normal max-w-[150px] font-bold">
                      Waive sub fees in exchange for high 8% transaction commission split.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={usesSalesAlternative}
                    onChange={(e) => setUsesSalesAlternative(e.target.checked)}
                    id="calc-alt-checkbox"
                    className="w-4 h-4 bg-black border-white/15 rounded text-blue-500 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Users simulation count */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[9px] text-zinc-400 font-black uppercase tracking-widest block">
                    D) Paid Merchants/Subscribers:
                  </label>
                  <span className="text-xs font-black text-blue-400 font-mono">
                    {estimatedSubscribers.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="50000"
                  step="50"
                  value={estimatedSubscribers}
                  onChange={(e) => setEstimatedSubscribers(parseInt(e.target.value))}
                  id="calc-sub-slider"
                  className="w-full accent-blue-500 bg-black h-1.5 rounded-lg cursor-pointer my-2"
                />
              </div>
            </div>
          </div>

          {/* Live Simulation Output Box */}
          <div className="bg-black p-5 rounded-2xl border border-white/5 space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-center border-b border-white/5 pb-4">
              <div>
                <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest font-mono block">Daily Tribute Fee:</span>
                <span className="text-base font-black text-emerald-400 font-mono text-tight">
                  ${rates.dailySub.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest font-mono block">Pre-paid Setup Fee:</span>
                <span className="text-base font-black text-emerald-400 font-mono text-tight">
                  ${rates.oneTimeSub.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest font-mono block">E-commerce Cut split:</span>
                <span className="text-base font-black text-emerald-400 font-mono text-tight">
                  {rates.transactionCut.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#0F0F0F] p-4 rounded-xl border border-white/5 animate-in slide-in-from-bottom duration-500">
              <div className="leading-snug text-left">
                <span className="text-[9px] text-zinc-400 font-black tracking-[0.15em] block uppercase">
                  PROJECTED MONTHLY REVENUE:
                </span>
                <p className="text-[10px] text-zinc-500 font-mono font-bold mt-1 uppercase">
                  {estimatedSubscribers.toLocaleString()} Verified nodes (12% setup setups)
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl font-black text-amber-400 font-mono">
                  ${rates.projectedMonthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] text-zinc-500 block font-mono font-bold uppercase tracking-wider mt-0.5">/ Month (EST)</span>
              </div>
            </div>

            <p className="text-[10px] text-blue-450 font-mono leading-relaxed bg-[#0F0F0F] p-3 rounded-xl border border-white/5 uppercase font-bold tracking-wide">
              {rates.statusMessage}
            </p>
          </div>
        </div>
      </div>

      {/* SSL WEBSITE BADGING EMBED TOOL */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 text-left space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white">
                SSL-style Web Verification Badge embed tool
              </h4>
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mt-0.5 font-bold">Traceable Business Verification Standard</span>
            </div>
          </div>
          <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-505/20 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
            Off-Platform Trust standard
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 leading-normal">
          Verified merchant pages and personalities can embed an interactive encrypted verification badge directly onto their external websites (e.g., e-commerce stores, native galleries). When external users click the badge, it establishes an instant cryptographic handshake back to theplatform.top to verify the site is 100% genuine and linked to a physical entity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-black p-5 rounded-2xl border border-white/5">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black font-mono block mb-2">
              Badge Configuration Dashboard:
            </span>

            {/* URL input */}
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">
                Storefront Website URL:
              </label>
              <input
                type="text"
                value={badgedUrl}
                onChange={(e) => setBadgedUrl(e.target.value)}
                id="embed-url-input"
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            {/* Business name */}
            <div className="space-y-1">
              <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">
                Company / Label Title:
              </label>
              <input
                type="text"
                value={badgedName}
                onChange={(e) => setBadgedName(e.target.value)}
                id="embed-name-input"
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Badge level toggle */}
            <div>
              <label className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block mb-1.5">
                Set Verification Level (Color Check):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: 'local', label: 'Local (Red)' },
                  { value: 'national', label: 'National (Green)' },
                  { value: 'international', label: 'Global (Blue)' },
                ].map((tierItem) => (
                  <button
                    key={tierItem.value}
                    onClick={() => setBadgedTier(tierItem.value as any)}
                    id={`btn-embed-tier-${tierItem.value}`}
                    className={`py-1.5 text-[9.5px] font-bold uppercase tracking-wider rounded-lg border transition-all text-center cursor-pointer ${
                      badgedTier === tierItem.value
                        ? 'bg-sky-550 border-sky-550 text-black font-extrabold'
                        : 'bg-[#0F0F0F] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tierItem.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="bg-black/60 border border-white/5 rounded-2xl p-5 flex flex-col justify-between items-center gap-4 text-center h-full">
              <div className="w-full border-b border-white/5 pb-2 text-left">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-black font-mono block">
                  Interactive Live Web Preview (As Embedded):
                </span>
              </div>

              {/* LIVE EMBEDDED BADGE PREVIEW WIDGET */}
              <div 
                onClick={() => setIsSecureModalOpen(true)}
                className={`w-64 border rounded-xl p-3.5 bg-[#0A0A0A] hover:bg-slate-900/40 cursor-pointer transition-all border-white/10 hover:border-sky-500/50 shadow-lg text-left relative overflow-hidden group`}
                title="Click to Simulate Trust Verification Handshake Redirect"
              >
                {/* Visual ripple hint */}
                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none rounded-full blur-xl bg-sky-400/20 group-hover:scale-150 transition-transform" />
                
                <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="leading-none">
                    <span className="text-[7.5px] font-mono tracking-widest uppercase text-zinc-500 block">CELEBGRAM SECURE</span>
                    <span className="text-[9px] font-bold text-white uppercase tracking-tight">{badgedName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400 font-mono text-[8.5px] truncate max-w-[120px]">{badgedUrl}</span>
                  <span className={`px-2 py-0.5 rounded-full border text-[7.5px] font-bold uppercase tracking-wider font-mono ${currentBadgeStyle.bg}`}>
                    {badgedTier} Node
                  </span>
                </div>

                <div className="text-center pt-2 mt-2 border-t border-dashed border-white/5 text-[8px] text-zinc-500 font-bold tracking-wider uppercase group-hover:text-sky-400 transition-colors">
                  Click to Verify Secure Connection ➔
                </div>
              </div>

              {/* Embed Code output copy box */}
              <div className="w-full space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[8.5px] text-zinc-500 font-black tracking-wider uppercase block">Embed iframe snippet:</span>
                  <button
                    onClick={handleCopySnippet}
                    id="btn-copy-embed-code"
                    className="text-[8px] text-sky-400 hover:text-sky-350 cursor-pointer flex items-center gap-1 font-bold font-mono tracking-wide"
                  >
                    {simulateCopy ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{simulateCopy ? "COPIED TO CLIPBOARD" : "COPY CODE"}</span>
                  </button>
                </div>
                <div className="bg-[#0F0F0F] border border-white/10 p-2.5 rounded-xl text-left font-mono text-[9px] text-zinc-400 select-all overflow-x-auto leading-normal">
                  {`&lt;iframe src="https://theplatform.top/badge?url=${encodeURIComponent(badgedUrl)}&amp;tier=${badgedTier}" width="256" height="96" frameborder="0"&gt;&lt;/iframe&gt;`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SSL SECURE HANDSHAKE SIMULATED MODAL */}
      {isSecureModalOpen && (
        <div className="fixed inset-0 z-55 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsSecureModalOpen(false)}>
          <div 
            className="bg-[#0F0F0F] border border-sky-500/20 rounded-2xl p-6 max-w-md w-full text-left relative shadow-[0_0_30px_rgba(14,165,233,0.15)] animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsSecureModalOpen(false)}
              id="btn-close-ssl-modal"
              className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0" />
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider font-mono">theplatform.top Secure Protocol</h4>
                <p className="text-[9px] text-zinc-500 font-mono">TLS handshake certificate hash matches mainnet index</p>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              <div className="bg-black border border-white/5 p-3 rounded-xl space-y-1 text-xs">
                <p className="text-zinc-500 text-[10px]">HANDSHAKE TARGET: <span className="text-zinc-300 font-bold">{badgedUrl}</span></p>
                <p className="text-zinc-500 text-[10px]">ORGANIZATION: <span className="text-zinc-300 font-bold">{badgedName}</span></p>
                <p className="text-zinc-500 text-[10px]">VERIFICATION CLASS: <span className={`font-bold ${badgedTier === 'local' ? 'text-rose-500' : badgedTier === 'national' ? 'text-emerald-400' : 'text-sky-400'}`}>{badgedTier.toUpperCase()} NODE</span></p>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-500/5 border border-sky-500/10 space-y-2">
                <span className="text-[10px] text-sky-450 font-bold uppercase tracking-wider block">🛡️ CONNECTION IS 100% SECURE</span>
                <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">
                  The website <strong className="text-white font-semibold">{badgedUrl}</strong> is officially verified as the genuine digital authority representing <strong className="text-white font-semibold">{badgedName}</strong>. This physical entity maintains certified public keys within the theplatform.top sovereign Ledger. Spoofing or phishing attempts are impossible under this certificate chain.
                </p>
              </div>

              <div className="text-[8.5px] text-zinc-550 text-center uppercase tracking-widest font-bold">
                PATENT PENDING TRACEBACK DEFI DISRUPTION — ACTIVE
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
