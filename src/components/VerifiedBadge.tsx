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
      label: 'Red — Local Verified',
      desc: 'Local Red Badge: issued to verified local businesses, shops, and community figures within a single town or city.'
    },
    national: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      fill: '#10b981',
      label: 'Green — National Verified',
      desc: 'National Green Badge: issued to each country\'s nationally recognized figures, athletes, artists, and institutions.'
    },
    international: {
      bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      fill: '#0ea5e9',
      label: 'Blue — International Verified',
      desc: 'International Blue Badge: standard international verification for global brands, worldwide celebrities, and multinational entities.'
    },
    vintage: {
      bg: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
      fill: '#a3a3a3',
      label: 'Black — Legacy & Late Figures',
      desc: 'Black Legacy Badge: reserved for historical figures, late cultural icons, and vintage personnel whose work transcends generations.'
    },
  };

  const config = colors[tier] || colors.international;

  const imageSrc = {
    local: '/red-local.png',
    national: '/green-national.png',
    international: '/blue-international.png',
    vintage: '/black-legacy.png',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border select-none group relative cursor-pointer overflow-hidden ${sizeClasses[size]} ${config.bg} ${className}`}
      title={`${config.label}: ${config.desc}`}
      id={`badge-${tier}-${Math.floor(Math.random() * 1000)}`}
    >
      <img
        src={imageSrc[tier]}
        alt={config.label}
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Hover tooltip explanation */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block bg-slate-900 border border-slate-700 text-white text-[10px] p-2 rounded shadow-xl z-55 leading-normal text-left font-normal animate-in fade-in duration-200">
        <strong className="block text-slate-200 font-semibold mb-0.5">{config.label}</strong>
        {config.desc}
      </span>
    </span>
  );
};
