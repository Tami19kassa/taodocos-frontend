import { JaaSMeeting, JitsiMeeting } from '@jitsi/react-sdk';
import { X } from 'lucide-react';

export default function MeetingRoom({ roomName, user, onExit }) {
  
  if (!roomName) return <div className="text-white">Invalid Room Config</div>;

  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col h-screen">
      
      {/* Header */}
      <div className="h-16 bg-[#1a0f0a] border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
           <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"/>
           <h3 className="font-cinzel text-white text-lg">Live Session</h3>
        </div>
        <button onClick={onExit} className="bg-red-900/50 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
          <X size={16} /> Leave Class
        </button>
      </div>

      {/* The Meeting Iframe */}
      <div className="flex-1 bg-black relative">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomName} 
          configOverwrite={{
            startWithAudioMuted: true,
            disableThirdPartyRequests: true,
            prejoinPageEnabled: false,
            // --- FIX: MOBILE OPTIMIZATIONS ---
            disableDeepLinking: true, // Stops asking to open App
            mobileAppPromo: false,    // Hides the "Download App" banner
          }}
          interfaceConfigOverwrite={{
            filmStripOnly: false,
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            // Mobile Specific UI Tweaks
            MOBILE_APP_PROMO: false,
            NATIVE_APP_NAME: 'Taodocos',
          }}
          userInfo={{
            displayName: user?.username || "Student"
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
            iframeRef.style.border = 'none';
          }}
        />
      </div>

    </div>
  );
}