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
event.jsx older page---------
import {useEffect, useMemo, useState } from "react";
import {
  MapPin,
  CalendarDays,
  Clock3,
  X,
  Trophy,
  Users,
  Target,
  Star,
  ChevronRight,
  Radio,
  Volleyball,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { events } from "../data/events";

const tabs = ["Upcoming", "Live", "Past", "All"];

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div
      className="
        rounded-xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-4
      "
    >
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-[#FFC928]" />

        <span
          className="
            text-[8px]
            font-black
            uppercase
            tracking-[0.18em]
            text-white/30
          "
        >
          {label}
        </span>
      </div>

      <p className="mt-2 text-xs font-bold text-white/80">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EVENT DETAILS MODAL
========================================================= */

function EventDetails({ event, onClose }) {
  if (!event) return null;

  const isLive = event.status === "Live";

  return (
    <motion.div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-[#020A11]/90
        p-3
        backdrop-blur-md
        sm:p-5
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onWheel={(e) => e.preventDefault()}
      onTouchMove={(e) => e.preventDefault()}
      onClick={onClose}
    >
      <motion.div
        className="
          relative
          flex
          h-[calc(100vh-24px)]
          max-h-[820px]
          w-full
          max-w-6xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-[#071A2B]
          shadow-[0_30px_100px_rgba(0,0,0,.65)]
          sm:h-[calc(100vh-40px)]
          sm:rounded-3xl
        "
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 20,
          scale: 0.98,
        }}
        transition={{
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* =====================================================
            CLOSE
        ====================================================== */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-3
            top-3
            z-50
            grid
            h-9
            w-9
            place-items-center
            rounded-full
            border
            border-white/10
            bg-black/30
            text-white/60
            backdrop-blur-md
            transition
            hover:border-[#FFC928]
            hover:bg-[#FFC928]
            hover:text-[#071A2B]
            sm:right-5
            sm:top-5
            sm:h-10
            sm:w-10
          "
        >
          <X size={17} />
        </button>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          className="
            relative
            shrink-0
            overflow-hidden
            border-b
            border-white/10
            px-5
            pb-5
            pt-5
            sm:px-8
            sm:pb-6
            sm:pt-6
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              right-[-100px]
              top-[-140px]
              h-[280px]
              w-[280px]
              rounded-full
              bg-[#FFC928]/10
              blur-3xl
            "
          />

          <div className="relative z-10 pr-10">
            {/* STATUS */}

            <div className="mb-2 flex items-center gap-2">
              {isLive ? (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-red-500
                    px-3
                    py-1
                    text-[8px]
                    font-black
                    uppercase
                    tracking-widest
                    text-white
                  "
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  Live Now
                </span>
              ) : (
                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-[8px]
                    font-black
                    uppercase
                    tracking-widest
                    ${
                      event.status === "Past"
                        ? "bg-white/10 text-white/50"
                        : "bg-[#FFC928] text-[#071A2B]"
                    }
                  `}
                >
                  {event.status}
                </span>
              )}

              {event.round && (
                <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
                  {event.round}
                </span>
              )}
            </div>

            {/* COMPETITION */}

            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.25em]
                text-[#FFC928]
              "
            >
              {event.competition || "AIT Volleyball"}
            </p>

            {/* TITLE */}

            <h2
              className="
                display
                mt-1
                max-w-3xl
                text-4xl
                leading-[0.88]
                text-white
                sm:text-5xl
              "
            >
              {event.title}
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-2
                max-w-3xl
                text-[11px]
                leading-4
                text-white/40
                sm:text-xs
                sm:leading-5
              "
            >
              {event.details || event.description}
            </p>
          </div>
        </div>

        {/* =====================================================
            MAIN CONTENT
            NO SCROLL
        ====================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-hidden
            px-4
            py-4
            sm:px-8
            sm:py-5
          "
        >
          <div
            className="
              grid
              h-full
              min-h-0
              gap-4
              lg:grid-cols-[1.15fr_.85fr]
            "
          >
            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="flex min-h-0 flex-col gap-4">
              {/* LIVE SCORE */}

              {isLive && (
                <div
                  className="
                    shrink-0
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/[0.035]
                    p-4
                    sm:p-5
                  "
                >
                  {/* TOP */}

                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-[7px] font-black uppercase tracking-[0.25em] text-white/30">
                        Live Match
                      </p>

                      {event.currentSet && (
                        <p className="mt-1 text-[9px] font-bold text-red-400">
                          Set {event.currentSet}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-red-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                      LIVE
                    </div>
                  </div>

                  {/* SCORE */}

                  <div
                    className="
                      grid
                      grid-cols-[1fr_auto_1fr]
                      items-center
                      gap-3
                    "
                  >
                    {/* AIT */}

                    <div className="text-center">
                      <div
                        className="
                          mx-auto
                          grid
                          h-10
                          w-10
                          place-items-center
                          rounded-lg
                          bg-[#FFC928]
                          text-[#071A2B]
                          sm:h-12
                          sm:w-12
                        "
                      >
                        <Volleyball size={20} />
                      </div>

                      <p className="mt-1 text-[10px] font-black text-white">
                        AIT
                      </p>
                    </div>

                    {/* SCORE */}

                    <div className="text-center">
                      <div
                        className="
                          display
                          text-5xl
                          leading-none
                          text-white
                          sm:text-6xl
                        "
                      >
                        {event.score?.ait ?? 0}

                        <span className="mx-2 text-white/20">
                          -
                        </span>

                        {event.score?.opponent ?? 0}
                      </div>

                      <p className="mt-1 text-[7px] font-black uppercase tracking-widest text-red-400">
                        Live Score
                      </p>
                    </div>

                    {/* OPPONENT */}

                    <div className="text-center">
                      <div
                        className="
                          mx-auto
                          grid
                          h-10
                          w-10
                          place-items-center
                          rounded-lg
                          bg-white/5
                          text-white/40
                          sm:h-12
                          sm:w-12
                        "
                      >
                        <Trophy size={19} />
                      </div>

                      <p className="mt-1 text-[10px] font-black text-white">
                        {event.opponent || "Opponent"}
                      </p>
                    </div>
                  </div>

                  {/* SET SCORES */}

                  {event.sets?.length > 0 && (
                    <div className="mt-4 border-t border-white/10 pt-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/25">
                          Set Scores
                        </p>

                        {event.lastUpdated && (
                          <p className="text-[7px] font-bold uppercase tracking-widest text-white/20">
                            Updated {event.lastUpdated}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-1.5">
                        {event.sets.map((set) => (
                          <div
                            key={set.number}
                            className={`
                              rounded-md
                              border
                              px-2
                              py-2
                              text-center
                              ${
                                set.status === "Live"
                                  ? "border-red-500/30 bg-red-500/[0.07]"
                                  : "border-white/[0.06] bg-white/[0.025]"
                              }
                            `}
                          >
                            <p className="text-[6px] font-black uppercase tracking-wider text-white/30">
                              Set {set.number}
                            </p>

                            <p className="mt-1 text-xs font-black text-white">
                              {set.ait}
                              <span className="mx-1 text-white/20">
                                -
                              </span>
                              {set.opponent}
                            </p>

                            {set.status === "Live" && (
                              <p className="mt-0.5 text-[6px] font-black uppercase text-red-400">
                                Live
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* HIGHLIGHTS */}

              {event.highlights?.length > 0 && (
                <div
                  className="
                    shrink-0
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-white/[0.025]
                    p-4
                  "
                >
                  <p className="mb-2 text-[7px] font-black uppercase tracking-[0.2em] text-[#FFC928]">
                    Match Highlights
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {event.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="
                          rounded-full
                          border
                          border-white/10
                          bg-white/[0.035]
                          px-2.5
                          py-1.5
                          text-[7px]
                          font-bold
                          uppercase
                          tracking-wider
                          text-white/45
                        "
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="flex min-h-0 flex-col gap-3">
              {/* EVENT INFORMATION */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  sm:grid-cols-3
                  lg:grid-cols-2
                "
              >
                <InfoItem
                  icon={CalendarDays}
                  label="Date"
                  value={event.date}
                />

                <InfoItem
                  icon={Clock3}
                  label="Time"
                  value={event.time}
                />

                <InfoItem
                  icon={MapPin}
                  label="Venue"
                  value={event.venue || event.location}
                />

                <InfoItem
                  icon={Users}
                  label="Opponent"
                  value={event.opponent}
                />

                <InfoItem
                  icon={Target}
                  label="Format"
                  value={event.format}
                />

                <InfoItem
                  icon={Trophy}
                  label="Round"
                  value={event.round}
                />
              </div>

              {/* ORGANIZER */}

              {event.organizer && (
                <InfoItem
                  icon={Users}
                  label="Organizer"
                  value={event.organizer}
                />
              )}

              {/* MVP */}

              {event.mvp && (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[#FFC928]/20
                    bg-[#FFC928]/[0.04]
                    p-3
                  "
                >
                  <div
                    className="
                      grid
                      h-9
                      w-9
                      shrink-0
                      place-items-center
                      rounded-lg
                      bg-[#FFC928]
                      text-[#071A2B]
                    "
                  >
                    <Star
                      size={15}
                      fill="currentColor"
                    />
                  </div>

                  <div>
                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#FFC928]">
                      Player / MVP
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-white">
                      {event.mvp}
                    </p>
                  </div>
                </div>
              )}

              {/* DESKTOP FOOTER */}

              <div className="mt-auto hidden lg:block">
                <div className="border-t border-white/[0.06] pt-3">
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20">
                    AIT Volleyball
                  </p>

                  <p className="mt-1 text-[9px] text-white/25">
                    Tournaments. Matches. Moments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   EVENT CARD
========================================================= */

function EventCard({ event, onOpen }) {
  const isLive = event.status === "Live";
  const isPast = event.status === "Past";

  return (
    <motion.article
      layout
      whileHover={{ y: -3 }}
      onClick={() => onOpen(event)}
      className={`
  group
  cursor-pointer
  rounded-2xl
  bg-white
  p-5
  shadow-sm
  transition
  hover:shadow-xl
  sm:p-7
  ${
    isLive
      ? "border-2 border-red-500/20 shadow-[0_10px_40px_rgba(239,68,68,.12)]"
      : "border border-transparent"
  }
`}
    >
      <div
        className="
          grid
          gap-6
          sm:grid-cols-[105px_1fr_auto]
          sm:items-center
        "
      >
        {/* DATE */}

        <div
          className={`
            relative
            overflow-hidden
            p-4
            text-center
            ${
              isLive
                ? "bg-red-500"
                : "bg-[#071A2B]"
            }
          `}
        >
          {isLive && (
            <span
              className="
                absolute
                right-2
                top-2
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-white
              "
            />
          )}

          <div className="display text-5xl text-white">
            {event.day}
          </div>

          <div className="text-[9px] font-black text-white">
            {event.month} {event.year}
          </div>
        </div>

        {/* EVENT INFORMATION */}

        <div>
          <div
            className="
              mb-3
              flex
              flex-wrap
              items-center
              gap-3
              text-[9px]
              font-black
              uppercase
              tracking-widest
            "
          >
            {isLive ? (
              <span className="flex items-center gap-2 text-red-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Live Now
              </span>
            ) : (
              <span
                className={
                  isPast
                    ? "text-slate-400"
                    : "text-[#071A2B]"
                }
              >
                <CalendarDays
                  className="mr-1 inline"
                  size={12}
                />
                {event.status}
              </span>
            )}

            <span className="text-slate-400">
              <Clock3
                className="mr-1 inline"
                size={12}
              />
              Season {event.year}
            </span>
          </div>

          <h2
            className="
              text-xl
              font-extrabold
              text-[#071A2B]
              transition
              group-hover:text-[#0D4B73]
              sm:text-2xl
            "
          >
            {event.title}
          </h2>

          <p
            className="
              mt-2
              flex
              items-center
              gap-2
              text-sm
              text-slate-500
            "
          >
            <MapPin size={14} />
            {event.location}
          </p>

          <p
            className="
              mt-2
              max-w-3xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            {event.description}
          </p>

          {/* LIVE MINI SCORE */}

          {isLive && (
            <div
              className="
                mt-4
                inline-flex
                items-center
                gap-3
                rounded-lg
                bg-[#071A2B]
                px-4
                py-2
                text-white
              "
            >
              <span className="text-[9px] font-black text-[#FFC928]">
                AIT
              </span>

              <span className="text-lg font-black">
                {event.score?.ait ?? 0}
              </span>

              <span className="text-white/25">
                -
              </span>

              <span className="text-lg font-black">
                {event.score?.opponent ?? 0}
              </span>

              <span className="text-[9px] font-black text-white/40">
                {event.opponent || "Opponent"}
              </span>
            </div>
          )}
        </div>

        {/* ARROW */}

        <div
          className="
            hidden
            h-11
            w-11
            place-items-center
            rounded-full
            border
            border-slate-200
            text-slate-400
            transition
            group-hover:border-[#FFC928]
            group-hover:bg-[#FFC928]
            group-hover:text-[#071A2B]
            sm:grid
          "
        >
          <ChevronRight size={18} />
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   EVENTS PAGE
========================================================= */

export default function Events() {
  const [tab, setTab] = useState("Upcoming");
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  useEffect(() => {
  if (!selectedEvent) return;

  const previousOverflow = document.body.style.overflow;
  const previousTouchAction = document.body.style.touchAction;

  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";

  return () => {
    document.body.style.overflow = previousOverflow;
    document.body.style.touchAction = previousTouchAction;
  };
}, [selectedEvent]);

  const visible = useMemo(() => {
    if (tab === "All") {
      return events;
    }

    return events.filter(
      (event) => event.status === tab
    );
  }, [tab]);

  return (
    <>
      <PageHero
        eyebrow="Tournaments. Matches. Moments."
        title="Events"
        subtitle="Follow the competitions, matches and activities that shape the AIT Volleyball season."
        image="https://images.unsplash.com/photo-1530137073521-4d2e5f5b4b9a?auto=format&fit=crop&w=2200&q=85"
      />

      <section className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="container-site">

          {/* FILTERS */}

          <div className="mb-12 flex flex-wrap gap-2">
            {tabs.map((tabName) => {
              const hasLive =
                tabName === "Live" &&
                events.some(
                  (event) => event.status === "Live"
                );

              return (
                <button
                  key={tabName}
                  type="button"
                  onClick={() => setTab(tabName)}
                  className={`
                    px-6
                    py-3
                    text-xs
                    font-black
                    uppercase
                    tracking-widest
                    transition
                    ${
                      tab === tabName
                        ? "bg-[#FFC928] text-[#071A2B]"
                        : "bg-white text-slate-500 hover:text-[#071A2B]"
                    }
                  `}
                >
                  {tabName}

                  {hasLive && (
                    <span className="
                      ml-2
                      inline-block
                      h-2
                      w-2
                      animate-pulse
                      rounded-full
                      bg-red-500
                    " />
                  )}
                </button>
              );
            })}
          </div>

          {/* EVENTS */}

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {visible.map((event, i) => (
                <Reveal
                  key={event.id}
                  delay={i * 0.06}
                >
                  <EventCard
                    event={event}
                    onOpen={setSelectedEvent}
                  />
                </Reveal>
              ))}
            </AnimatePresence>
          </div>

          {/* NO EVENTS */}

          {visible.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-sm font-semibold text-slate-400">
                No {tab.toLowerCase()} events available.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* EVENT DETAILS */}

      <AnimatePresence>
        {selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
----------------------
MONGO_URI=mongodb+srv://itsmrolkha1318_db_user:pyTH4p0TJaf8nC7T@aitvolleyball.s4sbnkg.mongodb.net/?appName=AitVolleyball

MONGO_URI=mongodb+srv://itsmrolkha1318_db_user:pyTH4p0TJaf8nC7T@aitvolleyball.s4sbnkg.mongodb.net/?appName=AitVolleyball
