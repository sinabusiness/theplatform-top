/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VerificationTier } from '../types';

interface VerifiedBadgeProps {
  tier: VerificationTier;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ tier, size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3 text-[9px]',
    sm: 'w-4 h-4 text-[11px]',
    md: 'w-5 h-5 text-[14px]',
    lg: 'w-6 h-6 text-[18px]',
  };

  const colors = {
    local: {
      bg: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      fill: '#f43f5e',
      label: 'Local Red Badge',
      desc: 'Local content visible only within the contributor’s immediate town/city.'
    },
    national: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      fill: '#10b981',
      label: 'National Green Badge',
      desc: 'National content visible to everyone in the same country.'
    },
    international: {
      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      fill: '#0ea5e9',
      label: 'International Blue Badge',
      desc: 'Global content visible to all accounts worldwide.'
    },
    vintage: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      fill: '#f59e0b',
      label: 'Vintage Black Badge',
      desc: 'Exclusive vintage recognition for historical figures & cultural reference pages.'
    },
  };

  const config = colors[tier] || colors.international;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold border select-none group relative cursor-pointer ${sizeClasses[size]} ${config.bg} ${className}`}
      title={`${config.label}: ${config.desc}`}
      id={`badge-${tier}-${Math.floor(Math.random() * 1000)}`}
    >
      {tier === 'local' && (
        <svg viewBox="0 0 24 24" className="w-[85%] h-[85%] fill-current" aria-hidden="true">
          {/* Circular pinpoint badge */}
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      )}

      {tier === 'national' && (
        <svg viewBox="0 0 24 24" className="w-[85%] h-[85%] fill-current" aria-hidden="true">
          {/* Shield/Castle design for stability/sovereignty */}
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 15l-4-4 1.41-1.41L10 13.17l5.59-5.59L17 9l-7 7z" />
        </svg>
      )}

      {tier === 'international' && (
        <svg viewBox="0 0 24 24" className="w-[85%] h-[85%] fill-current" aria-hidden="true">
          {/* Standard brand/international official wavy check badge */}
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      )}

      {tier === 'vintage' && (
        <svg viewBox="0 0 24 24" className="w-[85%] h-[85%] fill-current" aria-hidden="true">
          {/* Antique medallion with double laurel check */}
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z M12 15.5l-3.5 1.5 1.5-4-3-2.5 3.8-.2L12 6.5l1.2 3.8 3.8.2-3 2.5 1.5 4z" />
        </svg>
      )}

      {/* Hover tooltip explanation */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-slate-900 border border-slate-700 text-white text-[10px] p-2 rounded shadow-xl z-55 leading-normal text-left font-normal animate-in fade-in duration-200">
        <strong className="block text-slate-200 font-semibold mb-0.5">{config.label}</strong>
        {config.desc}
      </span>
    </span>
  );
};
