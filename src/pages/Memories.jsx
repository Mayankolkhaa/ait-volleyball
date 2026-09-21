import { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { memories } from "../data/memories";

const filters = ["All", "Tournament", "Practice", "Team", "Campus"];

export default function Memories() {
  const [filter, setFilter] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const visible = useMemo(() => filter === "All" ? memories : memories.filter(m => m.category === filter), [filter]);

  const next = () => setSelectedIndex(i => (i + 1) % visible.length);
  const prev = () => setSelectedIndex(i => (i - 1 + visible.length) % visible.length);

  return (
    <>
      <PageHero eyebrow="Moments that stay forever." title="Memories" subtitle="The rallies, celebrations, practices and people behind the AIT Volleyball story." image={memories[0].image} />
      <section className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="container-site">
          <div className="mb-10 flex flex-wrap gap-2">
            {filters.map(f => <button key={f} onClick={() => setFilter(f)} className={`px-5 py-3 text-xs font-black uppercase tracking-widest ${filter === f ? "bg-[#071A2B] text-white" : "bg-white text-slate-500 hover:text-[#071A2B]"}`}>{f}</button>)}
          </div>
          <motion.div layout className="grid auto-rows-[170px] grid-cols-2 gap-3 md:grid-cols-4">
            {visible.map((m, i) => (
              <motion.button layout key={m.id} onClick={() => setSelectedIndex(i)} initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className={`group relative overflow-hidden rounded-xl text-left ${i === 0 || i % 5 === 0 ? "row-span-2" : ""} ${i === 2 ? "md:col-span-2" : ""}`}>
                <img src={m.image} alt={m.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#FFC928]">{m.category}</p>
                  <p className="mt-1 font-bold text-white">{m.title}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedIndex !== null && visible[selectedIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center bg-[#03090e]/95 p-5" onClick={() => setSelectedIndex(null)}>
            <button onClick={() => setSelectedIndex(null)} className="absolute right-5 top-5 z-20 grid h-12 w-12 place-items-center border border-white/15 text-white hover:border-[#FFC928] hover:text-[#FFC928]"><X /></button>
            <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 z-20 grid h-12 w-12 place-items-center text-white sm:left-8"><ChevronLeft size={32} /></button>
            <motion.img key={visible[selectedIndex].id} initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} src={visible[selectedIndex].image} alt={visible[selectedIndex].title} className="max-h-[82vh] max-w-[88vw] object-contain" onClick={e => e.stopPropagation()} />
            <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-3 z-20 grid h-12 w-12 place-items-center text-white sm:right-8"><ChevronRight size={32} /></button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#FFC928]">{visible[selectedIndex].category}</p>
              <p className="mt-1 font-bold">{visible[selectedIndex].title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
