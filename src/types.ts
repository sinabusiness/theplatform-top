/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VerificationTier = 'local' | 'national' | 'international' | 'vintage';

export interface CreatorProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  tier: VerificationTier;
  category: 'individual' | 'artist' | 'celebrity' | 'business' | 'brand' | 'public_figure' | 'vintage_personnel';
  followers: number;
  country: string;
  city: string;
  priorityLanguage: 'en' | 'es' | 'de' | 'fa' | 'zh' | 'fr' | 'it';
  bio: string;
  website?: string;
  isVintage?: boolean;
  // Monetization metrics
  monthlySales?: number;
  hasStrongBackground?: boolean;
}

export interface Post {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  tier: VerificationTier;
  category: string;
  caption: string;
  imageUrl: string;
  likes: number; // Hidden from general public, visible to owner
  views: number; // Hidden from general public, visible to owner
  timestamp: string;
  locationName: string;
  lat: number; // For map projection
  lng: number; // For map projection
  language: string;
  shareCodePrefix: string;
  shareChain: string[]; // Chain of usernames [creator, user1, user2, user3]
  categoryLabel?: string;
  products?: { id: string; name: string; price: number; image: string }[];
}

export interface Story {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  imageUrl: string;
  text?: string;
  tier: VerificationTier;
  views: number; // Private metric
  viewers: string[];
}

export interface IndigenousProject {
  id: string;
  title: string;
  founder: string;
  location: string;
  description: string;
  category: string;
  goal: number;
  raised: number;
  supporters: number;
}
