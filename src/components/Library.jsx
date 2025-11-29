import { FileText, ArrowUpRight, Lock } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function Library({ books }) {
  return (
    <section id="library" className="py-24 bg-[#0B0C15] border-t border-white/5 relative overflow-hidden">
       
       <div className="max-w-7xl mx-auto px-4 relative z-10">
         
         <div className="text-center mb-12">
           <h2 className="font-cinzel text-3xl md:text-4xl text-white mb-2">Sacred Library</h2>
           <p className="text-slate-400 text-sm">Downloadable manuscripts & guides</p>
         </div>

         {/* GRID: Changed to show smaller items (2 per row on mobile, 4 on desktop) */}
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
           {books.map((book) => {
             
             // --- FIX 1: Robust Image Logic ---
             // Checks for V5 (flat) or V4 (nested) structure
             const imgData = book.cover || book.cover?.data?.attributes;
             const rawImgUrl = imgData?.url;
             
             const coverUrl = rawImgUrl 
               ? (rawImgUrl.startsWith('http') ? rawImgUrl : `${STRAPI_URL}${rawImgUrl}`)
               : null;

             // --- File Logic ---
             const fileData = book.pdf_file || book.pdf_file?.data?.attributes;
             const rawFileUrl = fileData?.url;
             const hasFile = !!rawFileUrl;

             const fileUrl = rawFileUrl 
               ? (rawFileUrl.startsWith('http') ? rawFileUrl : `${STRAPI_URL}${rawFileUrl}`)
               : '#';

             return (
               <a 
                 key={book.id} 
                 href={hasFile ? fileUrl : undefined} 
                 target={hasFile ? "_blank" : undefined}
                 rel="noopener noreferrer"
                 className={`group relative flex flex-col bg-[#11121f] rounded-xl overflow-hidden border border-white/5 transition-all duration-300
                   ${hasFile 
                     ? 'hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-500/30 cursor-pointer' 
                     : 'opacity-70 cursor-not-allowed grayscale'
                   }`}
                 onClick={(e) => !hasFile && e.preventDefault()} 
               >
                 {/* --- IMAGE AREA (Aspect Ratio 3:4 for Book Shape) --- */}
                 <div className="aspect-[3/4] w-full relative overflow-hidden bg-slate-900">
                   {coverUrl ? (
                     <img 
                       src={coverUrl} 
                       alt={book.title}
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                   ) : (
                     // Fallback Icon if no image
                     <div className="w-full h-full flex flex-col items-center justify-center p-4">
                       <FileText className="text-slate-600 w-10 h-10 mb-2" />
                       <span className="text-[10px] text-slate-600 uppercase tracking-widest text-center">No Cover</span>
                     </div>
                   )}
                   
                   {/* Hover Overlay */}
                   {hasFile && (
                     <div className="absolute inset-0 bg-cyan-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <ArrowUpRight className="text-white w-8 h-8" />
                     </div>
                   )}
                 </div>

                 {/* --- TITLE AREA (Smaller & cleaner) --- */}
                 <div className="p-4 flex-1 flex flex-col justify-between">
                   <h3 className="font-cinzel text-sm text-white mb-1 leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                     {book.title}
                   </h3>
                   
                   <div className="flex items-center gap-2 mt-2">
                     {hasFile ? (
                       <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                         PDF
                       </span>
                     ) : (
                       <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                         <Lock size={8} /> Locked
                       </span>
                     )}
                   </div>
                 </div>
               </a>
             );
           })}
         </div>

       </div>
    </section>
  );
}