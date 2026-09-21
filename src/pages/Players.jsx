import { useMemo, useState } from "react";
import { Instagram, Linkedin, ArrowUpRight, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { players } from "../data/players";

const filters = ["All", "Setter", "Spiker", "Blocker", "Libero"];

export default function Players() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();
    return players.filter(p => (filter === "All" || p.role === filter) && (!q || `${p.name} ${p.position}`.toLowerCase().includes(q)));
  }, [filter, query]);

  return (
    <>
      <PageHero eyebrow="Different roles. One team." title="Our Players" subtitle="Meet the people who bring energy, discipline and teamwork to the AIT court." image={players[0].image} />
      <section className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="container-site">
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`px-5 py-3 text-xs font-black uppercase tracking-widest transition ${filter === f ? "bg-[#071A2B] text-white" : "bg-white text-slate-500 hover:text-[#071A2B]"}`}>{f}</button>
              ))}
            </div>
            <div className="flex items-center border-b border-slate-300 pb-2">
              <Search size={15} className="mr-3 text-slate-400" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search player" className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400" />
            </div>
          </div>

          <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <motion.article layout key={p.id} initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .94 }} transition={{ duration: .45, delay: i * .03 }} className="group overflow-hidden rounded-2xl bg-white">
                  <div className="relative h-[420px] overflow-hidden bg-[#0D2A43]">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/80 via-transparent to-transparent opacity-70" />
                    <span className="absolute right-5 top-4 display text-7xl text-white/70">#{p.number}</span>
                    <div className="absolute bottom-5 left-5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#FFC928]">{p.position}</p>
                      <h2 className="mt-1 text-2xl font-extrabold text-white">{p.name}</h2>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Role</p>
                      <p className="mt-1 text-sm font-bold text-[#071A2B]">{p.role}</p>
                    </div>
                    <div className="flex gap-2">
                     
                      <a
  href={p.instagram}
  target="_blank"
  rel="noopener noreferrer"
  className="grid h-9 w-9 place-items-center border border-slate-200 text-slate-400 transition hover:border-[#FFC928] hover:text-[#071A2B]"
  aria-label={`${p.name} Instagram`}
>
  <Instagram size={15} />
</a>
<a
  href={p.linkedin}
  target="_blank"
  rel="noopener noreferrer"
  className="grid h-9 w-9 place-items-center border border-slate-200 text-slate-400 transition hover:border-[#FFC928] hover:text-[#071A2B]"
  aria-label={`${p.name} LinkedIn`}
>
  <Linkedin size={15} />
</a>
                     
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {visible.length === 0 && <div className="py-20 text-center text-sm text-slate-400">No players match this search.</div>}

          <Reveal className="mt-24 overflow-hidden rounded-2xl bg-[#071A2B]">
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-xs font-black uppercase tracking-[.25em] text-[#FFC928]">Built together</p>
                <h2 className="display mt-3 text-6xl text-white">ONE COURT.<br />ONE TEAM.</h2>
              </div>
              <ArrowUpRight className="hidden text-[#FFC928] sm:block" size={54} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
