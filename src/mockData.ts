/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CreatorProfile, Post, Story, IndigenousProject } from './types';

export const INITIAL_CREATORS: CreatorProfile[] = [
  // Vintage Personnel (Black Verification Badge)
  {
    id: 'l_beethoven',
    name: 'Ludwig van Beethoven',
    username: 'beethoven_official',
    avatar: 'https://images.unsplash.com/photo-1543157148-f79334e20719?auto=format&fit=crop&q=80&w=200',
    tier: 'vintage',
    category: 'vintage_personnel',
    followers: 12400500,
    country: 'Germany',
    city: 'Bonn',
    priorityLanguage: 'de',
    bio: 'Composer and pianist. Music is a higher revelation than all wisdom and philosophy.'
  },
  {
    id: 'a_einstein',
    name: 'Albert Einstein',
    username: 'albert_einstein',
    avatar: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=200',
    tier: 'vintage',
    category: 'vintage_personnel',
    followers: 35100000,
    country: 'United States',
    city: 'Princeton',
    priorityLanguage: 'en',
    bio: 'Theoretical physicist who developed the theory of relativity. Imagination is more important than knowledge.'
  },
  {
    id: 'w_shakespeare',
    name: 'William Shakespeare',
    username: 'shakespeare_bard',
    avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200',
    tier: 'vintage',
    category: 'vintage_personnel',
    followers: 9800000,
    country: 'United Kingdom',
    city: 'Stratford-upon-Avon',
    priorityLanguage: 'en',
    bio: 'Playwright, poet, and actor, widely regarded as the greatest writer in the English language.'
  },

  // International Brands & Celebs (Blue Badge)
  {
    id: 'blue_nike',
    name: 'Nike Global',
    username: 'nike',
    avatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
    tier: 'international',
    category: 'brand',
    followers: 245000000,
    country: 'Global',
    city: 'Beaverton',
    priorityLanguage: 'en',
    bio: 'Bring inspiration and innovation to every athlete in the world. *If you have a body, you are an athlete.'
  },
  {
    id: 'blue_popstar',
    name: 'Aria Grande',
    username: 'aria_g',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    tier: 'international',
    category: 'artist',
    followers: 389000000,
    country: 'Global',
    city: 'Los Angeles',
    priorityLanguage: 'en',
    bio: 'Eternal Sunshine out now! ☀️🎶'
  },

  // National Tiers (Green Badge)
  {
    id: 'green_nike_usa',
    name: 'Nike USA Stores',
    username: 'nike_usa',
    avatar: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&q=80&w=200',
    tier: 'national',
    category: 'brand',
    followers: 12400000,
    country: 'United States',
    city: 'Chicago',
    priorityLanguage: 'en',
    bio: 'Official national branch of Nike. Serving USA sports achievements and retail franchises.'
  },
  {
    id: 'green_aerogym',
    name: 'Aero Gym USA',
    username: 'aerogym_national',
    avatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200',
    tier: 'national',
    category: 'business',
    followers: 820000,
    country: 'United States',
    city: 'Denver',
    priorityLanguage: 'en',
    bio: 'Our nation\'s premier athletic facilities and conditioning routines. Real workouts, real communities.'
  },
  {
    id: 'green_chef_italy',
    name: 'Chef Antonio Rossi',
    username: 'antonio_rossi_chef',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=200',
    tier: 'national',
    category: 'celebrity',
    followers: 2100000,
    country: 'Italy',
    city: 'Rome',
    priorityLanguage: 'fr', // Priority display language can differ or be switched!
    bio: 'Ambasciatore della cucina italiana nel mondo. Authenticity on your plate.'
  },

  // Local Brand Branches & Local Individuals (Red Badge)
  {
    id: 'red_nike_sf',
    name: 'Nike SF - Union Square',
    username: 'nike_unionsquare',
    avatar: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=200',
    tier: 'local',
    category: 'brand',
    followers: 45000,
    country: 'United States',
    city: 'San Francisco',
    priorityLanguage: 'en',
    bio: 'Local Union Square, SF franchise of Nike. Check in for exclusive local neighborhood running events!'
  },
  {
    id: 'red_golden_baker',
    name: 'The Sourdough Baker',
    username: 'sourdough_bake_sf',
    avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200',
    tier: 'local',
    category: 'business',
    followers: 12500,
    country: 'United States',
    city: 'San Francisco',
    priorityLanguage: 'en',
    bio: 'Artisanal organic sourdough, baked fresh every morning in Mission District, San Francisco.'
  },
  {
    id: 'red_denver_brewery',
    name: 'Altitude Craft Hops',
    username: 'altitude_hops',
    avatar: 'https://images.unsplash.com/photo-1558642084-fd074ec4bd2d?auto=format&fit=crop&q=80&w=200',
    tier: 'local',
    category: 'business',
    followers: 6800,
    country: 'United States',
    city: 'Denver',
    priorityLanguage: 'en',
    bio: 'High altitude yeast brews & mountain micro-distilleries. Rocky Mountain local pride.'
  }
];

