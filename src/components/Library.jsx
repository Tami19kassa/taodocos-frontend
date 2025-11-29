import { ArrowUpRight, Book } from 'lucide-react';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function Library({ books }) {
  return (
    <section id="library" className="py-24 relative z-10 border-t border-white/10">
       <div className="max-w-7xl mx-auto px-4">
         
         <div className="text-center mb-16">
           <h2 className="font-cinzel text-3xl md:text-5xl text-white mb-2">Sacred Library</h2>
           <p className="text-amber-500/80 font-serif italic">Ancient manuscripts & guides</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {books.map((book) => {
             const hasFile = book.pdf_file && book.pdf_file.url;
             
             // Logic for File URL
             let fileUrl = '#';
             if (hasFile) {
               fileUrl = book.pdf_file.url.startsWith('http') ? book.pdf_file.url : `${STRAPI_URL}${book.pdf_file.url}`;
             }

             // Logic for Cover Image URL
             const coverUrl = book.cover?.url 
                ? (book.cover.url.startsWith('http') ? book.cover.url : `${STRAPI_URL}${book.cover.url}`) 
                : null;

             return (
               <a 
                 key={book.id} 
                 href={hasFile ? fileUrl : undefined} 
                 target={hasFile ? "_blank" : undefined}
                 className={`group relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-900/40 
                   ${!hasFile && 'cursor-not-allowed opacity-50 grayscale'}`}
               >
                 {/* 1. COVER IMAGE */}
                 {coverUrl ? (
                   <img src={coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 ) : (
                   // Fallback if no image
                   <div className="w-full h-full bg-[#1c120e] flex flex-col items-center justify-center p-4 text-center">
                     <Book size={40} className="text-amber-700 mb-4" />
                     <span className="font-cinzel text-stone-400 text-sm">{book.title}</span>
                   </div>
                 )}

                 {/* 2. HOVER OVERLAY */}
                 <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                   <h3 className="font-cinzel text-white mb-2">{book.title}</h3>
                   {hasFile ? (
                     <span className="text-amber-500 text-xs font-bold uppercase flex items-center gap-1">
                       Download <ArrowUpRight size={12} />
                     </span>
                   ) : (
                     <span className="text-red-400 text-xs">Unavailable</span>
                   )}
                 </div>
               </a>
             );
           })}
         </div>
       </div>
    </section>
  );
}