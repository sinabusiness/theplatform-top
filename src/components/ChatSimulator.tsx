/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, Send, Lock, CheckCircle, RefreshCw, EyeOff } from 'lucide-react';

interface ChatSimulatorProps {
  currentSimulatedCountry: string; // If 'China', disable chat!
  userUniqueId: string;
}

interface ActiveChat {
  friendId: string;
  messages: { sender: 'me' | 'them'; text: string; time: string }[];
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({
  currentSimulatedCountry,
  userUniqueId,
}) => {
  const isChina = currentSimulatedCountry.toLowerCase() === 'china';

  const [friendId, setFriendId] = useState('');
  const [typedVerificationCode, setTypedVerificationCode] = useState('');
  const [activationStep, setActivationStep] = useState<'idle' | 'waiting_codes' | 'active'>('idle');
  const [generatedMyCode, setGeneratedMyCode] = useState('');
  const [expectedFriendCode, setExpectedFriendCode] = useState('');
  
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Handle requesting activation code (simultaneity simulator)
  const handleInitiateActivation = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = friendId.trim().toLowerCase().replace('@', '');
    if (!cleanId) return;

    // Simulate simultaneous code generation
    // My application generates a local sequence
    // The other user (simulated) gets their sequence
    const myCode = Math.floor(100000 + Math.random() * 900000).toString();
    const theirCode = Math.floor(100000 + Math.random() * 900000).toString();

    setGeneratedMyCode(myCode);
    setExpectedFriendCode(theirCode);
    setActivationStep('waiting_codes');
  };

