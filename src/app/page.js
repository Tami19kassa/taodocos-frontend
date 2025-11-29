"use client";

import React, { useState, useEffect } from 'react';

// --- COMPONENT IMPORTS ---
import LoadingScreen from '@/components/LoadingScreen';
import AuthScreen from '@/components/AuthScreen';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PromotionCarousel from '@/components/PromotionCarousel';
import LevelGrid from '@/components/LevelGrid';
import Library from '@/components/Library';
import AudioGallery from '@/components/AudioGallery'; // Ensure this exists
import TeacherBio from '@/components/TeacherBio';
import Player from '@/components/Player';
import PaymentModal from '@/components/PaymentModal';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';

// --- CONFIGURATION (With Safety Fallback) ---
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function Home() {
  // -- STATE --
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home'); 
  
  // Data State
  const [data, setData] = useState({ 
    levels: [], 
    books: [], 
    teacher: null, 
    landing: null,
    promotions: [],
    testimonials: [],
    audios: [],
    settings: null,
    userOwnedLevels: [] 
  });
  
  // Navigation & Playback State
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Auth State
  const [authError, setAuthError] = useState('');

  // --- INITIALIZATION ---
  useEffect(() => {
    fetchPublicData();

    const storedToken = localStorage.getItem('strapi_jwt');
    const storedUser = localStorage.getItem('strapi_user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setJwt(storedToken);
      setUser(parsedUser);
      fetchUserData(storedToken, parsedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  // --- API ACTIONS ---
  const fetchPublicData = async () => {
    try {
      const [lRes, bRes, tRes, landingRes, promoRes, testRes, footerRes, audioRes] = await Promise.all([
        fetch(`${STRAPI_URL}/api/levels?populate=*`), 
        fetch(`${STRAPI_URL}/api/books?populate=*`),
        fetch(`${STRAPI_URL}/api/teacher-profile?populate=*`),
        fetch(`${STRAPI_URL}/api/landing-page?populate=*`),
        fetch(`${STRAPI_URL}/api/promotions?populate=*`),
        fetch(`${STRAPI_URL}/api/testimonials?populate=*`),
        fetch(`${STRAPI_URL}/api/global-setting?populate=*`),
        fetch(`${STRAPI_URL}/api/audio-tracks?populate=*`)
      ]);

      const [l, b, t, landing, promos, tests, footer, audios] = await Promise.all([
        lRes.json(), bRes.json(), tRes.json(), landingRes.json(), promoRes.json(), testRes.json(), footerRes.json(), audioRes.json()
      ]);

      setData(prev => ({
        ...prev,
        levels: l.data || [],
        books: b.data || [],
        teacher: t.data || null,
        landing: landing.data || null,
        promotions: promos.data || [],
        testimonials: tests.data || [],
        settings: footer.data || null,
        audios: audios.data || []
      }));
    } catch (e) {
      console.error("Public Fetch Error:", e);
    }
  };

  const fetchUserData = async (token, userId) => {
    try {
      setLoading(true);
      const userRes = await fetch(`${STRAPI_URL}/api/users/${userId}?populate=owned_levels`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const u = await userRes.json();

      setData(prev => ({
        ...prev,
        userOwnedLevels: u.owned_levels || [] 
      }));
      setLoading(false);
    } catch (e) {
      console.error("User Fetch Error:", e);
      setLoading(false);
    }
  };
 
  // --- AUTH HANDLERS ---
  const handleAuth = async (formData, isRegistering) => {
    setAuthError('');
    setLoading(true);
    const endpoint = isRegistering ? '/api/auth/local/register' : '/api/auth/local';
    try {
      const res = await fetch(`${STRAPI_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      
      if (result.error) {
        setAuthError(result.error.message);
        setLoading(false);
      } else {
        localStorage.setItem('strapi_jwt', result.jwt);
        localStorage.setItem('strapi_user', JSON.stringify(result.user));
        setJwt(result.jwt);
        setUser(result.user);
        fetchUserData(result.jwt, result.user.id);
      }
    } catch (error) {
      setAuthError("Connection failed. Is Strapi running?");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setJwt(null);
    setView('home');
  };

  // --- ACCESS LOGIC ---
  const isUnlocked = (level) => {
    if (!data.userOwnedLevels) return false;
    return data.userOwnedLevels.some(owned => owned.id === level.id || owned.documentId === level.documentId);
  };

  const handleLevelClick = async (level) => {
    try {
      // 1. Fetch Lessons (Sorted)
      const res = await fetch(`${STRAPI_URL}/api/lessons?filters[level][id][$eq]=${level.id}&sort=order:asc`, {
          headers: { Authorization: `Bearer ${jwt}` }
      });
      const json = await res.json();
      const lessons = json.data;

      // 2. Logic to pick first playable video
      const unlocked = isUnlocked(level);
      let initialLesson = lessons[0];
      
      if (!unlocked) {
        const firstFree = lessons.find(l => l.is_free_sample);
        if (firstFree) initialLesson = firstFree;
      }

      // 3. Set State
      setSelectedLevel({ ...level, lessons: lessons }); // Save sorted lessons
      
      if (lessons && lessons.length > 0) {
          setCurrentLesson(initialLesson);
          setView('player');
      } else {
          alert("No lessons found.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- RENDER ---
  if (loading && !data.landing) return <LoadingScreen />;
  if (!user) return <AuthScreen onAuth={handleAuth} loading={loading} authError={authError} landing={data.landing} />;

 // ... (inside Home function, before return)

  // --- GLOBAL BACKGROUND LOGIC ---
  const rawBgUrl = data.landing?.hero_background?.url;
  const globalBgUrl = rawBgUrl 
    ? (rawBgUrl.startsWith('http') ? rawBgUrl : `${STRAPI_URL}${rawBgUrl}`)
    : null;

  // ... (auth checks)

  return (
    <main className="min-h-screen relative">
      
      {/* --- GLOBAL WALLPAPER (Fixed Background) --- */}
      <div className="fixed inset-0 z-[-1]">
        {globalBgUrl ? (
          <img 
            src={globalBgUrl} 
            className="w-full h-full object-cover opacity-20" // Low opacity so text is readable
            alt="Global Background"
          />
        ) : (
          <div className="w-full h-full bg-[#0B0C15]" />
        )}
        
        {/* Gradient Overlay (Blue/Purple Tint) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C15]/90 via-[#0B0C15]/80 to-[#0B0C15]/95" />
      </div>

      <Navbar user={user} onLogout={handleLogout} setView={setView} />
      
      <div className="flex-grow relative z-10">
        {view === 'home' ? (
          <>
            {/* ... sections ... */}
            <Hero landing={data.landing} />
            <PromotionCarousel promotions={data.promotions} />
            <LevelGrid levels={data.levels} isUnlocked={isUnlocked} onLevelClick={handleLevelClick} />
            
            {/* Added Audio Gallery */}
            <AudioGallery audios={data.audios} />
            
            <Library books={data.books} />
            <Testimonials testimonials={data.testimonials} />
            <TeacherBio teacher={data.teacher} />
          </>
        ) : (
          <Player 
             // ... props
          />
        )}
      </div>

      <Footer settings={data.settings} />
      <PaymentModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        level={selectedLevel} 
      />
    </main>
  );
}