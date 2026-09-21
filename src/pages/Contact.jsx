import { useState } from "react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { Instagram, Linkedin, Youtube, Mail, MapPin, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <>
      <PageHero eyebrow="Let's build a stronger volleyball community." title="Get In Touch" subtitle="Want to connect with AIT Volleyball, collaborate, support the team or share something with us?" image="https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=2200&q=85" />
      <section className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[.22em] text-[#FFC928]">Contact</p>
            <h2 className="display mt-3 text-7xl leading-none text-[#071A2B] sm:text-8xl">LET'S<br />TALK.</h2>
            <p className="mt-7 max-w-md text-sm leading-7 text-slate-500">Whether you are a player, supporter, event organizer or someone who simply loves the game — we'd love to hear from you.</p>
            <div className="mt-10 space-y-5 text-sm text-slate-600">
              <p className="flex items-center gap-4"><Mail className="text-[#071A2B]" size={18} /> volleyball@ait.edu</p>
              <p className="flex items-center gap-4"><MapPin className="text-[#071A2B]" size={18} /> AIT, Pune, Maharashtra</p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[[Instagram, "Instagram"], [Youtube, "YouTube"], [Linkedin, "LinkedIn"]].map(([Icon, label]) => (
                <a key={label} href="#" className="flex items-center justify-between border border-slate-200 bg-white p-4 text-sm font-bold text-[#071A2B] transition hover:-translate-y-1 hover:border-[#FFC928]">
                  <span className="flex items-center gap-3"><Icon size={17} /> {label}</span><ArrowUpRight size={16} />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={.12}>
            <form onSubmit={submit} className="relative overflow-hidden rounded-2xl bg-white p-7 shadow-sm sm:p-10">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-[#FFC928]/15" />
              <div className="grid gap-6">
                {["Name", "Email"].map(label => (
                  <label key={label} className="text-xs font-black uppercase tracking-widest text-[#071A2B]">
                    {label}
                    <input required className="mt-3 w-full border border-slate-200 px-4 py-4 text-sm outline-none transition focus:border-[#FFC928] focus:ring-4 focus:ring-[#FFC928]/10" placeholder={`Your ${label.toLowerCase()}`} />
                  </label>
                ))}
                <label className="text-xs font-black uppercase tracking-widest text-[#071A2B]">
                  Message
                  <textarea required rows="7" className="mt-3 w-full resize-none border border-slate-200 px-4 py-4 text-sm outline-none transition focus:border-[#FFC928] focus:ring-4 focus:ring-[#FFC928]/10" placeholder="Tell us what's on your mind..." />
                </label>
                <button disabled={sent} className="flex items-center justify-center gap-2 bg-[#FFC928] px-6 py-4 text-xs font-black uppercase tracking-widest text-[#071A2B] transition hover:bg-[#071A2B] hover:text-white disabled:opacity-80">
                  {sent ? <>Message Ready <CheckCircle2 size={16} /></> : <>Send Message <ArrowUpRight size={16} /></>}
                </button>
              </div>
              {sent && <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute inset-x-5 bottom-5 rounded-xl bg-[#071A2B] p-4 text-center text-xs font-bold text-white">Thanks — your message is ready for the team.</motion.div>}
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
