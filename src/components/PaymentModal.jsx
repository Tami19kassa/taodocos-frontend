import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function PaymentModal({ isOpen, onClose, level, settings }) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen || !level) return null;

  // --- GET DATA FROM STRAPI (With Fallbacks) ---
  const bankName = settings?.bank_name || "Commercial Bank of Ethiopia";
  const accountNum = settings?.account_number || "1000123456789";
  const accountName = settings?.account_name || "Tefera Tilahun";
  const instructions = settings?.payment_instruction || "Send a screenshot of your receipt on Telegram to get access.";
  const telegramLink = settings?.telegram_link || "https://t.me/YourTelegramHandle";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#120a05] border border-amber-600/40 w-full max-w-md p-8 relative rounded-2xl shadow-2xl shadow-amber-900/20"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors">
            <X />
          </button>
          
          <div className="text-center mb-8">
            <h3 className="font-cinzel text-2xl text-white mb-1">Unlock {level.name}</h3>
            <p className="text-amber-500 text-sm font-bold uppercase tracking-widest">Lifetime Access</p>
          </div>
          
          {/* PRICE CARD */}
          <div className="bg-[#1a0f0a] p-6 rounded-xl border border-white/5 mb-6 text-center">
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">Total Amount</p>
            <div className="flex justify-center items-baseline gap-1">
              <span className="text-4xl font-bold text-white font-mono">{level.price}</span>
              <span className="text-sm text-stone-400 font-bold">ETB</span>
            </div>
          </div>

          {/* BANK DETAILS */}
          <div className="space-y-4 mb-8">
            <div className="bg-black/40 p-4 rounded-lg border border-white/5 flex flex-col gap-1">
              <span className="text-[10px] text-stone-500 uppercase font-bold">Bank Name</span>
              <span className="text-stone-300 text-sm">{bankName}</span>
            </div>

            <div className="bg-black/40 p-4 rounded-lg border border-white/5 flex items-center justify-between group">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-stone-500 uppercase font-bold">Account Number</span>
                <span className="text-white font-mono text-lg tracking-wider">{accountNum}</span>
                <span className="text-xs text-stone-600">{accountName}</span>
              </div>
              
              <button 
                onClick={handleCopy}
                className="p-2 bg-white/5 hover:bg-amber-600/20 text-stone-400 hover:text-amber-500 rounded-lg transition-colors"
                title="Copy Number"
              >
                {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <p className="text-stone-500 text-xs text-center mb-6 leading-relaxed px-4">
            {instructions}
          </p>
          
          <a 
            href={telegramLink} 
            target="_blank" 
            className="block w-full bg-amber-700 hover:bg-amber-600 text-white font-bold text-center py-4 rounded-xl uppercase tracking-widest text-sm transition-all shadow-lg shadow-amber-900/20"
          >
            Verify Payment on Telegram
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}