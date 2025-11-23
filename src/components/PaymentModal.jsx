import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, level }) {
  if (!isOpen || !level) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      >
        <div className="bg-[#0a0505] border border-amber-500/30 max-w-md w-full p-8 relative rounded-xl shadow-2xl">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white"><X /></button>
          
          <div className="text-center mb-8">
            <h3 className="font-cinzel text-2xl text-white">Unlock {level.name}</h3>
          </div>
          
          <div className="bg-black/40 p-4 rounded border border-white/10 mb-4 text-center">
            <p className="text-sm text-amber-500 mb-2">Price for Full Access:</p>
            <p className="text-2xl font-mono text-white">{level.price} ETB</p>
            <div className="h-px w-full bg-white/10 my-4"/>
            <p className="text-sm text-white/60">CBE: 1000123456789</p>
          </div>
          
          <a 
            href="https://t.me/tefera_tilahun" 
            target="_blank" 
            className="block w-full bg-amber-600 hover:bg-amber-500 text-black font-bold text-center py-4 rounded uppercase tracking-widest text-sm transition-colors"
          >
            Open Telegram to Verify
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}