export const INITIAL_POSTS: Post[] = [
  // Vintage Post
  {
    id: 'post_1',
    creatorId: 'l_beethoven',
    creatorName: 'Ludwig van Beethoven',
    creatorUsername: 'beethoven_official',
    creatorAvatar: 'https://images.unsplash.com/photo-1543157148-f79334e20719?auto=format&fit=crop&q=80&w=200',
    tier: 'vintage',
    category: 'vintage_personnel',
    caption: 'Be not afraid of the silence in your ears. Within my utter quietude, I composed the Ninth Symphony. The music flows not through the air, but directly from the Divine spark inside.',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=600',
    likes: 423500,
    views: 1250000,
    timestamp: '2026-06-16T12:00:00Z',
    locationName: 'Vienna, Austria',
    lat: 48.2082,
    lng: 16.3738,
    language: 'de',
    shareCodePrefix: 'VNT_LVB_9TH',
    shareChain: ['beethoven_official', 'brahms_jr', 'liszt_fan', 'modern_classical_guy', 'investor_guest_user']
  },
  {
    id: 'post_ae',
    creatorId: 'a_einstein',
    creatorName: 'Albert Einstein',
    creatorUsername: 'albert_einstein',
    creatorAvatar: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=200',
    tier: 'vintage',
    category: 'vintage_personnel',
    caption: 'A human being is part of a whole, called by us the "Universe," a part limited in time and space. He experiences himself, his thoughts and feelings, as something separated from the rest—a kind of optical delusion of his consciousness.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
    likes: 912000,
    views: 3100000,
    timestamp: '2026-06-15T09:15:00Z',
    locationName: 'Princeton, New Jersey',
    lat: 40.3573,
    lng: -74.6672,
    language: 'en',
    shareCodePrefix: 'VNT_AE_RELATIVITY',
    shareChain: ['albert_einstein', 'openheimer_colleague', 'feynman_student', 'physics_major_33']
  },

  // International Post (Blue)
  {
    id: 'post_2',
    creatorId: 'blue_nike',
    creatorName: 'Nike Global',
    creatorUsername: 'nike',
    creatorAvatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
    tier: 'international',
    category: 'brand',
    caption: 'Running isn\'t about the destination. It\'s about the space it clears in your head. Presenting our new lightweight sustainable athlete fiber structures. Engineered globally, custom tailored locally.',
    imageUrl: 'https://images.unsplash.com/photo-1502904582529-dfa7aeb1ce44?auto=format&fit=crop&q=80&w=600',
    likes: 1890000,
    views: 6300000,
    timestamp: '2026-06-17T02:30:00Z',
    locationName: 'Glacier National Park (USA)',
    lat: 48.7596,
    lng: -113.7870,
    language: 'en',
    shareCodePrefix: 'INT_NKE_RUN',
    shareChain: ['nike', 'marathon_john', 'sara_runs_fast', 'fit_community_hub', 'local_sf_runner']
  },

  // National Post (Green)
  {
    id: 'post_3',
    creatorId: 'green_aerogym',
    creatorName: 'Aero Gym USA',
    creatorUsername: 'aerogym_national',
    creatorAvatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=200',
    tier: 'national',
    category: 'business',
    caption: 'We are expanding to 12 new cities across the USA this summer! Fueling national persistence with high-intensity interval training. Claim your invitation pass through your national dashboard.',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    likes: 14200,
    views: 89000,
    timestamp: '2026-06-17T01:10:00Z',
    locationName: 'Denver, Colorado',
    lat: 39.7392,
    lng: -104.9903,
    language: 'en',
    shareCodePrefix: 'NAT_AER_USA',
    shareChain: ['aerogym_national', 'gym_rat_mark', 'denver_coach', 'fit_blogger_colorado']
  },

  // Local Posts (Red)
  {
    id: 'post_4',
    creatorId: 'red_golden_baker',
    creatorName: 'The Sourdough Baker',
    creatorUsername: 'sourdough_bake_sf',
    creatorAvatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200',
    tier: 'local',
    category: 'business',
    caption: 'Hot from the brick ovens! Our wild-yeast sourdough country loaves are ready. Fresh crust, soft crumb, 100% organic flour. Exclusively available at our Mission storefront in San Francisco today.',
    imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=600',
    likes: 852,
    views: 4120,
    timestamp: '2026-06-17T06:00:00Z',
    locationName: 'San Francisco, California',
    lat: 37.7749,
    lng: -122.4194,
    language: 'en',
    shareCodePrefix: 'LOC_SF_SOURDOUGH',
    shareChain: ['sourdough_bake_sf', 'mission_foodie_jen', 'sf_baking_club', 'user_is_hungry_too'],
    products: [
      { id: 'prod_bread', name: 'Signature Sourdough Batard', price: 9.50, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=150' },
      { id: 'prod_crostini', name: 'Crunchy Garlic Sourdough Bites', price: 6.00, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=150' }
    ]
  },
  {
    id: 'post_5',
    creatorId: 'red_denver_brewery',
    creatorName: 'Altitude Craft Hops',
    creatorUsername: 'altitude_hops',
    creatorAvatar: 'https://images.unsplash.com/photo-1558642084-fd074ec4bd2d?auto=format&fit=crop&q=80&w=200',
    tier: 'local',
    category: 'business',
    caption: 'Brewed at 5,280 feet. Introducing our Colorado Pine IPA. Infused with freshly picked mountain pine tips for a cold, crisp, refreshing breath. Come bring your neighbor for a seasonal tap sample!',
    imageUrl: 'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?auto=format&fit=crop&q=80&w=600',
    likes: 412,
    views: 1950,
    timestamp: '2026-06-16T21:45:00Z',
    locationName: 'Denver, Colorado (Larimer Square)',
    lat: 39.7482,
    lng: -104.9984,
    language: 'en',
    shareCodePrefix: 'LOC_DEN_BREW',
    shareChain: ['altitude_hops', 'skier_shred_99', 'larimer_resident']
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    creatorId: 'blue_popstar',
    creatorName: 'Aria Grande',
    creatorUsername: 'aria_g',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400',
    text: 'Backstage warmups before soundcheck 🫶🎤✨',
    tier: 'international',
    views: 2450000,
    viewers: ['justin_b', 'selena_fan', 'chicago_mark', 'investor_guest_user']
  },
  {
    id: 'story_2',
    creatorId: 'red_golden_baker',
    creatorName: 'The Sourdough Baker',
    creatorUsername: 'sourdough_bake_sf',
    creatorAvatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400',
    text: 'Pre-fermenting with love. Smells insane!',
    tier: 'local',
    views: 280,
    viewers: ['jenny_sf', 'chef_tony_italy', 'investor_guest_user']
  },
  {
    id: 'story_3',
    creatorId: 'blue_nike',
    creatorName: 'Nike Global',
    creatorUsername: 'nike',
    creatorAvatar: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200',
    imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=400',
    text: 'No alarms. Just commitment. 🧗‍♂️',
    tier: 'international',
    views: 1100000,
    viewers: ['climb_free', 'hiker_denver', 'sports_world_99']
  }
];

export const INDIGENOUS_PROJECTS: IndigenousProject[] = [
  {
    id: 'proj_1',
    title: 'Navajo AgriTech Solar Greenhouse',
    founder: 'Yannibah Begay',
    location: 'Shiprock, Navajo Nation',
    description: 'Empowering local families with decentralized, solar-heated geodesic growing domes. We combine ancient ancestral dry-farming wisdom with low-voltage sensor drip-irrigation controlled via theplatform.top API.',
    category: 'Agritech',
    goal: 15000,
    raised: 11200,
    supporters: 145
  },
  {
    id: 'proj_2',
    title: 'Andean Native Weaver Digital Marketplace',
    founder: 'Mateo Quispe',
    location: 'Cusco, Peru',
    description: 'Developing a localized web-to-mobile platform for authentic Quechua alpaca artisans to sell directly to verified international brands using theplatform.top escrow, eliminating highly exploitative middle-men cut fees.',
    category: 'Artisanal Commerce',
    goal: 8500,
    raised: 6900,
    supporters: 92
  },
  {
    id: 'proj_3',
    title: 'Appalachian Smart-Forest Herbal Log',
    founder: 'Clara Vance',
    location: 'Blue Ridge, West Virginia',
    description: 'An open-source sensory grid mapping ginseng and wild cohosh growth rates. Helps local forest-foragers verify non-poached native yields and preserve mountain biodiversity from illegal clear-cutting.',
    category: 'Ecology',
    goal: 5000,
    raised: 3100,
    supporters: 54
  }
];
