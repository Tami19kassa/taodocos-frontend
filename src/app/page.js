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
import AudioGallery from '@/components/AudioGallery';
import TeacherBio from '@/components/TeacherBio';
import Player from '@/components/Player';
import PaymentModal from '@/components/PaymentModal';
import Footer from '@/components/Footer';
import Testimonials from '@/components/Testimonials';
import StudentShowcase from '@/components/StudentShowcase';
import AudioPlayerView from '@/components/AudioPlayerView';
import LiveSession from '@/components/LiveSession'; // --- NEW IMPORT ---
import MeetingRoom from '@/components/MeetingRoom'; // --- NEW IMPORT ---

// --- CONFIGURATION ---
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function Home() {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // View State: 'home', 'player', 'audio_player', 'meeting'
  const [view, setView] = useState('home'); 
  
  const [data, setData] = useState({ 
    levels: [], books: [], teacher: null, landing: null, 
    promotions: [], testimonials: [], audios: [], 
    performances: [], settings: null, 
    paymentMethods: [], 
    liveClasses: [], // --- NEW ---
    userOwnedLevels: [],
    userOwnedClasses: [] // --- NEW ---
  });
  
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [selectedAudioFolder, setSelectedAudioFolder] = useState(null);
  const [activeMeetingRoom, setActiveMeetingRoom] = useState(null); // --- NEW ---
  const [modalOpen, setModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  // 1. INITIALIZATION
  useEffect(() => {
    fetchPublicData();
    const storedToken = localStorage.getItem('strapi_jwt');
    const storedUser = localStorage.getItem('strapi_user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setJwt(storedToken);
      setUser(parsedUser);
      fetchUserData(storedToken, parsedUser.id);
      
      // RESTORE SESSION
      const lastView = localStorage.getItem('last_view');
      if (lastView === 'audio_player') {
        const savedFolder = localStorage.getItem('last_audio_folder');
        if (savedFolder) {
            setSelectedAudioFolder(JSON.parse(savedFolder));
            setView('audio_player');
        }
      } else if (lastView === 'player') {
        const savedLevel = localStorage.getItem('last_level');
        const savedLesson = localStorage.getItem('last_lesson');
        if (savedLevel && savedLesson) {
            setSelectedLevel(JSON.parse(savedLevel));
            setCurrentLesson(JSON.parse(savedLesson));
            setView('player');
        } 
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  // 2. DATA FETCHING
  const fetchPublicData = async () => {
    try {
      const results = await Promise.allSettled([
        fetch(`${STRAPI_URL}/api/levels?populate=*&sort=rank:asc`).then(r=>r.json()), 
        fetch(`${STRAPI_URL}/api/books?populate=*`).then(r=>r.json()),
        fetch(`${STRAPI_URL}/api/teacher-profile?populate=*`).then(r=>r.json()),
        fetch(`${STRAPI_URL}/api/landing-page?populate=*`).then(r=>r.json()),
        fetch(`${STRAPI_URL}/api/promotions?populate=*`).then(r=>r.json()),
        fetch(`${STRAPI_URL}/api/testimonials?populate=*`).then(r=>r.json()),
        fetch(`${STRAPI_URL}/api/footer?populate=*`).then(r=>r.json()),
        fetch(`${STRAPI_URL}/api/audio-folders?populate=*`).then(r=>r.json()),
        fetch(`${STRAPI_URL}/api/student-performances?populate=*`).then(r=>r.json()),
        fetch(`${STRAPI_URL}/api/payment-methods?populate=*`).then(r=>r.json()),
        // --- NEW FETCH ---
        fetch(`${STRAPI_URL}/api/live-classes?populate=*`).then(r=>r.json())
      ]);

      const getVal = (res) => res.status === 'fulfilled' ? res.value.data : [];
      
      setData(prev => ({
        ...prev,
        levels: getVal(results[0]) || [],
        books: getVal(results[1]) || [],
        teacher: getVal(results[2]) || null,
        landing: getVal(results[3]) || null,
        promotions: getVal(results[4]) || [],
        testimonials: getVal(results[5]) || [],
        settings: getVal(results[6]) || null,
        audios: getVal(results[7]) || [],
        performances: getVal(results[8]) || [],
        paymentMethods: getVal(results[9]) || [],
        liveClasses: getVal(results[10]) || [] // Store Live Classes
      }));
    } catch (e) {
      console.error("Fetch Error:", e);
    }
  };

  const fetchUserData = async (token, userId) => {
    try {
      setLoading(true);
      // Fetch owned levels AND owned classes
      const res = await fetch(`${STRAPI_URL}/api/users/${userId}?populate=owned_levels&populate=owned_classes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const u = await res.json();
      setData(prev => ({ 
          ...prev, 
          userOwnedLevels: u.owned_levels || [],
          userOwnedClasses: u.owned_classes || [] // Store Owned Classes
      }));
      setLoading(false);
    } catch (e) { console.error(e); setLoading(false); }
  };
 
  // 3. HANDLERS
  const handleAuth = async (formData, isRegistering) => {
    // ... (Auth Logic Same as before)
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
      setAuthError("Connection failed.");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setJwt(null);
    setView('home');
  };

  const handleExitPlayer = () => {
    setView('home');
    localStorage.removeItem('last_view');
    localStorage.removeItem('last_level');
    localStorage.removeItem('last_audio_folder');
  };

  const handleAudioFolderClick = (folder) => {
    setSelectedAudioFolder(folder);
    setView('audio_player');
    localStorage.setItem('last_view', 'audio_player');
    localStorage.setItem('last_audio_folder', JSON.stringify(folder));
  };

  // --- NEW: LIVE CLASS LOGIC ---
  const handleJoinClass = (liveClass) => {
    // Check ownership
    const isOwned = data.userOwnedClasses?.some(c => c.id === liveClass.id || c.documentId === liveClass.documentId);
    
    if (isOwned) {
      // ENTER MEETING
      setActiveMeetingRoom(liveClass.meet_link); 
      setView('meeting');
    } else {
      // PAY
      // We adapt the object so the modal understands it (it expects .name)
      const classToBook = { 
          ...liveClass, 
          name: liveClass.title + " (Live Session)" 
      };
      setSelectedLevel(classToBook);
      setModalOpen(true);
    }
  };

  const isUnlocked = (level) => {
    if (!data.userOwnedLevels) return false;
    return data.userOwnedLevels.some(owned => owned.id === level.id || owned.documentId === level.documentId);
  };

  const handleLevelClick = async (level) => {
    try {
      const res = await fetch(`${STRAPI_URL}/api/lessons?filters[level][id][$eq]=${level.id}&sort=order:asc&pagination[pageSize]=100`, {
          headers: { Authorization: `Bearer ${jwt}` }
      });
      const json = await res.json();
      let lessons = json.data;

      if (lessons && lessons.length > 0) {
        lessons = lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
      }

      if (!lessons || lessons.length === 0) {
        alert("No lessons uploaded for this level yet.");
        return;
      }

      const unlocked = isUnlocked(level);
      let initialLesson = lessons[0];
      
      if (!unlocked) {
        const firstFree = lessons.find(l => l.is_free_sample);
        if (firstFree) initialLesson = firstFree;
      }

      setSelectedLevel({ ...level, lessons: lessons });
      setCurrentLesson(initialLesson);
      setView('player');
      localStorage.setItem('last_view', 'player');
      localStorage.setItem('last_level', JSON.stringify({ ...level, lessons: lessons }));
      localStorage.setItem('last_lesson', JSON.stringify(initialLesson));

    } catch (err) {
      console.error(err);
    }
  };

  // --- RENDER ---
  const rawBgUrl = data.landing?.hero_background?.url;
  const globalBgUrl = rawBgUrl 
    ? (rawBgUrl.startsWith('http') ? rawBgUrl : `${STRAPI_URL}${rawBgUrl}`)
    : null;

  if (loading && !data.landing) return <LoadingScreen />;
  if (!user) return <AuthScreen onAuth={handleAuth} loading={loading} authError={authError} landing={data.landing} />;

  return (
    <main className="min-h-screen relative">
      <div className="fixed inset-0 z-[-1]">
        {globalBgUrl ? (
          <img src={globalBgUrl} className="w-full h-full object-cover opacity-20" />
        ) : (
          <div className="w-full h-full bg-[#1a0f0a]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0a]/95 via-[#1a0f0a]/80 to-[#1a0f0a]/95" />
      </div>

      {/* Hide Navbar during Meeting or Audio */}
      <div className={view === 'audio_player' || view === 'meeting' ? 'hidden md:block' : 'block'}>
        <Navbar user={user} onLogout={handleLogout} setView={setView} />
      </div>
       
      <div className="flex-grow relative z-10">
        {view === 'home' && (
          <div>
            <Hero landing={data.landing} />
            <PromotionCarousel promotions={data.promotions} />
            <LevelGrid levels={data.levels} isUnlocked={isUnlocked} onLevelClick={handleLevelClick} />
            
            {/* --- NEW: LIVE SESSIONS --- */}
            <LiveSession 
              classes={data.liveClasses} 
              userOwnedClasses={data.userOwnedClasses} 
              onJoin={handleJoinClass}
            />

            <AudioGallery audios={data.audios} onFolderClick={handleAudioFolderClick} userOwnedLevels={data.userOwnedLevels} />
            <Library books={data.books} />
            <StudentShowcase performances={data.performances} />
            <Testimonials testimonials={data.testimonials} />
            <TeacherBio teacher={data.teacher} />
          </div>
        )}

        {view === 'player' && (
          <div className="pt-20"> 
            <Player 
              currentLesson={currentLesson} 
              selectedLevel={selectedLevel} 
              setCurrentLesson={setCurrentLesson} 
              isLevelUnlocked={isUnlocked(selectedLevel)}
              jwt={jwt} 
              user={user} 
              onUnlockRequest={() => setModalOpen(true)}
              onExit={handleExitPlayer}
            />
          </div>
        )}

        {view === 'audio_player' && (
          <AudioPlayerView folder={selectedAudioFolder} onExit={handleExitPlayer} />
        )}

        {/* --- NEW: MEETING ROOM --- */}
        {view === 'meeting' && (
          <MeetingRoom 
            roomName={activeMeetingRoom}
            user={user}
            onExit={() => setView('home')}
          />
        )}
      </div>

      {view === 'home' && <Footer settings={data.settings} />}

      <PaymentModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        level={selectedLevel} 
        settings={data.settings} 
        paymentMethods={data.paymentMethods} 
      />
    </main>
  );
}