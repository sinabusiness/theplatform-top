/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Post, Story, CreatorProfile, VerificationTier } from './types';
import { INITIAL_POSTS, INITIAL_CREATORS, INITIAL_STORIES } from './mockData';
import { VerifiedBadge } from './components/VerifiedBadge';
import { ExploreMap } from './components/ExploreMap';
import { WalletAndFunding } from './components/WalletAndFunding';
import { InvestorPitchPanel } from './components/InvestorPitchPanel';
import { TracebackEngine } from './components/TracebackEngine';
import { motion, AnimatePresence } from 'motion/react';

import {
  Home,
  Compass,
  MessageSquare,
  PlusCircle,
  User,
  Heart,
  Bookmark,
  Send,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Grid,
  Search,
  Check,
  Plus,
  Smartphone,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Share2,
  Wallet,
  ShieldCheck,
  GitCommit
} from 'lucide-react';

export default function App() {
  // Navigation active state matching IG modes
  const [activeTab, setActiveTab] = useState<'feed' | 'explore' | 'direct' | 'wallet' | 'profile'>('feed');
  
  // Storage for posts, stories and creator lists
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  
  // Custom states matching interactive features
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({
    'post_1': true,
    'antonio_rossi_chef_post': false
  });
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  
  // Double-tap pop heart state
  const [popHeartId, setPopHeartId] = useState<string | null>(null);

  // Comments state to provide a real interactive writing flow
  const [comments, setComments] = useState<Record<string, { username: string; text: string; timestamp: string }[]>>({
    'post_1': [
      { username: 'aria_g', text: 'Stunning caption Master Ludwig! Truly inspiring ❤️', timestamp: '2h ago' },
      { username: 'albert_einstein', text: 'The vibrations of composition match the harmonics of space-time.', timestamp: '1h ago' }
    ],
    'antonio_rossi_chef_post': [
      { username: 'sourdough_bake_sf', text: 'I would love to supply you fresh rustic bread for this dish!', timestamp: '5h ago' },
      { username: 'nike_usa', text: 'Fueling great culinary achievements!', timestamp: '3h ago' }
    ],
    'nike_global_post_1': [
      { username: 'beethoven_official', text: 'To cross borders with determination, this is the tempo of greatness!', timestamp: '8h ago' }
    ]
  });
  const [activeCommentInputs, setActiveCommentInputs] = useState<Record<string, string>>({});

  // Active user data
  const [currentUser, setCurrentUser] = useState({
    username: 'sinasadehi',
    name: 'Sina Sadeghi',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    bio: 'Digital explorer & food enthusiast. Building high-fidelity responsive experiences. 🚀',
    followers: 1358,
    following: 482,
    postsCount: 12
  });
  
  // Dynamic Follow states for simulated creators
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>({
    'l_beethoven': true,
    'blue_nike': false
  });

  // Story Viewer Modal state
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);

  // Direct Screen conversations
  const [activeChatId, setActiveChatId] = useState<string>('l_beethoven');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isTypingSim, setIsTypingSim] = useState(false);
  const [chatHistory, setChatHistory] = useState<Record<string, { sender: 'me' | 'them'; text: string; time: string }[]>>({
    'l_beethoven': [
      { sender: 'them', text: 'Do you hear it? The symphony of silence.', time: '08:12 AM' },
      { sender: 'me', text: 'It is incredibly beautiful, Ludwig.', time: '08:14 AM' },
      { sender: 'them', text: 'Ah, if only my ears could match the resonance inside. Write to me anytime!', time: '08:15 AM' }
    ],
    'a_einstein': [
      { sender: 'them', text: 'Greetings, friend. Absolute space and time are relative.', time: 'Yesterday' },
      { sender: 'me', text: 'Does imagination beat knowledge?', time: 'Yesterday' },
      { sender: 'them', text: 'Without a doubt! Logic gets you from A to B. Imagination takes you everywhere.', time: 'Yesterday' }
    ],
    'green_chef_italy': [
      { sender: 'them', text: 'Ciao! Are you ready to prepare absolute authentic Roman pasta?', time: '2 days ago' }
    ]
  });
  const [currentMessageInput, setCurrentMessageInput] = useState('');

  // Create post state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState('');
  const [selectedPresetImage, setSelectedPresetImage] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600');
  const [newLocationName, setNewLocationName] = useState('Roma, Italy');
  const [newPostLat, setNewPostLat] = useState(41.9028);
  const [newPostLng, setNewPostLng] = useState(12.4964);

  // Wallet balance
  const [walletBalance, setWalletBalance] = useState(500);

  // Traceback: post selected for share-chain detail view
  const [tracebackPost, setTracebackPost] = useState<Post | null>(null);

  // Map Filter Area
  const [simulatedCity, setSimulatedCity] = useState('All');

  // Preset photos for posting
  const imagePresets = [
    { name: 'Organic Sourdough', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600' },
    { name: 'Gourmet Pasta Roman', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600' },
    { name: 'Premium Performance Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600' },
    { name: 'Sunset over Venice canals', url: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&q=80&w=600' },
    { name: 'Modern Architecture concrete', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600' },
  ];

  // Story playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedStory) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            // Move to next story, or auto-close
            const currentIndex = stories.findIndex((s) => s.id === selectedStory.id);
            if (currentIndex < stories.length - 1) {
              setSelectedStory(stories[currentIndex + 1]);
              return 0;
            } else {
              setSelectedStory(null);
              return 100;
            }
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [selectedStory, stories]);

  // Handle Likes (with pop interaction)
  const handleLikePost = (postId: string) => {
    const isLiked = !!likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isLiked }));
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  // Double tap heart pop-up effect
  const triggerDoubleTap = (postId: string) => {
    setPopHeartId(postId);
    if (!likedPosts[postId]) {
      handleLikePost(postId);
    }
    setTimeout(() => setPopHeartId(null), 850);
  };

  // Save/Bookmark
  const handleToggleSavePost = (postId: string) => {
    setSavedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Post new comment
  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const commentText = activeCommentInputs[postId]?.trim();
    if (!commentText) return;

    const freshComment = {
      username: currentUser.username,
      text: commentText,
      timestamp: 'Just now'
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), freshComment]
    }));

    setActiveCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Toggle creator follow status
  const handleToggleFollow = (creatorId: string) => {
    const isFollowing = !!followedCreators[creatorId];
    setFollowedCreators(prev => ({ ...prev, [creatorId]: !isFollowing }));
    // Update active currentUser statistics for fun
    setCurrentUser(prev => ({
      ...prev,
      following: isFollowing ? prev.following - 1 : prev.following + 1
    }));
  };

  // Submit new instagram custom post
  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostCaption.trim()) {
      alert('Please fill out a caption first!');
      return;
    }

    const newCreatedPost: Post = {
      id: `custom_post_${Date.now()}`,
      creatorId: 'me_user',
      creatorName: currentUser.name,
      creatorUsername: currentUser.username,
      creatorAvatar: currentUser.avatar,
      tier: 'local',
      category: 'personal',
      caption: newPostCaption,
      imageUrl: selectedPresetImage,
      likes: 1,
      views: 12,
      timestamp: new Date().toISOString(),
      locationName: newLocationName,
      lat: newPostLat,
      lng: newPostLng,
      language: 'en',
      shareCodePrefix: 'IG_MEMBER',
      shareChain: [currentUser.username]
    };

    setPosts([newCreatedPost, ...posts]);
    setNewPostCaption('');
    setCreateModalOpen(false);
    
    // Increment post count in stats
    setCurrentUser(prev => ({
      ...prev,
      postsCount: prev.postsCount + 1
    }));

    // Trigger feedback
    alert(`✨ Post successfully published! Added to Home Feed & tagged on the interactive Explore grid.`);
  };

  // Update post share chain (used by TracebackEngine)
  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  // Coordinates dropping from Google maps
  const handleMapPinDrop = (lat: number, lng: number, locationName: string) => {
    setNewPostLat(parseFloat(lat.toFixed(4)));
    setNewPostLng(parseFloat(lng.toFixed(4)));
    setNewLocationName(locationName);
    
    // Open create post modal if clicking on map while active
    setCreateModalOpen(true);
  };

  // Process Direct Messaging answers with customized dialogue matches (Mock engine)
  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessageInput.trim()) return;

    const userText = currentMessageInput;
    const activeContactId = activeChatId;

    // Append user message
    const updatedMeHistory = [...(chatHistory[activeContactId] || []), {
      sender: 'me' as const,
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];

    setChatHistory(prev => ({
      ...prev,
      [activeContactId]: updatedMeHistory
    }));
    setCurrentMessageInput('');

    // Start simulation response typing state
    setIsTypingSim(true);

    setTimeout(() => {
      let buddyAnswer = "That is super interesting! Tell me more.";
      const matchedCreator = INITIAL_CREATORS.find(c => c.id === activeContactId || c.username === activeContactId);
      const name = matchedCreator ? matchedCreator.name : 'Creator';

      if (activeContactId === 'l_beethoven' || activeContactId.includes('beethoven')) {
        const answers = [
          "Words fail me! But in tone, I find supreme expression. Speak further to my music!",
          "I compositionally compose because what is inside my heart must break out!",
          "Ah! Freedom and progress are the ultimate movements of life. Keep pushing forward."
        ];
        buddyAnswer = answers[Math.floor(Math.random() * answers.length)];
      } else if (activeContactId === 'a_einstein' || activeContactId.includes('einstein')) {
        const answers = [
          "A wonderful point. We must remember that space, time, and gravity are woven into a single cosmic blanket.",
          "Curiosity is its own excuse for existing. Never stop asking noble questions!",
          "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe."
        ];
        buddyAnswer = answers[Math.floor(Math.random() * answers.length)];
      } else if (activeContactId === 'green_chef_italy' || activeContactId.includes('rossi')) {
        const answers = [
          "Mamma mia! That sounds delicious, but first you must temper the Parmigiano-Reggiano correctly!",
          "To cook authentic Roman carbonara, never—and I mean NEVER—add heavy cream!",
          "Savor the genuine taste of Italian legacy! Beautiful cooking is pure passion."
        ];
        buddyAnswer = answers[Math.floor(Math.random() * answers.length)];
      } else {
        buddyAnswer = `Greetings from @${matchedCreator?.username || 'creator'}! Thanks for reaching out to me! Join my community feed.`;
      }

      setChatHistory(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), {
          sender: 'them' as const,
          text: buddyAnswer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
      }));
      setIsTypingSim(false);
    }, 1400);
  };

  // Find currently active chat avatar or username
  const activeChatProfile = INITIAL_CREATORS.find(c => c.id === activeChatId) || INITIAL_CREATORS[0];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans selection:bg-neutral-800 selection:text-white relative" id="instagram-sleek-container">
      
      {/* 📱 TOP HEADER (MOBILE VIEWPORT ONLY) */}
      <header className="md:hidden bg-black border-b border-neutral-900 py-3 px-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-xl font-bold font-serif tracking-tight text-white italic">
          theplatform<span className="text-rose-500 font-sans font-extrabold">.top</span>
        </h1>
        
        <div className="flex items-center gap-4">
          <button onClick={() => { setActiveTab('explore'); }} className="text-white relative">
            <Compass className="w-5.5 h-5.5 text-neutral-200" />
          </button>
          
          <button onClick={() => { setActiveTab('direct'); }} className="text-white relative">
            <MessageSquare className="w-5.5 h-5.5 text-neutral-250" />
            <span className="absolute -top-1 -right-1.5 bg-rose-600 text-[8px] font-mono px-1 py-0.5 rounded-full text-white font-bold animate-pulse">
              3
            </span>
          </button>
        </div>
      </header>

      {/* 💻 INSTAGRAM WEB LEFT SIDEBAR (DESKTOP) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-neutral-900 bg-black py-8 px-6 shrink-0 h-screen sticky top-0 justify-between">
        <div className="space-y-8">
          
          {/* Brand/Logo Layout */}
          <div className="px-2">
            <h1 className="text-2xl font-serif font-black tracking-tight text-white italic flex items-center gap-1 leading-none select-none">
              theplatform<span className="text-rose-500 font-sans font-extrabold">.top</span>
            </h1>
            <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-neutral-500 block mt-1.5 uppercase">EXPLORE & CHAT EDITION</span>
          </div>

          {/* Navigation Links match Instagram style */}
          <nav className="space-y-1.5 text-left">
            {[
              { id: 'feed', label: 'Home Feed', icon: Home },
              { id: 'explore', label: 'Explore & Map', icon: Compass },
              { id: 'direct', label: 'Direct Message', icon: MessageSquare, badge: '3' },
              { id: 'wallet', label: 'Wallet', icon: Wallet },
              { id: 'profile', label: 'My Profile', icon: User },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-xs font-bold leading-none cursor-pointer group ${
                    isSelected ? 'bg-neutral-900 text-white font-extrabold' : 'text-neutral-400 hover:text-white hover:bg-neutral-950'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                    <span className="tracking-wide">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-rose-600 text-white font-mono text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* QUICK CREATE POST BUTTON */}
            <button
              onClick={() => { setCreateModalOpen(true); }}
              className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all text-xs font-bold text-sky-400 hover:text-sky-300 hover:bg-neutral-950 cursor-pointer text-left"
            >
              <PlusCircle className="w-5 h-5 text-sky-400" />
              <span className="tracking-wide">Create Post</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Mini Authenticated User Card */}
        <div className="space-y-4 pt-6 border-t border-neutral-900 text-left">
          <div className="flex items-center gap-3 px-1">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-9 h-9 rounded-full object-cover border border-neutral-800"
            />
            <div className="text-left leading-tight truncate">
              <p className="text-[11px] font-bold text-white truncate">
                @{currentUser.username}
              </p>
              <p className="text-[9.5px] text-neutral-500 truncate">{currentUser.name}</p>
            </div>
          </div>

          <div className="text-[8.5px] text-neutral-600 font-mono uppercase tracking-wider">
            © 2026 INSTAGRID EXPERIMENT
          </div>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT FEEDWORK SCREEN */}
      <main className="flex-1 overflow-y-auto bg-black p-3 md:p-8 flex justify-center pb-20 md:pb-8">
        <div className="w-full max-w-4xl space-y-6">

          {/* TAB 1: INSTAGRAM DISCIPLINE FEED STREAMS */}
          {activeTab === 'feed' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* PRIMARY FEED PANEL COLUMN */}
              <div className="lg:col-span-7 space-y-6">

                {/* 1. HORIZONTAL STORIES TAPE (INSTAGRAM WEB EXACT LOOK) */}
                <div className="bg-black border border-neutral-900 rounded-2xl p-4 text-left">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-3 font-mono">
                    Active Story Highlights
                  </span>
                  
                  <div className="flex gap-4 overflow-x-auto pb-1.5 scrollbar-none">
                    {/* User's own creator highlight */}
                    <div className="flex flex-col items-center shrink-0 p-1">
                      <div className="relative">
                        <div className="w-13 h-13 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900">
                          <img
                            src={currentUser.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button 
                          onClick={() => setCreateModalOpen(true)}
                          className="absolute bottom-0 right-0 bg-sky-500 text-black rounded-full p-0.5 border border-black flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 font-bold" />
                        </button>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-medium font-sans mt-2 max-w-[65px] truncate">
                        Your Story
                      </span>
                    </div>

                    {/* Array of Simulated Highlights */}
                    {stories.map((story) => (
                      <button
                        key={story.id}
                        onClick={() => setSelectedStory(story)}
                        className="flex flex-col items-center shrink-0 group focus:outline-none focus:scale-105 transition-all p-1 cursor-pointer"
                      >
                        <div className="relative">
                          {/* Rich Pink-Red Gradient story outline ring */}
                          <span className="absolute -inset-1 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600" />
                          
                          <div className="relative w-13 h-13 rounded-full overflow-hidden border border-black bg-neutral-900">
                            <img
                              src={story.creatorAvatar}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-bold mt-2 max-w-[70px] truncate group-hover:text-white transition-colors">
                          @{story.creatorUsername}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. INSTAGRAM MAIN FEED LIST */}
                <div className="space-y-6">
                  {posts.map((post) => {
                    const hasLiked = !!likedPosts[post.id];
                    const hasSaved = !!savedPosts[post.id];
                    const postComments = comments[post.id] || [];

                    return (
                      <div
                        key={post.id}
                        id={`post-feed-card-${post.id}`}
                        className="bg-black border border-neutral-900 rounded-2xl overflow-hidden text-left flex flex-col transition-colors"
                      >
                        {/* Feed Card Header */}
                        <div className="flex items-center justify-between p-3.5 border-b border-neutral-950">
                          <div className="flex items-center gap-3">
                            <div className="relative cursor-pointer">
                              {/* Glowing purple outline ring to simulate highlighting */}
                              <span className="absolute -inset-0.5 rounded-full p-[1px] bg-gradient-to-tr from-yellow-500 to-pink-500" />
                              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-black bg-neutral-900">
                                <img
                                  src={post.creatorAvatar}
                                  alt=""
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-1.5 leading-none">
                                <h5 className="text-xs font-bold text-white leading-none hover:underline cursor-pointer">
                                  {post.creatorName}
                                </h5>
                                <VerifiedBadge tier={post.tier as VerificationTier} size="xs" />
                              </div>
                              <span className="text-[10px] text-neutral-500">@{post.creatorUsername}</span>
                            </div>
                          </div>

                          {/* Geotag Indicator */}
                          <button
                            onClick={() => {
                              setSimulatedCity(post.locationName.includes(',') ? post.locationName.split(',')[0].trim() : post.locationName);
                              setActiveTab('explore');
                            }}
                            className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 text-neutral-400 hover:text-white rounded-full py-1 px-3 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <MapPin className="w-3 h-3 text-rose-500" />
                            <span>{post.locationName}</span>
                          </button>
                        </div>

                        {/* Responsive Post Image Container (Includes double tap liking) */}
                        <div
                          onDoubleClick={() => triggerDoubleTap(post.id)}
                          className="relative aspect-square w-full bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer group"
                        >
                          <img
                            src={post.imageUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-[1.01]"
                          />
                          
                          {/* Popping Central Heart Animation */}
                          <AnimatePresence>
                            {popHeartId === post.id && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 1.4, 0.95, 1], opacity: [0, 1, 1, 0] }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                className="absolute inset-0 flex items-center justify-center text-white pointer-events-none z-30"
                              >
                                <Heart className="w-24 h-24 text-red-500 fill-current drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Quick instruction notice overlay on hover */}
                          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded px-2.5 py-1 text-[8.5px] uppercase tracking-wider text-neutral-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                            Double tap to Like ❤️
                          </div>
                        </div>

                        {/* INSTAGRAM ACTION BAR */}
                        <div className="p-4 space-y-3.5">
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-white">
                              {/* Heart Like button */}
                              <button
                                onClick={() => handleLikePost(post.id)}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                              >
                                {hasLiked ? (
                                  <Heart className="w-6 h-6 text-red-500 fill-current animate-pulse" />
                                ) : (
                                  <Heart className="w-6 h-6 text-neutral-200 hover:text-rose-400" />
                                )}
                              </button>

                              {/* Message DM launch button */}
                              <button
                                onClick={() => {
                                  if (post.creatorId !== 'me_user') {
                                    setActiveChatId(post.creatorId);
                                    setActiveTab('direct');
                                  } else {
                                    alert('This is your own published post!');
                                  }
                                }}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95 text-neutral-200 hover:text-sky-400 cursor-pointer"
                                title="Draft message in Direct Chat"
                              >
                                <MessageSquare className="w-6 h-6" />
                              </button>

                              {/* Map Geo check button */}
                              <button
                                onClick={() => {
                                  setSimulatedCity(post.locationName.includes(',') ? post.locationName.split(',')[0].trim() : post.locationName);
                                  setActiveTab('explore');
                                }}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95 text-neutral-200 hover:text-amber-400 cursor-pointer"
                                title="Pin Point on Grid"
                              >
                                <Share2 className="w-6 h-6" />
                              </button>

                              {/* Share Chain button */}
                              <button
                                onClick={() => setTracebackPost(post)}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95 text-neutral-200 hover:text-emerald-400 cursor-pointer"
                                title="View Share Chain"
                              >
                                <GitCommit className="w-6 h-6" />
                              </button>
                            </div>

                            {/* Bookmark save status */}
                            <button
                              onClick={() => handleToggleSavePost(post.id)}
                              className="focus:outline-none transition-transform hover:scale-110 active:scale-95 text-neutral-200 hover:text-emerald-400 cursor-pointer"
                            >
                              <Bookmark className={`w-6 h-6 ${hasSaved ? 'text-emerald-500 fill-current' : ''}`} />
                            </button>
                          </div>

                          {/* LIKES COUNTER ROW */}
                          <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-100">
                            <span>{post.likes.toLocaleString()} likes</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-700" />
                            <span className="text-neutral-500 font-mono text-[10px] font-normal">{(post.views + (hasLiked ? 1 : 0)).toLocaleString()} impressions</span>
                          </div>

                          {/* AUTHOR NAME & CAPTION */}
                          <p className="text-[12.5px] leading-relaxed text-neutral-200">
                            <span className="font-extrabold text-white mr-2 cursor-pointer hover:underline">
                              @{post.creatorUsername}
                            </span>
                            {post.caption}
                          </p>

                          {/* RE-ACTIVE COMMENTS LIST WRAPPER */}
                          {postComments.length > 0 && (
                            <div className="space-y-1.5 pt-2 border-t border-neutral-950">
                              {postComments.map((comm, idx) => (
                                <div key={idx} className="text-xs flex items-start justify-between">
                                  <p className="text-neutral-300">
                                    <strong className="text-white font-semibold mr-1.5">@{comm.username}</strong>
                                    {comm.text}
                                  </p>
                                  <span className="text-[9px] text-neutral-600 font-mono italic">{comm.timestamp}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* TIMELINE NOTIFICATION & REPLY COMPOSER FORM */}
                          <div className="pt-3 border-t border-neutral-900 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                            <span className="text-[9px] text-neutral-500 font-semibold uppercase tracking-wider font-mono">
                              Published: {new Date(post.timestamp).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>

                            <form
                              onSubmit={(e) => handleAddComment(e, post.id)}
                              className="flex items-center gap-2 flex-1 md:max-w-[280px]"
                            >
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                value={activeCommentInputs[post.id] || ''}
                                onChange={(e) => setActiveCommentInputs({
                                  ...activeCommentInputs,
                                  [post.id]: e.target.value
                                })}
                                className="w-full bg-transparent text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-0 border-none p-1"
                              />
                              <button
                                type="submit"
                                disabled={!activeCommentInputs[post.id]?.trim()}
                                className="text-sky-400 disabled:text-neutral-700 hover:text-sky-300 font-extrabold text-xs tracking-wide cursor-pointer uppercase shrink-0 transition-colors"
                              >
                                Post
                              </button>
                            </form>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* DESKTOP SECONDARY RIGHT BAR (SUGGESTIONS & MINIMAL PROFILE OVERVIEW) */}
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                
                {/* 1. Quick Profile Card */}
                <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl text-left flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover border border-neutral-800"
                    />
                    <div>
                      <p className="text-xs font-black text-white hover:underline cursor-pointer">
                        @{currentUser.username}
                      </p>
                      <p className="text-[10px] text-neutral-500">{currentUser.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-sky-400 hover:text-sky-350 text-[10.5px] font-bold uppercase cursor-pointer"
                  >
                    View Account
                  </button>
                </div>

                {/* 2. Suggestions for you list */}
                <div className="bg-neutral-950 border border-neutral-900 p-4.5 rounded-xl text-left space-y-3">
                  <span className="text-[10px] uppercase text-neutral-500 font-black tracking-widest block font-mono">
                    Suggested Personalities
                  </span>
                  
                  <div className="space-y-3.5">
                    {INITIAL_CREATORS.slice(0, 4).map((c) => {
                      const following = !!followedCreators[c.id];
                      return (
                        <div key={c.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={c.avatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-neutral-900 bg-neutral-900"
                            />
                            <div className="leading-tight">
                              <p className="text-[11px] font-bold text-white flex items-center gap-1">
                                {c.username}
                                <VerifiedBadge tier={c.tier} size="xs" />
                              </p>
                              <p className="text-[9.5px] text-neutral-500 capitalize max-w-[120px] truncate">
                                {c.category === 'vintage_personnel' ? 'historical figure' : c.category}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleToggleFollow(c.id)}
                            className={`text-[10px] font-bold px-3 py-1 rounded-full cursor-pointer transition-colors ${
                              following
                                ? 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-850'
                                : 'bg-white text-black hover:bg-neutral-200'
                            }`}
                          >
                            {following ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Guide/Tip panel */}
                <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-xl text-left space-y-2 text-xs">
                  <span className="text-[9px] uppercase font-mono font-bold text-neutral-500 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    How to tag on real map:
                  </span>
                  <p className="text-[10px] text-neutral-450 leading-relaxed font-sans">
                    Switch to the **Explore & Map** tab to view your posts instantly pinned on a live satellite grid! Double tap images on this feed to leave standard interactive hearts.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: EXPLORE TAB (INTEGRATES THE RECONSTRUCTED INSTAGRID GOOGLE MAPS) */}
          {activeTab === 'explore' && (
            <div className="space-y-4">
              <div className="bg-neutral-950 p-4.5 rounded-2xl border border-neutral-900 text-left space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-rose-500 animate-spin-slow" />
                  Sleek Interactive Spatial Explorer
                </h3>
                <p className="text-xs text-neutral-400 leading-normal">
                  All posts are plotted dynamically based on their coordinates inside our layout. Tap coordinates on the map or click a post marker thumbnail to preview the content lightbox instantly.
                </p>
              </div>

              {/* Call the redesigned real Google Map component */}
              <ExploreMap
                posts={posts}
                onSelectPost={(post) => {
                  // Handled locally
                }}
                selectedPost={null}
                currentSimulatedCity={simulatedCity}
                onCityChange={(city) => setSimulatedCity(city)}
                isVerifiedCreatorMode={true}
                onPinNewLocation={handleMapPinDrop}
              />
            </div>
          )}

          {/* TAB 3: DIRECT MESSAGES SECURED INTERACTIVE INTERFACE */}
          {activeTab === 'direct' && (
            <div className="bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden h-[600px] flex text-left">
              
              {/* Chats List Sidebar panel */}
              <div className="w-full md:w-80 border-r border-neutral-900 flex flex-col shrink-0">
                <div className="p-4 border-b border-neutral-900 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-white tracking-widest">
                      Direct Messaging
                    </span>
                    <span className="text-[9px] bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded-full font-bold">
                      BETA LOBBY
                    </span>
                  </div>

                  {/* Search inside DM contact */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      className="w-full bg-black border border-neutral-900 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-neutral-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Conversation Scrollers */}
                <div className="flex-1 overflow-y-auto divide-y divide-neutral-950">
                  {INITIAL_CREATORS
                    .filter(c => c.username.toLowerCase().includes(chatSearchQuery.toLowerCase()))
                    .map((creator) => {
                      const isActive = activeChatId === creator.id;
                      const hasHistory = chatHistory[creator.id] || [];
                      const lastMsg = hasHistory[hasHistory.length - 1]?.text || 'No messages yet';

                      return (
                        <button
                          key={creator.id}
                          onClick={() => setActiveChatId(creator.id)}
                          className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors hover:bg-neutral-900 cursor-pointer ${
                            isActive ? 'bg-neutral-900' : ''
                          }`}
                        >
                          <div className="relative">
                            <span className="absolute -inset-0.5 rounded-full p-[0.5px] bg-gradient-to-tr from-rose-500 to-amber-500" />
                            <img
                              src={creator.avatar}
                              alt=""
                              className="relative w-10 h-10 rounded-full object-cover border border-black bg-neutral-900"
                            />
                          </div>

                          <div className="flex-1 min-w-0 leading-tight">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white text-ellipsis overflow-hidden flex items-center gap-1">
                                {creator.name}
                                <VerifiedBadge tier={creator.tier} size="xs" />
                              </span>
                            </div>
                            <span className="text-[10.5px] text-neutral-400 block truncate mt-0.5">
                              {lastMsg}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Chat Window Frame component */}
              <div className="flex-1 flex flex-col bg-black">
                {activeChatId ? (
                  <>
                    {/* Header bar */}
                    <div className="p-4 border-b border-neutral-900 bg-neutral-950 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={activeChatProfile.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-neutral-900 bg-neutral-900"
                        />
                        <div>
                          <p className="text-xs font-bold text-white flex items-center gap-1">
                            {activeChatProfile.name}
                            <VerifiedBadge tier={activeChatProfile.tier} size="xs" />
                          </p>
                          <p className="text-[9.5px] text-green-500 font-bold uppercase tracking-widest font-mono">
                            ● Online Simulator
                          </p>
                        </div>
                      </div>

                      <div className="text-[9px] bg-neutral-900 px-2.5 py-1 rounded-md text-neutral-400 font-mono">
                        CHAT ID: {activeChatProfile.username.toUpperCase()}
                      </div>
                    </div>

                    {/* Messages Body Scroll frame */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col justify-end bg-black">
                      <div className="space-y-3.5">
                        
                        {/* Static Intro Header */}
                        <div className="text-center py-4 space-y-1.5 border-b border-neutral-900/60 pb-5">
                          <img
                            src={activeChatProfile.avatar}
                            alt=""
                            className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-neutral-900 bg-neutral-900"
                          />
                          <h4 className="text-xs font-extrabold text-white flex items-center justify-center gap-1 mt-2">
                            {activeChatProfile.name}
                            <VerifiedBadge tier={activeChatProfile.tier} size="xs" />
                          </h4>
                          <span className="text-[10px] text-neutral-500 block">@{activeChatProfile.username} • {activeChatProfile.followers.toLocaleString()} followers</span>
                          <span className="text-[9.5px] italic text-neutral-450 block max-w-sm mx-auto">{activeChatProfile.bio}</span>
                        </div>

                        {/* Speech bubbles */}
                        {(chatHistory[activeChatId] || []).map((message, idx) => (
                          <div
                            key={idx}
                            className={`flex ${
                              message.sender === 'me' ? 'justify-end' : 'justify-start'
                            } items-end gap-2`}
                          >
                            {message.sender === 'them' && (
                              <img
                                src={activeChatProfile.avatar}
                                alt=""
                                className="w-5 h-5 rounded-full object-cover shrink-0"
                              />
                            )}
                            <div className="flex flex-col">
                              <div
                                className={`px-4 py-2 text-xs rounded-2xl max-w-xs md:max-w-md ${
                                  message.sender === 'me'
                                    ? 'bg-sky-600 text-white rounded-br-none'
                                    : 'bg-neutral-900 text-neutral-100 rounded-bl-none border border-neutral-850'
                                }`}
                              >
                                {message.text}
                              </div>
                              <span className="text-[8px] text-neutral-600 font-mono self-end mt-1">
                                {message.time}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* Interactive typing status feedback */}
                        {isTypingSim && (
                          <div className="flex justify-start items-center gap-2">
                            <span className="text-[9.5px] uppercase font-mono text-neutral-500 tracking-wider">
                              @{activeChatProfile.username} is composing thoughts...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Messenger composing footer form */}
                    <form
                      onSubmit={handleSendDirectMessage}
                      className="p-3 border-t border-neutral-900 bg-neutral-950 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder={`Message @${activeChatProfile.username}...`}
                        value={currentMessageInput}
                        onChange={(e) => setCurrentMessageInput(e.target.value)}
                        className="flex-1 bg-black border border-neutral-900 rounded-full py-2 px-4 text-xs text-white placeholder-neutral-605 focus:outline-none focus:border-neutral-700"
                      />
                      <button
                        type="submit"
                        disabled={!currentMessageInput.trim()}
                        className="p-2 text-sky-400 disabled:opacity-40 font-bold hover:text-sky-300 transition-colors shrink-0 cursor-pointer"
                      >
                        <Send className="w-5.5 h-5.5" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-zinc-650 mb-3" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Select conversations</h3>
                    <p className="text-xs text-neutral-500 max-w-xs mt-1">
                      Choose any historical figure or global athlete from the lobby tray to exchange dialogues!
                    </p>
                  </div>
                )}
              </div>

              {/* Verification & Pricing section */}
              <div className="pt-4 border-t border-neutral-900">
                <div className="bg-neutral-950 p-4.5 rounded-2xl border border-neutral-900 text-left space-y-2 mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    Verification & Pricing
                  </h3>
                  <p className="text-xs text-neutral-400 leading-normal">
                    Tier-based subscription calculator and SSL-style web verification badge embed for your business.
                  </p>
                </div>
                <InvestorPitchPanel />
              </div>

            </div>
          )}

          {/* TAB 4: WALLET & FUNDING */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <div className="bg-neutral-950 p-4.5 rounded-2xl border border-neutral-900 text-left space-y-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  Wallet & Community Funding
                </h3>
                <p className="text-xs text-neutral-400 leading-normal">
                  Manage your iCurrency balance, apply referral credits, and back indigenous tech projects.
                </p>
              </div>
              <WalletAndFunding
                walletBalance={walletBalance}
                onUpdateWallet={setWalletBalance}
              />
            </div>
          )}

          {/* TAB 5: MY PROFILE CARD GRID PREVIEWS */}
          {activeTab === 'profile' && (
            <div className="space-y-8 text-left">
              
              {/* Profile Bio Details Row */}
              <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 items-center">
                <div className="relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 bg-neutral-900 border-neutral-800">
                    <img
                      src={currentUser.avatar}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black rounded-full p-1 border border-black text-rose-500">
                    <Check className="w-4 h-4" />
                  </span>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                    <h2 className="text-lg font-black text-white">@{currentUser.username}</h2>
                    <span className="text-[9.5px] uppercase font-mono bg-sky-500/10 border border-sky-500/30 text-sky-400 px-2.5 py-0.5 rounded font-black tracking-widest">
                      VIP Beta Tester
                    </span>
                  </div>

                  {/* Following Counts metric */}
                  <div className="flex items-center gap-6 justify-center md:justify-start text-xs font-mono text-zinc-300">
                    <p>
                      <strong className="text-white text-sm font-bold">{currentUser.postsCount}</strong> posts
                    </p>
                    <p>
                      <strong className="text-white text-sm font-bold">{currentUser.followers.toLocaleString()}</strong> followers
                    </p>
                    <p>
                      <strong className="text-white text-sm font-bold">{currentUser.following}</strong> following
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white leading-none">{currentUser.name}</p>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold block">Developer Account</span>
                    <p className="text-xs text-neutral-400 leading-normal max-w-md mt-1.5">{currentUser.bio}</p>
                  </div>
                </div>
              </div>

              {/* Grid Section title */}
              <div className="space-y-4">
                <div className="border-b border-light-900 pb-2 flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-2">
                    <Grid className="w-4 h-4" />
                    My Uploads & Saves
                  </span>
                  
                  <span className="text-[9px] text-neutral-500 font-mono">
                    Showing latest grid nodes
                  </span>
                </div>

                {/* Columns layout grid of square posts */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {posts
                    .filter(p => p.creatorId === 'me_user' || p.creatorId === 'guest_user' || p.id === 'custom_post_preset')
                    .map((post) => (
                      <div
                        key={post.id}
                        className="relative aspect-square rounded-xl overflow-hidden bg-neutral-950 group cursor-pointer border border-neutral-900"
                        onClick={() => {
                          alert(`📸 "${post.caption}" \nPublished from geotag: ${post.locationName} \nImpression counters: ${post.views} views.`);
                        }}
                      >
                        <img
                          src={post.imageUrl}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-xs space-y-1.5">
                          <Heart className="w-5 h-5 text-red-500 fill-current" />
                          <span className="font-bold text-white">{post.likes} Likes</span>
                          <span className="text-[9px] text-neutral-400 font-mono mt-1">{post.locationName}</span>
                        </div>
                      </div>
                    ))}

                  {/* Empty state generator */}
                  {posts.filter(p => p.creatorId === 'me_user' || p.creatorId === 'guest_user').length === 0 && (
                    <div className="col-span-full bg-neutral-950 p-10 text-center rounded-2xl border border-neutral-900">
                      <Plus className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                      <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">No photos published yet</p>
                      <p className="text-[10px] text-zinc-500 mt-1 max-w-xs mx-auto">
                        Tap "Create Post" in the navigation sidebar or click the map in Creator mode to drop coordinates and share your very first post!
                      </p>
                      <button
                        onClick={() => setCreateModalOpen(true)}
                        className="mt-4 bg-white text-black text-[10px] font-bold uppercase tracking-wide py-1.5 px-4 rounded-full hover:bg-neutral-200"
                      >
                        Upload Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* 📱 INTERACTIVE MOBILE SCREEN NAVIGATION FOOTER BAR (VISIBLE ON COMPACT PHONES ONLY) */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-950 border-t border-neutral-900 py-2.5 px-6 flex items-center justify-between z-40">
        {[
          { id: 'feed', icon: Home },
          { id: 'explore', icon: Compass },
          { id: 'direct', icon: MessageSquare },
          { id: 'wallet', icon: Wallet },
          { id: 'profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="relative p-1.5"
            >
              <Icon className={`w-6 h-6 ${isSelected ? 'text-white scale-105' : 'text-neutral-500'}`} />
              {tab.id === 'direct' && (
                <span className="absolute top-1.5 right-1 bg-rose-600 w-1.5 h-1.5 rounded-full animate-ping" />
              )}
            </button>
          );
        })}

        {/* Floating Mobile Create Post trigger */}
        <button
          onClick={() => setCreateModalOpen(true)}
          className="p-1.5 text-sky-400"
        >
          <PlusCircle className="w-6 h-6 text-sky-400" />
        </button>
      </footer>

      {/* 🎬 1. STORY VIEWER MODAL OVERLAY (INSTAGRAM HIGH-FIDELITY IMMERSIVE FLOW) */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-55 flex items-center justify-center p-4"
          >
            {/* Dark closing backdrop click */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setSelectedStory(null)} />

            <div className="relative w-full max-w-md aspect-[9/16] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-900 flex flex-col justify-between shadow-2xl p-4 text-left z-10">
              
              {/* Header block with Story owner metadata and Progress Indicator */}
              <div className="space-y-3.5 z-10">
                {/* Horizontal Fill progress duration bar */}
                <div className="flex gap-1 bg-neutral-800 h-1 rounded-full overflow-hidden">
                  {stories.map((stor) => {
                    const isPassed = stories.findIndex(s => s.id === stor.id) < stories.findIndex(s => s.id === selectedStory.id);
                    const isActive = stor.id === selectedStory.id;
                    return (
                      <div key={stor.id} className="flex-1 bg-neutral-700 h-full rounded-full">
                        <div
                          className="bg-white h-full transition-all duration-100"
                          style={{
                            width: isPassed ? '100%' : isActive ? `${storyProgress}%` : '0%'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Profile detail controls */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedStory.creatorAvatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-neutral-900"
                    />
                    <div>
                      <p className="text-xs font-black flex items-center gap-1.5 leading-none">
                        @{selectedStory.creatorUsername}
                        <VerifiedBadge tier={selectedStory.tier} size="xs" />
                      </p>
                      <span className="text-[9.5px] text-zinc-400 leading-none">Simulated Event</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const idx = stories.findIndex(s => s.id === selectedStory.id);
                        if (idx > 0) setSelectedStory(stories[idx - 1]);
                      }}
                      disabled={stories.findIndex(s => s.id === selectedStory.id) === 0}
                      className="text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        const idx = stories.findIndex(s => s.id === selectedStory.id);
                        if (idx < stories.length - 1) setSelectedStory(stories[idx + 1]);
                        else setSelectedStory(null);
                      }}
                      className="text-neutral-400 hover:text-white cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedStory(null)}
                      className="text-neutral-400 hover:text-white pointer-events-auto cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Central Immersive graphic */}
              <div className="absolute inset-0 z-0">
                <img
                  src={selectedStory.imageUrl}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Visual shadow gradient overlay for readability of bottom text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              </div>

              {/* Immersive details or overlay story caption overlay */}
              <div className="z-10 p-4 bg-black/40 backdrop-blur-sm border border-neutral-900/40 rounded-xl space-y-2">
                <p className="text-xs text-white leading-relaxed">
                  <span className="font-extrabold mr-1 shadow-sm">@{selectedStory.creatorUsername}:</span>
                  {selectedStory.text || "Exploring organic frontiers and composition schedules! 🌌"}
                </p>
                <div className="flex items-center justify-between text-[8.5px] font-mono text-neutral-400 uppercase font-semibold">
                  <span>VIEWS: {selectedStory.views.toLocaleString()} members</span>
                  <span className="text-sky-400">Verified Highlight</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🪵 2. CREATE NEW POST DIALOG MODAL (COMPLETES THE SOCIAL PUBLISHING CYCLE) */}
      <AnimatePresence>
        {createModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-55 flex items-center justify-center p-4"
          >
            {/* Click to close backdrop */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setCreateModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden shadow-2xl z-10 text-left"
            >
              {/* Header */}
              <div className="p-4 border-b border-neutral-900 flex items-center justify-between bg-neutral-950">
                <div className="flex items-center gap-2">
                  <PlusCircle className="text-sky-400 w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    Publish New Post on theplatform.top
                  </span>
                </div>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="text-neutral-500 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePublishPost} className="p-5 space-y-4">
                
                {/* Preset image carousel selection */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block tracking-wider">
                    Select Graphic Asset:
                  </span>
                  <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                    {imagePresets.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedPresetImage(img.url)}
                        className={`text-[9.5px] px-3.5 py-1 rounded-full border shrink-0 transition-colors uppercase font-mono tracking-tight cursor-pointer ${
                          selectedPresetImage === img.url
                            ? 'bg-sky-500/10 border-sky-450 text-sky-400 font-extrabold'
                            : 'bg-black border-neutral-900 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                  
                  {/* Selected image element thumbnail check */}
                  <div className="relative aspect-square max-h-36 rounded-xl overflow-hidden border border-neutral-900 bg-neutral-900 mt-2">
                    <img 
                      src={selectedPresetImage} 
                      alt="Preset selected" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Caption draft textarea */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase block tracking-wider">
                    Caption:
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newPostCaption}
                    onChange={(e) => setNewPostCaption(e.target.value)}
                    placeholder="Write a custom creative layout caption..."
                    className="w-full bg-black border border-neutral-900 rounded-xl p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700"
                  />
                </div>

                {/* Geographical specifications coordinates tag info */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="bg-black border border-neutral-900 rounded-lg p-2.5">
                    <span className="text-neutral-500 uppercase font-black tracking-tight block text-[8px]">Latitude Tag</span>
                    <input 
                      type="number" 
                      step="any"
                      required
                      value={newPostLat}
                      onChange={(e) => setNewPostLat(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent text-xs font-bold font-mono text-zinc-300 focus:outline-none mt-1 border-none p-0"
                    />
                  </div>
                  <div className="bg-black border border-neutral-900 rounded-lg p-2.5">
                    <span className="text-neutral-500 uppercase font-black tracking-tight block text-[8px]">Longitude Tag</span>
                    <input 
                      type="number" 
                      step="any"
                      required
                      value={newPostLng}
                      onChange={(e) => setNewPostLng(parseFloat(e.target.value) || 0)}
                      className="w-full bg-transparent text-xs font-bold font-mono text-zinc-300 focus:outline-none mt-1 border-none p-0"
                    />
                  </div>

                  {/* Geotag label block */}
                  <div className="col-span-2 bg-black border border-neutral-900 rounded-lg p-2.5">
                    <span className="text-neutral-500 uppercase font-black tracking-tight block text-[8px]">Location Label Name</span>
                    <input 
                      type="text" 
                      required
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      placeholder="e.g., Central Park, NYC"
                      className="w-full bg-transparent text-xs font-bold text-zinc-350 focus:outline-none mt-1 border-none p-0"
                    />
                  </div>
                </div>

                <div className="text-[9.5px] italic text-neutral-500 font-sans leading-snug">
                  *Tip: If you're on the Explore map, clicking any point on the map automatically grabs the latitude/longitude and opens this form!
                </div>

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-neutral-200 text-black font-extrabold uppercase py-2.5 text-[10.5px] tracking-widest transition-colors rounded-xl cursor-pointer"
                >
                  Publish to feeds ➔
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TRACEBACK ENGINE MODAL */}
      <AnimatePresence>
        {tracebackPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-55 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setTracebackPost(null)} />
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-neutral-950 border border-neutral-900 rounded-2xl shadow-2xl z-10"
            >
              <div className="sticky top-0 bg-neutral-950 p-4 border-b border-neutral-900 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <GitCommit className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    Post Share Chain
                  </span>
                </div>
                <button
                  onClick={() => setTracebackPost(null)}
                  className="text-neutral-500 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <TracebackEngine
                  post={tracebackPost}
                  onPostUpdated={handlePostUpdated}
                  currentUserUsername={currentUser.username}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
