import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, CreditCard } from 'lucide-react';
import { useState } from 'react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function PaymentModal({ isOpen, onClose, level, settings, paymentMethods }) {
  const [copiedId, setCopiedId] = useState(null);
  
  if (!isOpen || !level) return null;

  const telegramLink = settings?.telegram_link || "https://t.me/YourTelegramHandle";

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-[#120a05] border border-amber-600/30 w-full max-w-lg p-0 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="bg-[#1a0f0a] p-6 border-b border-white/5 relative text-center">
            <button onClick={onClose} className="absolute top-6 right-6 text-stone-500 hover:text-white transition-colors">
              <X />
            </button>
            <h3 className="font-cinzel text-2xl text-white mb-1">Unlock {level.name}</h3>
            <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">Lifetime Access</p>
            
            <div className="mt-4 inline-block bg-[#0c0a09] border border-amber-500/20 px-6 py-2 rounded-lg">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white font-mono">{level.price}</span>
                <span className="text-xs text-stone-400 font-bold">$</span>
              </div>
            </div>
          </div>

          {/* SCROLLABLE LIST */}
          <div className="p-6 max-h-[50vh] overflow-y-auto custom-scrollbar space-y-4">
            <p className="text-stone-400 text-sm text-center mb-4">Choose a payment method to copy details:</p>

            {paymentMethods && paymentMethods.length > 0 ? (
              paymentMethods.map((method) => {
                const rawUrl = method.logo?.url;
                const logoUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : `${STRAPI_URL}${rawUrl}`) : null;

                return (
                  <button
                    key={method.id}
                    onClick={() => handleCopy(method.id, method.account_number)}
                    className="w-full bg-[#1a0f0a] hover:bg-[#25140d] border border-white/5 hover:border-amber-500/50 p-4 rounded-xl flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Logo Area */}
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center p-1 border border-white/5 overflow-hidden">
                        {logoUrl ? (
                          <img src={logoUrl} className="w-full h-full object-contain" alt={method.bank_name} />
                        ) : (
                          <CreditCard className="text-stone-500" />
                        )}
                      </div>
                      
                      <div className="text-left">
                        <h4 className="text-white font-bold text-sm">{method.bank_name}</h4>
                        <p className="text-amber-500 font-mono text-sm tracking-wide">{method.account_number}</p>
                        {method.instruction && <p className="text-stone-500 text-[10px] mt-0.5">{method.instruction}</p>}
                      </div>
                    </div>

                    <div className={`p-2 rounded-lg transition-colors ${copiedId === method.id ? 'bg-green-500/20 text-green-500' : 'bg-black/40 text-stone-500 group-hover:text-white'}`}>
                      {copiedId === method.id ? <Check size={18} /> : <Copy size={18} />}
                    </div>
                  </button>
                );
              })
            ) : (
              // Fallback if no payment methods created in Strapi
              <div className="text-center text-stone-500 py-4">No payment methods available. Contact Admin.</div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-6 border-t border-white/5 bg-[#0c0a09]">
             <p className="text-stone-500 text-xs text-center mb-4">
               After transfer, please send the receipt screenshot to verification.
             </p>
             <a 
              href={telegramLink} 
              target="_blank" 
              className="block w-full bg-amber-700 hover:bg-amber-600 text-white font-bold text-center py-4 rounded-xl uppercase tracking-widest text-xs transition-all shadow-lg shadow-amber-900/20"
            >
              Confirm on Telegram
            </a>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}