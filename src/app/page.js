"use client";

import React, { useState, useEffect } from 'react';

// --- COMPONENT IMPORTS ---
import LoadingScreen from '@/components/LoadingScreen';
import AuthScreen from '@/components/AuthScreen';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PromotionCarousel from '@/components/PromotionCarousel'; // New
import LevelGrid from '@/components/LevelGrid';
import Library from '@/components/Library';
import TeacherBio from '@/components/TeacherBio';
import Player from '@/components/Player';
import PaymentModal from '@/components/PaymentModal';
import Footer from '@/components/Footer'; // New

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL  ;
 
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
    // 1. Fetch Public Data Immediately (So Auth Screen looks good)
    fetchPublicData();

    // 2. Check Local Storage for Session
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

  // 1. Fetch Data that doesn't require Login
  const fetchPublicData = async () => {
    try {
      const [lRes, bRes, tRes, landingRes, promoRes, footerRes] = await Promise.all([
        fetch(`${STRAPI_URL}/api/levels?populate=*`), 
        fetch(`${STRAPI_URL}/api/books?populate=*`),
        fetch(`${STRAPI_URL}/api/teacher-profile?populate=*`),
        fetch(`${STRAPI_URL}/api/landing-page?populate=*`),
        fetch(`${STRAPI_URL}/api/promotions?populate=*`),
        fetch(`${STRAPI_URL}/api/footer?populate=*`) // Assuming Single Type 'global-setting'
      ]);

      const [l, b, t, landing, promos, footer] = await Promise.all([
        lRes.json(), bRes.json(), tRes.json(), landingRes.json(), promoRes.json(), footerRes.json()
      ]);

      setData(prev => ({
        ...prev,
        levels: l.data || [],
        books: b.data || [],
        teacher: t.data || null,
        landing: landing.data || null,
        promotions: promos.data || [],
        settings: footer.data || null
      }));
    } catch (e) {
      console.error("Public Fetch Error:", e);
    }
  };

  // 2. Fetch User Data (Owned Levels)
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
        // Save Session
        localStorage.setItem('strapi_jwt', result.jwt);
        localStorage.setItem('strapi_user', JSON.stringify(result.user));
        
        // Update State
        setJwt(result.jwt);
        setUser(result.user);
        
        // Fetch Private Data
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
    // Check if user owns level by ID or DocumentID (Strapi v5 support)
    return data.userOwnedLevels.some(owned => owned.id === level.id || owned.documentId === level.documentId);
  };

  const handleLevelClick = async (level) => {
    if (isUnlocked(level)) {
      try {
        // Fetch Lessons
        const res = await fetch(`${STRAPI_URL}/api/lessons?filters[level][id][$eq]=${level.id}&sort=order:asc`, {
           headers: { Authorization: `Bearer ${jwt}` }
        });
        const json = await res.json();
        const lessons = json.data;
        
        setSelectedLevel({ ...level, lessons: lessons });

        if (lessons && lessons.length > 0) {
           setCurrentLesson(lessons[0]); // Auto-Play first lesson
           setView('player');
        } else {
           alert("No lessons uploaded for this level yet.");
        }
      } catch (err) {
        console.error("Error loading lessons", err);
      }
    } else {
      setSelectedLevel(level);
      setModalOpen(true);
    }
  };

  // --- RENDER ---

  // 1. Loading State (Only if critical data is missing)
  if (loading && !data.landing) return <LoadingScreen />;
  
  // 2. Auth Screen (Pass Landing data for dynamic background)
  if (!user) return <AuthScreen onAuth={handleAuth} loading={loading} authError={authError} landing={data.landing} />;

  // 3. Main App
  return (
    <main className="min-h-screen bg-[#0B0C15] flex flex-col">
      <Navbar user={user} onLogout={handleLogout} setView={setView} />
      
      <div className="flex-grow">
        {view === 'home' ? (
          <>
            <Hero landing={data.landing} />
            
            {/* Dynamic Promotions */}
            <PromotionCarousel promotions={data.promotions} />
            
            <LevelGrid levels={data.levels} isUnlocked={isUnlocked} onLevelClick={handleLevelClick} />
            <Library books={data.books} />
            <TeacherBio teacher={data.teacher} />
          </>
        ) : (
          <Player 
            currentLesson={currentLesson} 
            selectedLevel={selectedLevel} 
            setCurrentLesson={setCurrentLesson} 
            onExit={() => setView('home')}
          />
        )}
      </div>

      {/* Footer is always visible at bottom */}
      <Footer settings={data.settings} />

      {/* Modals */}
      <PaymentModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        level={selectedLevel} 
      />
    </main>
  );
}