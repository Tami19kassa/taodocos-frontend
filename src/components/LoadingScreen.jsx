export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0c0a09] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-stone-800 border-t-amber-600 rounded-full animate-spin"/>
      <span className="font-cinzel text-stone-500 text-sm tracking-widest">Loading Sanctuary...</span>
    </div>
  );
}