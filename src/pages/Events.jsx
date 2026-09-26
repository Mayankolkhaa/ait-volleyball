import { useEffect, useMemo, useState } from "react";
import socket from "../services/socket";
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
  Volleyball,
  ArrowUpRight,
  Radio,
  Sparkles,
  Medal,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
//import { events } from "../data/events";

/* =========================================================
   FILTERS
========================================================= */
const API_URL = import.meta.env.VITE_API_URL;
const tabs = ["Upcoming", "Live", "Past", "All"];

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div
      className="
        group
        rounded-xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-3
        transition
        hover:border-[#FFC928]/20
        hover:bg-white/[0.04]
      "
    >
      <div className="flex items-center gap-2">
        <Icon
          size={13}
          className="text-[#FFC928] transition group-hover:scale-110"
        />

        <span
          className="
            text-[7px]
            font-black
            uppercase
            tracking-[0.18em]
            text-white/30
          "
        >
          {label}
        </span>
      </div>

      <p className="mt-2 text-[11px] font-bold text-white/80">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   LIVE SCORE DISPLAY
========================================================= */

function LiveScore({ event, compact = false }) {
  return (
    <div
      className={`
        ${
          compact
            ? "rounded-xl p-4"
            : "rounded-2xl p-5 sm:p-7"
        }
        border
        border-red-500/20
        bg-gradient-to-br
        from-red-500/[0.08]
        via-[#071A2B]
        to-[#071A2B]
      `}
    >
      {/* TOP */}

      <div className="mb-5 flex items-center justify-between">
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

        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-red-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          LIVE
        </div>
      </div>

      {/* SCORE */}

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* AIT */}

        <div className="text-center">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              mx-auto
              grid
              h-12
              w-12
              place-items-center
              rounded-xl
              bg-[#FFC928]
              text-[#071A2B]
              shadow-[0_0_25px_rgba(255,201,40,.15)]
            "
          >
            <Volleyball size={22} />
          </motion.div>

          <p className="mt-2 text-[10px] font-black text-white">
            AIT
          </p>
        </div>

        {/* SCORE */}

        <div className="text-center">
          <motion.div
            key={`${event.score?.ait}-${event.score?.opponent}`}
            initial={{ scale: 0.8, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
            }}
            className="
              display
              text-5xl
              leading-none
              text-white
              sm:text-7xl
            "
          >
            {event.score?.ait ?? 0}

            <span className="mx-2 text-white/15">
              -
            </span>

            {event.score?.opponent ?? 0}
          </motion.div>

          <p className="mt-2 text-[7px] font-black uppercase tracking-widest text-red-400">
            Set Score
          </p>
        </div>

        {/* OPPONENT */}

        <div className="text-center">
          <div
            className="
              mx-auto
              grid
              h-12
              w-12
              place-items-center
              rounded-xl
              bg-white/5
              text-white/35
            "
          >
            <Trophy size={21} />
          </div>

          <p className="mt-2 text-[10px] font-black text-white">
            {event.opponent || "Opponent"}
          </p>
        </div>
      </div>

      {/* SETS */}

      {event.sets?.length > 0 && (
        <div className="mt-6 border-t border-white/[0.08] pt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/25">
              Set Scores
            </p>

            {event.lastUpdated && (
              <p className="text-[7px] font-bold uppercase tracking-widest text-white/20">
                Updated {event.lastUpdated}
              </p>
            )}
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-2
              sm:grid-cols-4
            "
          >
            {event.sets
  ?.filter((set) => set.status === "Finished")
  .map((set) => (
    <motion.div
      key={set.number}
      whileHover={{ y: -2 }}
      className="
        rounded-lg
        border
        border-white/[0.06]
        bg-white/[0.025]
        px-3
        py-2.5
        text-center
      "
    >
      <p className="text-[6px] font-black uppercase tracking-wider text-white/30">
        Set {set.number}
      </p>

      <p className="mt-1 text-sm font-black text-white">
        {set.ait}
        <span className="mx-1 text-white/20">
          -
        </span>
        {set.opponent}
      </p>

      <p className="mt-1 text-[6px] font-black uppercase tracking-wider text-white/20">
        Final
      </p>
    </motion.div>
  ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   LIVE SPOTLIGHT
========================================================= */

function LiveSpotlight({ event, onOpen }) {
  if (!event) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        relative
        mb-14
        overflow-hidden
        rounded-3xl
        bg-[#071A2B]
        shadow-[0_25px_80px_rgba(7,26,43,.22)]
      "
    >
      {/* COURT LINES */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-white/[0.04]" />
        <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full border border-white/[0.04]" />
        <div className="absolute bottom-[-120px] left-[-80px] h-72 w-72 rounded-full border border-[#FFC928]/[0.05]" />

        <motion.div
          animate={{ x: ["-20%", "120%"] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          }}
          className="
            absolute
            left-0
            top-0
            h-full
            w-40
            rotate-[20deg]
            bg-gradient-to-r
            from-transparent
            via-white/[0.025]
            to-transparent
            blur-xl
          "
        />
      </div>

      <div className="relative grid lg:grid-cols-[1fr_1.15fr]">
        {/* LEFT */}

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-5 flex items-center gap-3">
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-red-500
                px-3
                py-1.5
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

            <span className="text-[8px] font-black uppercase tracking-widest text-white/25">
              {event.round || "Match"}
            </span>
          </div>

          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#FFC928]">
            {event.competition || "AIT Volleyball"}
          </p>

          <h2
            className="
              display
              mt-3
              max-w-xl
              text-5xl
              leading-[0.85]
              text-white
              sm:text-6xl
            "
          >
            {event.title}
          </h2>

          <p className="mt-5 max-w-lg text-xs leading-5 text-white/35">
            {event.details || event.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {event.date && (
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-[8px] font-bold text-white/45">
                <CalendarDays size={12} />
                {event.date}
              </span>
            )}

            {(event.venue || event.location) && (
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2 text-[8px] font-bold text-white/45">
                <MapPin size={12} />
                {event.venue || event.location}
              </span>
            )}
          </div>

          <motion.button
            type="button"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpen(event)}
            className="
              mt-7
              inline-flex
              items-center
              gap-3
              rounded-xl
              bg-[#FFC928]
              px-5
              py-3.5
              text-[9px]
              font-black
              uppercase
              tracking-widest
              text-[#071A2B]
              shadow-[0_10px_30px_rgba(255,201,40,.12)]
              transition
              hover:bg-[#FFD84D]
            "
          >
            Open Match Center
            <ArrowUpRight size={14} />
          </motion.button>
        </div>

        {/* RIGHT */}

        <div className="border-t border-white/[0.06] p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
          <LiveScore event={event} />
        </div>
      </div>
    </motion.section>
  );
}

/* =========================================================
   EVENT CARD
========================================================= */

function EventCard({ event, onOpen }) {
  const isLive =
  event.status === "Live" &&
  event.matchStatus === "Live";

const isFinished =
  event.matchStatus === "Finished";

  const isPast = event.status === "Past";

  return (
    <motion.article
      layout
      whileHover={{ y: -5 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 22,
      }}
      onClick={() => onOpen(event)}
      className={`
        group
        relative
        cursor-pointer
        overflow-hidden
        rounded-2xl
        bg-white
        p-5
        shadow-sm
        transition
        hover:shadow-xl
        sm:p-7
        ${
          isLive
            ? "border-2 border-red-500/20"
            : "border border-transparent"
        }
      `}
    >
      {/* HOVER ACCENT */}

      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.35 }}
        className="
          absolute
          left-0
          right-0
          top-0
          h-1
          origin-left
          bg-[#FFC928]
        "
      />

      <div
        className="
          grid
          gap-5
          sm:grid-cols-[95px_1fr_auto]
          sm:items-center
        "
      >
        </div>
        {/* DATE */}

        <div
          className={`
            relative
            overflow-hidden
            rounded-xl
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
            <span className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-white" />
          )}

          <div className="display text-5xl text-white">
            {event.day}
          </div>

          <div className="text-[8px] font-black text-white/80">
            {event.month} {event.year}
          </div>
        </div>

        {/* INFO */}

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            {isLive ? (
              <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-red-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Live Now
              </span>
            ) : isFinished ? (
              <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-[#0D4B73]">
    <Trophy size={11} />
    Match Finished
  </span>
) : (
              <span
                className={`
                  text-[8px]
                  font-black
                  uppercase
                  tracking-widest
                  ${
                    isPast
                      ? "text-slate-400"
                      : "text-[#071A2B]"
                  }
                `}
              >
                {event.status}
              </span>
            )}

            <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">
              {event.year}
            </span>
          </div>

          <h2
            className="
              text-xl
              font-black
              tracking-tight
              text-[#071A2B]
              transition
              group-hover:text-[#0D4B73]
              sm:text-2xl
            "
          >
            {event.title}
          </h2>

          <p className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <MapPin size={13} />
            {event.location}
          </p>

          <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-5 text-slate-400">
            {event.description}
          </p>

          {/* LIVE MINI SCORE */}

          {isLive && (
  <div className="mt-4 inline-flex items-center gap-3 rounded-lg bg-[#071A2B] px-4 py-2 text-white">
    <span className="text-[8px] font-black text-[#FFC928]">
      AIT
    </span>

    <span className="text-lg font-black">
      {event.score?.ait ?? 0}
    </span>

    <span className="text-white/20">
      -
    </span>

    <span className="text-lg font-black">
      {event.score?.opponent ?? 0}
    </span>

    <span className="text-[8px] font-black text-white/35">
      {event.opponent || "Opponent"}
    </span>
  </div>
)}

{isFinished && (
  <div className="mt-4 inline-flex items-center gap-3 rounded-lg bg-[#071A2B] px-4 py-2 text-white">
    <span className="text-[8px] font-black text-[#FFC928]">
      FINAL
    </span>

    <span className="text-lg font-black">
      {event.aitSetsWon ?? 0}
    </span>

    <span className="text-white/20">
      -
    </span>

    <span className="text-lg font-black">
      {event.opponentSetsWon ?? 0}
    </span>

    <span className="text-[8px] font-black text-white/35">
      {event.winnerName
        ? `Winner: ${event.winnerName}`
        : event.opponent || "Opponent"}
    </span>
  </div>
)}

        {/* ACTION */}

        <div className="hidden sm:block">
          <motion.div
            whileHover={{ rotate: 45 }}
            className="
              grid
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
            "
          >
            <ArrowUpRight size={17} />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   FINISHED MATCH DISPLAY
========================================================= */

function FinishedMatch({ event }) {
  const history =
    event.matchHistory || {};

  const sets =
    history.sets ||
    event.sets ||
    [];

  const pointHistory =
    history.pointHistory ||
    event.pointHistory ||
    [];

  const aitSets =
    history.finalScore?.aitSets ??
    event.aitSetsWon ??
    0;

  const opponentSets =
    history.finalScore?.opponentSets ??
    event.opponentSetsWon ??
    0;

  const winnerName =
    history.winnerName ||
    event.winnerName ||
    "";

  return (
    <div className="space-y-4 overflow-y-auto pr-1">
      
      {/* FINAL RESULT */}
      <div className="rounded-2xl border border-[#FFC928]/20 bg-gradient-to-br from-[#FFC928]/10 via-white/[0.025] to-white/[0.02] p-6">
        
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.25em] text-[#FFC928]">
              Final Result
            </p>

            <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-white/25">
              Match Completed
            </p>
          </div>

          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFC928] text-[#071A2B]">
            <Trophy size={18} />
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          
          {/* AIT */}
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-[#FFC928] text-[#071A2B]">
              <Volleyball size={24} />
            </div>

            <p className="mt-3 text-xs font-black text-white">
              AIT
            </p>
          </div>

          {/* SCORE */}
          <div className="text-center">
            <div className="display text-5xl leading-none text-white sm:text-6xl">
              {aitSets}
              <span className="mx-2 text-white/20">
                -
              </span>
              {opponentSets}
            </div>

            <p className="mt-2 text-[7px] font-black uppercase tracking-widest text-[#FFC928]">
              Final Sets
            </p>
          </div>

          {/* OPPONENT */}
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-white/5 text-white/35">
              <Trophy size={22} />
            </div>

            <p className="mt-3 text-xs font-black text-white">
              {event.opponent || "Opponent"}
            </p>
          </div>
        </div>

        {/* WINNER */}
        {winnerName && (
          <div className="mt-6 rounded-xl border border-[#FFC928]/20 bg-[#FFC928]/[0.06] px-4 py-3 text-center">
            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#FFC928]">
              Winner
            </p>

            <p className="mt-1 text-lg font-black text-white">
              {winnerName}
            </p>
          </div>
        )}

        {/* COMPLETED TIME */}
        {event.completedAt && (
          <p className="mt-4 text-center text-[7px] font-bold uppercase tracking-widest text-white/20">
            Completed{" "}
            {new Date(
              event.completedAt
            ).toLocaleString()}
          </p>
        )}
      </div>

      {/* SET HISTORY */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-[#FFC928]">
            <Target size={15} />
          </div>

          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#FFC928]">
              Match History
            </p>

            <p className="mt-1 text-[8px] text-white/25">
              Set-by-set results
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {sets.map((set) => (
            <div
              key={set.number}
              className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.025] px-4 py-3"
            >
              <div>
                <p className="text-[7px] font-black uppercase tracking-widest text-white/25">
                  Set {set.number}
                </p>

                <p className="mt-1 text-[7px] font-bold uppercase tracking-wider text-white/20">
                  {set.status === "Finished"
                    ? "Finished"
                    : set.status}
                </p>
              </div>

              <p className="text-lg font-black text-white">
                {set.ait}
                <span className="mx-2 text-white/20">
                  -
                </span>
                {set.opponent}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* POINT HISTORY */}
      {pointHistory.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-[#FFC928]">
              <Zap size={15} />
            </div>

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#FFC928]">
                Point History
              </p>

              <p className="mt-1 text-[8px] text-white/25">
                Complete scoring record
              </p>
            </div>
          </div>

          <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
            {pointHistory.map(
              (point, index) => (
                <div
                  key={`${point.set}-${index}`}
                  className="flex items-center justify-between rounded-lg bg-white/[0.025] px-3 py-2"
                >
                  <span className="text-[7px] font-black uppercase tracking-widest text-white/25">
                    Set {point.set}
                  </span>

                  <span
                    className={`text-[8px] font-black uppercase ${
                      point.team === "ait"
                        ? "text-[#FFC928]"
                        : "text-white/50"
                    }`}
                  >
                    {point.team === "ait"
                      ? "AIT +1"
                      : `${event.opponent || "Opponent"} +1`}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* MVP */}
      {event.mvp && (
        <div className="flex items-center gap-4 rounded-2xl border border-[#FFC928]/20 bg-[#FFC928]/[0.05] p-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#FFC928] text-[#071A2B]">
            <Medal size={21} />
          </div>

          <div>
            <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#FFC928]">
              Player / MVP
            </p>

            <p className="mt-1 text-sm font-black text-white">
              {event.mvp}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MATCH CENTER MODAL
========================================================= */

function EventDetails({ event, onClose }) {
  const [section, setSection] = useState("overview");

  useEffect(() => {
    if (!event) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction =
      document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    // Stop Lenis
    window.dispatchEvent(
      new Event("modal:open")
    );

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction =
        previousTouchAction;

        // Restart Lenis
      window.dispatchEvent(
        new Event("modal:close"))
    };
  }, [event]);

  if (!event) return null;

  const isLive =
  event.status === "Live" &&
  event.matchStatus === "Live";

const isFinished =
  event.matchStatus === "Finished";

  const modalTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Zap,
    },
    {
      id: "details",
      label: "Details",
      icon: Target,
    },
    {
      id: "highlights",
      label: "Highlights",
      icon: Sparkles,
    },
  ];

  return (
    <motion.div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-[#020A11]/90
        p-3
        backdrop-blur-xl
        sm:p-6
        overscroll-none
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      //onWheel={(e) => e.preventDefault()}
      //onTouchMove={(e) => e.preventDefault()}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 20,
          scale: 0.97,
        }}
        transition={{
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          flex
          h-[calc(100vh-24px)]
          w-full
          max-w-5xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-[#071A2B]
          shadow-[0_30px_100px_rgba(0,0,0,.65)]
          overscrool-contain
          sm:h-[calc(100vh-48px)]
          sm:max-h-[850px]
          sm:rounded-3xl
        "
      >
        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-3
            top-3
            z-50
            grid
            h-10
            w-10
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
          "
        >
          <X size={17} />
        </button>

        {/* HEADER */}

        <div
          className="
            relative
            shrink-0
            overflow-hidden
            border-b
            border-white/[0.07]
            px-5
            pb-4
            pt-5
            sm:px-8
            sm:pb-5
            sm:pt-6
          "
        >
          <div className="absolute right-[-80px] top-[-100px] h-64 w-64 rounded-full bg-[#FFC928]/10 blur-3xl" />

          <div className="relative pr-12">
            <div className="flex items-center gap-3">
              {isLive ? (
  <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-white">
    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
    Live Now
  </span>
) : isFinished ? (
  <span className="inline-flex items-center gap-2 rounded-full bg-[#FFC928] px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-[#071A2B]">
    <Trophy size={11} />
    Match Finished
  </span>
) : (
  <span className="rounded-full bg-white/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-white/50">
    {event.status}
  </span>
)}

              {event.round && (
                <span className="text-[8px] font-black uppercase tracking-widest text-white/25">
                  {event.round}
                </span>
              )}
            </div>

            <p className="mt-3 text-[8px] font-black uppercase tracking-[0.25em] text-[#FFC928]">
              {event.competition || "AIT Volleyball"}
            </p>

            <h2 className="display mt-1 max-w-3xl text-4xl leading-[0.88] text-white sm:text-5xl">
              {event.title}
            </h2>
          </div>
        </div>

        {/* TABS */}

        <div
          className="
            shrink-0
            border-b
            border-white/[0.07]
            px-4
            sm:px-8
          "
        >
          <div className="flex gap-1">
            {modalTabs.map((item) => {
              const Icon = item.icon;
              const active = section === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`
                    relative
                    flex
                    min-h-12
                    items-center
                    gap-2
                    px-3
                    text-[8px]
                    font-black
                    uppercase
                    tracking-widest
                    transition
                    sm:px-4
                    ${
                      active
                        ? "text-[#FFC928]"
                        : "text-white/30 hover:text-white/60"
                    }
                  `}
                >
                  <Icon size={13} />

                  {item.label}

                  {active && (
                    <motion.span
                      layoutId="event-tab"
                      className="
                        absolute
                        bottom-0
                        left-2
                        right-2
                        h-0.5
                        rounded-full
                        bg-[#FFC928]
                      "
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTENT */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y px-4 pb-8 sm:p-6" 
        onWheel={(e) => e.stopPropagation()}
  onTouchMove={(e) => e.stopPropagation()}
  >
          <AnimatePresence mode="wait">

            {/* OVERVIEW */}

            {section === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {isLive ? (
                  <div className="grid h-full gap-4 lg:grid-cols-[1.15fr_.85fr]">
                    <LiveScore event={event} />

                    <div className="grid grid-cols-2 gap-2 content-start">
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
                  </div>
                ) : isFinished ? (
                  <FinishedMatch event={event} />
                ) : (

                  <div className="grid h-full gap-4 lg:grid-cols-2">
                    <div className="flex flex-col justify-center rounded-2xl bg-white/[0.025] p-6">
                      <p className="text-[8px] font-black uppercase tracking-[0.25em] text-[#FFC928]">
                        Event Overview
                      </p>

                      <h3 className="display mt-3 text-5xl leading-none text-white">
                        {event.title}
                      </h3>

                      <p className="mt-4 max-w-lg text-xs leading-5 text-white/35">
                        {event.details || event.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {event.highlights?.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-2 text-[7px] font-bold uppercase tracking-wider text-white/40"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 content-center">
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
                  </div>
                )}
              </motion.div>
            )}

            {/* DETAILS */}

            {section === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="grid h-full gap-4 lg:grid-cols-2"
              >
                <div className="rounded-2xl bg-white/[0.025] p-5 sm:p-7">
                  <p className="text-[8px] font-black uppercase tracking-[0.25em] text-[#FFC928]">
                    About This Event
                  </p>

                  <h3 className="display mt-3 text-4xl text-white">
                    {event.title}
                  </h3>

                  <p className="mt-4 text-xs leading-6 text-white/40">
                    {event.details || event.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 content-start">
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

                  <InfoItem
                    icon={Users}
                    label="Organizer"
                    value={event.organizer}
                  />
                </div>
              </motion.div>
            )}

            {/* HIGHLIGHTS */}

            {section === "highlights" && (
              <motion.div
                key="highlights"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="grid h-full gap-4 lg:grid-cols-[1fr_.7fr]"
              >
                <div className="rounded-2xl bg-white/[0.025] p-5 sm:p-7">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFC928] text-[#071A2B]">
                      <Sparkles size={18} />
                    </div>

                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#FFC928]">
                        Match Highlights
                      </p>

                      <p className="mt-1 text-[9px] text-white/25">
                        Key moments from the event
                      </p>
                    </div>
                  </div>

                  {event.highlights?.length > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {event.highlights.map((highlight, index) => (
                        <motion.div
                          key={highlight}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: index * 0.05,
                          }}
                          className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-white/[0.06]
                            bg-white/[0.025]
                            p-4
                          "
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/5 text-[#FFC928]">
                            <Zap size={13} />
                          </span>

                          <span className="text-[9px] font-bold text-white/55">
                            {highlight}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/25">
                      Highlights will be added soon.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  {event.mvp && (
                    <div
                      className="
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        border-[#FFC928]/20
                        bg-[#FFC928]/[0.05]
                        p-5
                      "
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#FFC928] text-[#071A2B]">
                        <Medal size={21} />
                      </div>

                      <div>
                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[#FFC928]">
                          Player / MVP
                        </p>

                        <p className="mt-1 text-sm font-black text-white">
                          {event.mvp}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">
                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/25">
                      AIT Volleyball
                    </p>

                    <p className="display mt-2 text-4xl text-white">
                      COURT ENERGY
                    </p>

                    <p className="mt-2 text-[9px] leading-5 text-white/25">
                      Tournaments. Matches. Moments.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   EVENTS PAGE
========================================================= */

export default function Events() {
  const [tab, setTab] = useState("Upcoming");

  const [events, setEvents] = useState([]);

  const [matches, setMatches] = useState([]);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [liveMatch, setLiveMatch] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH EVENTS FROM MONGODB
  // =====================================================

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/events`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch events"
          );
        }

        console.log(
          "📅 Events fetched from MongoDB:",
          data.events
        );

        setEvents(data.events || []);
      } catch (error) {
        console.error(
          "Failed to fetch events:",
          error
        );

        setError(
          "Unable to load events right now."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // =====================================================
  // FETCH CURRENT LIVE MATCH
  // =====================================================

  // =====================================================
// FETCH ALL MATCHES
// =====================================================

useEffect(() => {
  const fetchMatches = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/matches`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch matches"
        );
      }

      console.log(
        "🏐 Matches fetched from MongoDB:",
        data.matches
      );

      setMatches(data.matches || []);
    } catch (error) {
      console.error(
        "Failed to fetch matches:",
        error
      );
    }
  };

  fetchMatches();
}, []);

  // =====================================================
  // REAL-TIME SCORE UPDATES
  // =====================================================

  useEffect(() => {
  const handleScoreUpdate = (match) => {
    console.log(
      "🔥 Events.jsx received match update:",
      match
    );

    setMatches((currentMatches) => {
      const exists = currentMatches.some(
        (item) =>
          Number(item.eventId) ===
          Number(match.eventId)
      );

      if (exists) {
        return currentMatches.map((item) =>
          Number(item.eventId) ===
          Number(match.eventId)
            ? match
            : item
        );
      }

      return [...currentMatches, match];
    });
  };

  socket.on(
    "scoreUpdated",
    handleScoreUpdate
  );

  return () => {
    socket.off(
      "scoreUpdated",
      handleScoreUpdate
    );
  };
}, []);

  // =====================================================
  // FIND LIVE EVENT
  // =====================================================

  

  // =====================================================
  // MERGE LIVE MATCH SCORE INTO LIVE EVENT
  // =====================================================

  // =====================================================
// FIND MATCH FOR EVENT
// =====================================================

const getMatchForEvent = (event) => {
  if (!event) return null;

  return (
    matches.find(
      (match) =>
        Number(match.eventId) ===
        Number(event.eventId)
    ) || null
  );
};

// =====================================================
// CURRENT LIVE EVENT
// =====================================================

const liveEvent = useMemo(() => {
  return events.find(
    (event) =>
      event.status === "Live"
  );
}, [events]);

// =====================================================
// LIVE EVENT + MATCH DATA
// =====================================================

const liveEventWithScore = useMemo(() => {
  if (!liveEvent) {
    return null;
  }

  const match = getMatchForEvent(
    liveEvent
  );

  if (!match) {
    return liveEvent;
  }

  return {
    ...liveEvent,

    matchStatus:
      match.status,

    score: {
      ait:
        match.aitPoints ?? 0,

      opponent:
        match.opponentPoints ?? 0,
    },

    currentSet:
      match.currentSet,

    aitSetsWon:
      match.aitSetsWon ?? 0,

    opponentSetsWon:
      match.opponentSetsWon ?? 0,

    sets:
      match.sets || [],

    lastUpdated:
      match.lastUpdated,

    mvp:
      match.mvp,

    highlights:
      match.highlights,

    winner:
      match.winner,

    winnerName:
      match.winnerName,

    completedAt:
      match.completedAt,

    matchHistory:
      match.matchHistory,

    pointHistory:
      match.pointHistory || [],
  };
}, [liveEvent, matches]);

  // =====================================================
  // FILTER EVENTS
  // =====================================================

  // =====================================================
// FILTER EVENTS + MATCH DATA
// =====================================================

const visible = useMemo(() => {
  let filteredEvents;

  if (tab === "All") {
    filteredEvents = events;
  } else {
    filteredEvents = events.filter(
      (event) =>
        event.status === tab
    );
  }

  return filteredEvents.map((event) => {
    const match =
      matches.find(
        (item) =>
          Number(item.eventId) ===
          Number(event.eventId)
      );

    if (!match) {
      return event;
    }

    return {
      ...event,

      matchStatus:
        match.status,

      score: {
        ait:
          match.aitPoints ?? 0,

        opponent:
          match.opponentPoints ?? 0,
      },

      currentSet:
        match.currentSet,

      aitSetsWon:
        match.aitSetsWon ?? 0,

      opponentSetsWon:
        match.opponentSetsWon ?? 0,

      sets:
        match.sets || [],

      lastUpdated:
        match.lastUpdated,

      mvp:
        match.mvp,

      highlights:
        match.highlights,

      winner:
        match.winner,

      winnerName:
        match.winnerName,

      completedAt:
        match.completedAt,

      matchHistory:
        match.matchHistory,

      pointHistory:
        match.pointHistory || [],
    };
  });
}, [tab, events, matches]);

  // =====================================================
  // LOCK BACKGROUND WHEN MODAL IS OPEN
  // =====================================================

  useEffect(() => {
    if (!selectedEvent) return;

    const previousOverflow =
      document.body.style.overflow;

    const previousTouchAction =
      document.body.style.touchAction;

    document.body.style.overflow =
      "hidden";

    document.body.style.touchAction =
      "none";

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.body.style.touchAction =
        previousTouchAction;
    };
  }, [selectedEvent]);

  // =====================================================
  // SELECTED EVENT WITH LIVE SCORE
  // =====================================================

  // =====================================================
// SELECTED EVENT + MATCH DATA
// =====================================================

const displayEvent = useMemo(() => {
  if (!selectedEvent) {
    return null;
  }

  const match =
    matches.find(
      (item) =>
        Number(item.eventId) ===
        Number(selectedEvent.eventId)
    );

  if (!match) {
    return selectedEvent;
  }

  return {
    ...selectedEvent,

    matchStatus:
      match.status,

    score: {
      ait:
        match.aitPoints ?? 0,

      opponent:
        match.opponentPoints ?? 0,
    },

    currentSet:
      match.currentSet,

    aitSetsWon:
      match.aitSetsWon ?? 0,

    opponentSetsWon:
      match.opponentSetsWon ?? 0,

    sets:
      match.sets || [],

    lastUpdated:
      match.lastUpdated,

    mvp:
      match.mvp,

    highlights:
      match.highlights,

    winner:
      match.winner,

    winnerName:
      match.winnerName,

    completedAt:
      match.completedAt,

    matchHistory:
      match.matchHistory,

    pointHistory:
      match.pointHistory || [],
  };
}, [selectedEvent, matches]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <>
        <PageHero
          eyebrow="Tournaments. Matches. Moments."
          title="Events"
          subtitle="Follow the competitions, matches and activities that shape the AIT Volleyball season."
          image="https://images.unsplash.com/photo-1530137073521-4d2e5f5b4b9a?auto=format&fit=crop&w=2200&q=85"
        />

        <section className="bg-[#F5F7FA] py-24">
          <div className="container-site">
            <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#FFC928]" />

              <p className="mt-5 text-sm font-bold text-slate-400">
                Loading events...
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}

      <PageHero
        eyebrow="Tournaments. Matches. Moments."
        title="Events"
        subtitle="Follow the competitions, matches and activities that shape the AIT Volleyball season."
        image="https://images.unsplash.com/photo-1530137073521-4d2e5f5b4b9a?auto=format&fit=crop&w=2200&q=85"
      />

      <section className="bg-[#F5F7FA] py-16 sm:py-24">
        {loading && (
  <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 text-center">
    <p className="text-sm font-bold text-slate-500">
      Loading events...
    </p>
  </div>
)}

{error && (
  <div className="mb-10 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
    <p className="text-sm font-bold text-red-500">
      {error}
    </p>
  </div>
)}
        <div className="container-site">

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-bold text-red-500">
                {error}
              </p>
            </div>
          )}

          {/* =================================================
              LIVE SPOTLIGHT
          ================================================== */}

          {liveEventWithScore && (
            <LiveSpotlight
              event={
                liveEventWithScore
              }
              onOpen={
                setSelectedEvent
              }
            />
          )}

          {/* =================================================
              FILTER BAR
          ================================================== */}

          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0D4B73]">
                Season Schedule
              </p>

              <h2 className="display mt-2 text-5xl leading-none text-[#071A2B] sm:text-6xl">
                MATCHES & EVENTS
              </h2>
            </div>

            <div className="flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm">
              {tabs.map((tabName) => {
                const active =
                  tab === tabName;

                const hasLive =
                  tabName === "Live" &&
                  events.some(
                    (event) =>
                      event.status ===
                      "Live"
                  );

                return (
                  <button
                    key={tabName}
                    type="button"
                    onClick={() =>
                      setTab(tabName)
                    }
                    className={`
                      relative
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      px-4
                      py-2.5
                      text-[8px]
                      font-black
                      uppercase
                      tracking-widest
                      transition
                      ${
                        active
                          ? "bg-[#071A2B] text-white"
                          : "text-slate-400 hover:text-[#071A2B]"
                      }
                    `}
                  >
                    {tabName}

                    {hasLive && (
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              EVENT COUNT
          ================================================== */}

          <div className="mb-5 flex items-center justify-between">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
              {visible.length}{" "}
              {visible.length === 1
                ? "Event"
                : "Events"}
            </p>

            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-300">
              <Radio size={12} />
              AIT Volleyball
            </div>
          </div>

          {/* =================================================
              EVENTS
          ================================================== */}

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {visible.map(
                (event, index) => (
                  <Reveal
                    key={
                      event.eventId
                    }
                    delay={
                      index * 0.05
                    }
                  >
                    <EventCard
                      event={event}
                      onOpen={
                        setSelectedEvent
                      }
                    />
                  </Reveal>
                )
              )}
            </AnimatePresence>
          </div>

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {visible.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="
                rounded-2xl
                border
                border-dashed
                border-slate-200
                bg-white
                py-20
                text-center
              "
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#071A2B] text-[#FFC928]">
                <Volleyball size={22} />
              </div>

              <p className="mt-5 text-sm font-bold text-slate-400">
                No{" "}
                {tab.toLowerCase()}{" "}
                events available.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* =====================================================
          MATCH CENTER
      ====================================================== */}

      <AnimatePresence>
        {displayEvent && (
          <EventDetails
            event={displayEvent}
            onClose={() =>
              setSelectedEvent(
                null
              )
            }
          />
        )}
      </AnimatePresence>
    </>
  );
}