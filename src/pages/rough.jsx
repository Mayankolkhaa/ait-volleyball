 <a href="#" className="grid h-9 w-9 place-items-center border border-slate-200 text-slate-400 hover:border-[#FFC928] hover:text-[#071A2B]"><Instagram size={15} /></a>
  <a href="#" className="grid h-9 w-9 place-items-center border border-slate-200 text-slate-400 hover:border-[#FFC928] hover:text-[#071A2B]"><Linkedin size={15} /></a>
  import { useMemo, useState } from "react";
import { ArrowRight, MapPin, CalendarDays, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { events } from "../data/events";

const tabs = ["Upcoming", "All"];

export default function Events() {
  const [tab, setTab] = useState("Upcoming");
  const visible = useMemo(() => tab === "All" ? events : events.filter(e => e.status === "Upcoming"), [tab]);

  return (
    <>
      <PageHero eyebrow="Tournaments. Matches. Moments." title="Events" subtitle="Follow the competitions, matches and activities that shape the AIT Volleyball season." image="https://images.unsplash.com/photo-1530137073521-4d2e5f5b4b9a?auto=format&fit=crop&w=2200&q=85" />
      <section className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="container-site">
          <div className="mb-12 flex flex-wrap gap-2">
            {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 text-xs font-black uppercase tracking-widest ${tab === t ? "bg-[#FFC928] text-[#071A2B]" : "bg-white text-slate-500"}`}>{t}</button>)}
          </div>
          <div className="space-y-4">
            {visible.map((event, i) => (
              <Reveal key={event.id} delay={i * .06}>
                <motion.article whileHover={{ x: 7 }} className="group grid gap-6 rounded-2xl bg-white p-5 sm:grid-cols-[105px_1fr_auto] sm:items-center sm:p-7">
                  <div className="bg-[#071A2B] p-4 text-center text-white">
                    <div className="display text-5xl">{event.day}</div>
                    <div className="text-[10px] font-black">{event.month} {event.year}</div>
                  </div>
                  <div>
                    <div className="mb-3 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-widest">
                      <span className="text-[#071A2B]"><CalendarDays className="mr-1 inline" size={12} /> {event.status}</span>
                      <span className="text-slate-400"><Clock3 className="mr-1 inline" size={12} /> Season 2026</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-[#071A2B] sm:text-2xl">{event.title}</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin size={14} /> {event.location}</p>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{event.description}</p>
                  </div>
                  <button className="inline-flex items-center justify-center gap-2 self-end bg-[#FFC928] px-5 py-3 text-xs font-black uppercase tracking-widest text-[#071A2B] sm:self-center">Details <ArrowRight size={15} /></button>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