  // Submit the verification code
  const handleConfirmCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedVerificationCode === expectedFriendCode) {
      setActivationStep('active');
      setActiveChat({
        friendId: friendId,
        messages: [
          { sender: 'them', text: `Hey! The simultaneous activation worked. Our channel is now completely active!`, time: 'Just now' }
        ]
      });
    } else {
      alert(`❌ Invalid activation code entered. Ensure your friend entered your ID "${userUniqueId}" and generated the code "${expectedFriendCode}" simultaneously.`);
    }
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const copyMsg = [...activeChat.messages];
    copyMsg.push({ sender: 'me', text: newMessage, time: 'Just now' });

    setActiveChat({
      ...activeChat,
      messages: copyMsg
    });
    setNewMessage('');

    // Simulated quick friendly reply
    setTimeout(() => {
      if (activeChat) {
        setActiveChat(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [
              ...prev.messages,
              { sender: 'them', text: `Received cleanly! theplatform.top's peer-to-peer tracing code makes sure this is an authentic chat between verified owners of our keys.`, time: 'Just now' }
            ]
          };
        });
      }
    }, 1500);
  };

  const resetChatState = () => {
    setFriendId('');
    setTypedVerificationCode('');
    setGeneratedMyCode('');
    setExpectedFriendCode('');
    setActivationStep('idle');
    setActiveChat(null);
  };

  return (
    <div id="chat-simulator-root" className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-left shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-500" />
            Simultaneous Chat Gateway
          </h4>
          <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
            ID METRIC: <strong className="text-blue-400">@{userUniqueId}</strong>
          </span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider">Active Mesh Nodes</span>
      </div>

      {/* Compliance banner for China */}
      {isChina ? (
        <div className="bg-rose-500/10 border border-rose-500/25 text-white p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-rose-500">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <h5 className="font-black text-xs uppercase tracking-[0.15em]">
              China Coordinates Detected
            </h5>
          </div>
          <p className="text-[11px] leading-normal text-zinc-400 font-sans italic">
            "theplatform.top disables absolute interactive chat loops within Chinese territory coordinates to completely comply with local regulatory censorship structures. Users in this region strictly enjoy foreign and domestic verified creators’ feeds without risk of political censorship shutdowns. This is our key strategy for secure scaling in the Asian market."
          </p>
          <div className="text-[10px] text-rose-450 font-black tracking-widest bg-black p-2.5 rounded-full text-center border border-white/5 mt-1 font-mono uppercase">
            STATUS: COMPLIANT FEED-ONLY MODE (ENABLED)
          </div>
        </div>
      ) : (
        /* Regular encrypted activation simulator */
        <div className="min-h-[180px] flex flex-col justify-between">
          {activationStep === 'idle' && (
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                To prevent automatic spam droids or unauthenticated harassment, you cannot message someone by simple click. You both must input each other's ID and provide the generated verification pair simultaneously.
              </p>
              <form onSubmit={handleInitiateActivation} className="space-y-2.5">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">
                  Friend's Handle or Creator ID to Connect:
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-mono">@</span>
                    <input
                      type="text"
                      placeholder="alex_99 or sourdough_bake_sf"
                      value={friendId}
                      onChange={(e) => setFriendId(e.target.value)}
                      id="friend-id-input"
                      className="w-full bg-black border border-white/10 rounded-full py-2.5 pl-7 pr-4 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    id="btn-generate-handshake"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                  >
                    Connect
                  </button>
                </div>
              </form>
            </div>
          )}

          {activationStep === 'waiting_codes' && (
            <div className="space-y-4">
              <div className="bg-black p-4 rounded-2xl border border-white/5 text-center">
                <span className="block text-[9px] text-zinc-505 font-black uppercase tracking-widest font-mono mb-1">YOUR CONNECT HANDSHAKE CERTIFICATE:</span>
                <span className="text-2xl font-black font-mono tracking-widest text-emerald-450">
                  {generatedMyCode}
                </span>
                <span className="block text-[9px] text-zinc-500 mt-1 leading-normal font-sans">
                  Provide this string to <strong className="text-blue-500">@{friendId}</strong>. They must enter it on their terminal.
                </span>
              </div>

              <div className="border-t border-white/5 pt-3">
                <form onSubmit={handleConfirmCode} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.15em] block">
                      Enter Friend's Handshake:
                    </label>
                    <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                      (DEMO CODE: <strong className="text-white">{expectedFriendCode}</strong>)
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="6-Digit Verification Code"
                      value={typedVerificationCode}
                      onChange={(e) => setTypedVerificationCode(e.target.value)}
                      id="typed-verification-code"
                      className="flex-1 bg-black border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-zinc-750 text-center tracking-widest font-mono"
                    />
                    <button
                      type="submit"
                      id="btn-validate-handshake"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors cursor-pointer"
                    >
                      Authenticate
                    </button>
                  </div>
                </form>
              </div>

              <button
                onClick={resetChatState}
                id="btn-reset-chat-handshake"
                className="text-[10px] text-zinc-500 hover:text-white flex items-center justify-center gap-1 cursor-pointer mx-auto pt-1 font-bold uppercase tracking-wider"
              >
                <RefreshCw className="w-3 h-3 text-blue-500" />
                <span>Cancel Handshake</span>
              </button>
            </div>
          )}

          {activationStep === 'active' && activeChat && (
            <div className="flex flex-col h-[280px] bg-black rounded-2xl border border-white/15 overflow-hidden">
              {/* Chat Status header */}
              <div className="bg-[#0F0F0F] px-4 py-3 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-white">@{activeChat.friendId}</span>
                </div>
                <button
                  onClick={resetChatState}
                  id="btn-disconnect-chat"
                  className="text-[9px] text-rose-450 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 hover:bg-rose-500/25 cursor-pointer font-bold uppercase"
                >
                  Disconnect Line
                </button>
              </div>

              {/* Chat message logs */}
              <div className="flex-1 p-4 overflow-y-auto space-y-2.5 flex flex-col scrollbar-none">
                {activeChat.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-normal ${
                      m.sender === 'me'
                        ? 'bg-blue-500 text-white self-end rounded-tr-none'
                        : 'bg-zinc-900 text-white self-start rounded-tl-none border border-white/5'
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className="text-[7px] text-zinc-400 block text-right mt-1.5 font-mono uppercase font-bold tracking-wider">
                      {m.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Send Area */}
              <form onSubmit={handleSendMessage} className="p-3 bg-zinc-950 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  placeholder="Type secure certified message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  id="chat-message-input"
                  className="flex-1 bg-black border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  id="btn-send-message"
                  className="bg-blue-500 text-white p-2.5 rounded-full hover:bg-blue-600 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
