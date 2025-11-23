import { FileText, ArrowUpRight } from 'lucide-react';

const STRAPI_URL = 'http://localhost:1337';

export default function Library({ books }) {
  return (
    <section id="library" className="py-32 bg-[#0B0C15] border-t border-white/5 relative overflow-hidden">
       
       {/* Background Watermark */}
       <div className="absolute top-20 right-10 text-[200px] font-bold text-white/5 font-cinzel pointer-events-none select-none">
         LIB
       </div>

       <div className="max-w-7xl mx-auto px-4 relative z-10">
         
         <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
           <div>
             {/* Cyan Accent Title */}
             <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-2 block">Resources</span>
             <h2 className="font-cinzel text-4xl md:text-5xl text-white">The Sacred Library</h2>
           </div>
           <p className="text-slate-400 max-w-md text-right md:text-left">
             Access a curated collection of historical manuscripts, notation guides, and spiritual texts.
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {books.map((book, index) => (
             <a 
               key={book.id} 
               href={book.pdf_file?.url ? `${STRAPI_URL}${book.pdf_file.url}` : '#'} 
               target="_blank" 
               className="group relative bg-[#11121f] border border-white/5 hover:border-cyan-500/50 p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-xl hover:shadow-cyan-500/10"
             >
               {/* Hover Glow (Cyan Gradient) */}
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/0 to-cyan-900/0 group-hover:to-cyan-900/10 transition-all duration-500" />

               <div className="relative z-10 flex justify-between items-start mb-8">
                 <div className="w-12 h-12 bg-[#0B0C15] rounded-xl flex items-center justify-center border border-white/10 group-hover:border-cyan-500 group-hover:text-cyan-400 transition-colors text-slate-600">
                   <FileText size={24} />
                 </div>
                 <span className="text-slate-600 font-mono text-xs">0{index + 1}</span>
               </div>

               <h3 className="relative z-10 font-cinzel text-xl text-white mb-2 group-hover:text-cyan-400 transition-colors">
                 {book.title}
               </h3>
               <p className="relative z-10 text-slate-500 text-sm mb-6">PDF Document • Digital Download</p>

               <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                 Download File <ArrowUpRight size={14} />
               </div>
             </a>
           ))}
         </div>

       </div>
    </section>
  );
}