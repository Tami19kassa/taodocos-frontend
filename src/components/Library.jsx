import { FileText, ArrowUpRight, Lock } from 'lucide-react';
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export default function Library({ books }) {
  return (
    <section id="library" className="py-24 relative z-10 border-t border-white/5">
       <div className="max-w-7xl mx-auto px-4">
         <div className="text-center mb-12">
           <h2 className="font-cinzel text-3xl md:text-4xl text-white mb-2">Sacred Library</h2>
           <p className="text-amber-500/80 font-serif italic">Downloadable manuscripts & guides</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
           {books.map((book) => {
             const imgData = book.cover_image || book.cover || book.cover_image?.data?.attributes;
             const rawImgUrl = imgData?.url;
             const coverUrl = rawImgUrl ? (rawImgUrl.startsWith('http') ? rawImgUrl : `${STRAPI_URL}${rawImgUrl}`) : null;

             const fileData = book.pdf_file || book.pdf_file?.data?.attributes;
             const rawFileUrl = fileData?.url;
             const hasFile = !!rawFileUrl;
             const fileUrl = rawFileUrl ? (rawFileUrl.startsWith('http') ? rawFileUrl : `${STRAPI_URL}${rawFileUrl}`) : '#';

             return (
               <a 
                 key={book.id} 
                 href={hasFile ? fileUrl : undefined} 
                 target={hasFile ? "_blank" : undefined}
                 rel="noopener noreferrer"
                 className={`group relative flex flex-col bg-[#1a0f0a] rounded-xl overflow-hidden border border-amber-500/10 transition-all duration-300
                   ${hasFile ? 'hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/40 hover:border-amber-500/40 cursor-pointer' : 'opacity-70 cursor-not-allowed grayscale'}`}
                 onClick={(e) => !hasFile && e.preventDefault()} 
               >
                 <div className="aspect-[3/4] w-full relative overflow-hidden bg-black">
                   {coverUrl ? (
                     <img src={coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center p-4">
                       <FileText className="text-amber-700 w-10 h-10 mb-2" />
                       <span className="text-[10px] text-stone-500 uppercase">No Cover</span>
                     </div>
                   )}
                   {hasFile && <div className="absolute inset-0 bg-amber-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><ArrowUpRight className="text-white w-8 h-8" /></div>}
                 </div>
                 <div className="p-4 flex-1 flex flex-col justify-between">
                   <h3 className="font-cinzel text-sm text-white mb-1 leading-snug group-hover:text-amber-400 transition-colors line-clamp-2">{book.title}</h3>
                   <div className="flex items-center gap-2 mt-2">
                     {hasFile ? <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">PDF</span> : <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 px-2 py-0.5 rounded flex items-center gap-1"><Lock size={8} /> Locked</span>}
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