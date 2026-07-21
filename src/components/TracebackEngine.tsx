/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Post } from '../types';
import { ShieldCheck, Share2, GitCommit, Copy, Check, Info } from 'lucide-react';

interface TracebackEngineProps {
  post: Post;
  onPostUpdated?: (updatedPost: Post) => void;
  currentUserUsername: string;
}

export const TracebackEngine: React.FC<TracebackEngineProps> = ({
  post,
  onPostUpdated,
  currentUserUsername,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [simulationUsername, setSimulationUsername] = useState('');
  const [simMessage, setSimMessage] = useState('');

  // Generate current cycle code based on share chain
  // E.g. CBG-SF-SOURDOUGH > s_bake > mission_j > reader_x
  const generateSharingCode = (chain: string[]) => {
    return `${post.shareCodePrefix}:[${chain.join('➔')}]`;
  };

  const currentCode = generateSharingCode(post.shareChain);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulateShare = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = simulationUsername.trim().toLowerCase().replace('@', '');
    if (!cleanUsername) return;

    if (post.shareChain.includes(cleanUsername)) {
      setSimMessage(`⚠️ Handle @${cleanUsername} already exists in this post's sharing chain.`);
      return;
    }

    const updatedChain = [...post.shareChain, cleanUsername];
    const updatedPost: Post = {
      ...post,
      shareChain: updatedChain,
    };

    if (onPostUpdated) {
      onPostUpdated(updatedPost);
      setSimMessage(`✅ Post shared successfully! Added hop @${cleanUsername}`);
      setSimulationUsername('');
      setTimeout(() => setSimMessage(''), 3000);
    }
  };

  return (
    <div id="traceback-engine-root" className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 flex flex-col gap-5 text-left shadow-2xl">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h4 className="text-xs font-black uppercase tracking-[0.15em] text-white">
            Secure Traceback Engine
          </h4>
        </div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
          Integrity Indexed
        </span>
      </div>

      <p className="text-[11px] text-zinc-400 leading-normal font-sans italic">
        "Every theplatform.top post maintains a cryptographic metadata chain containing all transit hops. Non-verified users can share posts, but the initial source code strictly routes back to the authenticated verification entity, instantly diagnosing artificial bot swarms or wild rumors."
      </p>

      {/* Sharing Code Display */}
      <div className="bg-black border border-white/5 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] text-zinc-500 font-bold tracking-widest font-mono uppercase">CRYPTOGRAPHIC SHARING CODE:</span>
          <button
            onClick={copyToClipboard}
            id="btn-copy-code"
            className="text-[10px] text-blue-500 hover:text-blue-400 flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
          >
            {copiedCode ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-zinc-900 px-4 py-3 rounded-full border border-white/5 overflow-x-auto select-all scrollbar-none flex items-center">
          <code className="text-xs text-blue-450 font-mono whitespace-nowrap tracking-tight">
            {currentCode}
          </code>
        </div>
      </div>

      {/* Visual Lineage Timeline Map */}
      <div className="flex flex-col gap-2">
        <label className="text-[9px] text-zinc-550 uppercase font-black tracking-[0.2em]">
          Visual Lineage Hops ({post.shareChain.length} steps):
        </label>

        <div className="space-y-4 relative pl-4 border-l border-white/10 my-2">
          {post.shareChain.map((username, index) => {
            const isFirst = index === 0;
            const isLast = index === post.shareChain.length - 1;

            return (
              <div key={`${username}-${index}`} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 ${
                    isFirst
                      ? 'bg-emerald-500 border-black ring-4 ring-emerald-500/15'
                      : isLast
                      ? 'bg-rose-500 border-black ring-4 ring-rose-500/15'
                      : 'bg-zinc-500 border-black'
                  }`}
                />

                <div className="leading-snug">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase text-zinc-300">
                      {isFirst ? 'Verified Root Node' : `Hop #${index}`}
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded-full border border-blue-500/10">
                      @{username}
                    </span>
                    {isFirst && (
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono uppercase font-black">
                        SOURCE
                      </span>
                    )}
                    {username === currentUserUsername && (
                      <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-mono uppercase font-black">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase">
                    {isFirst
                      ? `Seed Cryptography: SECURE_POST_PUB_PUBKEY_SIGN`
                      : `Relay Signature: RELAY_TRANSIT_BYPASS_HASH_${Math.floor(
                          Math.random() * 89999 + 10000
                        )}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share simulation for pitch showoff */}
      <form onSubmit={handleSimulateShare} className="bg-zinc-950 rounded-2xl p-4 border border-white/5 space-y-3">
        <label className="block text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">
          SIMULATE HOP ACTION (PRESENTATION TOOL):
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-3 text-xs text-zinc-500 font-mono">@</span>
            <input
              type="text"
              placeholder="friend_username"
              value={simulationUsername}
              onChange={(e) => setSimulationUsername(e.target.value)}
              id="share-simulate-input"
              className="w-full bg-black border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-zinc-600 pl-7 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
          <button
            type="submit"
            id="btn-simulate-share"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Simulate Hop</span>
          </button>
        </div>
        {simMessage && (
          <p className="text-[10px] font-mono mt-2 text-zinc-300 font-bold uppercase tracking-wider">
            {simMessage}
          </p>
        )}
      </form>
    </div>
  );
};
