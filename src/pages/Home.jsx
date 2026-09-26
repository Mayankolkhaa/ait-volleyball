import { useRef } from "react";
import { ArrowRight, MapPin, Trophy, Users, Star, Heart, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { journey } from "../data/journey";
import { memories } from "../data/memories";
import { players } from "../data/players";
//import { events } from "../data/events";
import { useEffect, useState } from "react";

//const heroImage = "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=2200&q=90";
const heroImage = "/images/hero/ait-volleyball-hero.jpeg";
//const courtImage = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1800&q=90";
const courtImage = "/images/court/ait-court.jpeg";

const stats = [
  [Users, "25+", "Active Players"],
  [Trophy, "10+", "Tournaments"],
  [Star, "8+", "Wins"],
  [Heart, "100+", "Memories"],
];

function SectionMarker({ number, label, light = false }) {
  return (
    <div className={`mb-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] ${light ? "text-white/40" : "text-slate-400"}`}>
      <span className={light ? "text-[#FFC928]" : "text-[#071A2B]"}>{number}</span>
      <span className="h-px w-10 bg-current opacity-50" />
      <span>{label}</span>
    </div>
  );
}

function Ball() {
  return (
    <div className="relative h-16 w-16 rounded-full border-[3px] border-white bg-[#FFC928] shadow-[0_0_40px_rgba(255,201,40,.3)]">
      <span className="absolute inset-[13%] rounded-full border-2 border-[#071A2B]/70" />
      <span className="absolute left-[16%] top-[39%] h-1/2 w-[115%] -rotate-[38deg] rounded-full border-t-2 border-[#071A2B]/70" />
      <span className="absolute left-[34%] top-[-7%] h-[112%] w-1/2 rotate-[48deg] rounded-full border-r-2 border-[#071A2B]/70" />
    </div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const courtRef = useRef(null);
  const journeyRef = useRef(null);
  const memoryRef = useRef(null);
  const finalRef = useRef(null);

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: courtProgress } = useScroll({ target: courtRef, offset: ["start end", "end start"] });
  const { scrollYProgress: journeyProgress } = useScroll({ target: journeyRef, offset: ["start end", "end start"] });
  const { scrollYProgress: memoryProgress } = useScroll({ target: memoryRef, offset: ["start end", "end start"] });
  const { scrollYProgress: finalProgress } = useScroll({ target: finalRef, offset: ["start end", "end start"] });

  const heroY = useTransform(heroProgress, [0, 1], ["0%", "32%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.13]);
  const heroOpacity = useTransform(heroProgress, [0, .72, 1], [1, .8, 0]);
  const heroTextY = useTransform(heroProgress, [0, 1], ["0px", "150px"]);

  const courtScale = useSpring(useTransform(courtProgress, [0, .5, 1], [1.16, 1, 1.08]), { stiffness: 90, damping: 22 });
  const courtX = useTransform(courtProgress, [0, 1], ["-7%", "7%"]);

  const journeyX = useTransform(journeyProgress, [0, .35, .72, 1], ["0%", "-12%", "-52%", "-72%"]);
  const journeyOpacity = useTransform(journeyProgress, [0, .08, .9, 1], [0, 1, 1, 0]);

  const memoryY = useTransform(memoryProgress, [0, 1], ["8%", "-8%"]);
  const memoryRotate = useTransform(memoryProgress, [0, 1], [-2, 2]);

  const finalBallX = useTransform(finalProgress, [0, .5, 1], ["-20vw", "0vw", "105vw"]);
  const finalBallY = useTransform(finalProgress, [0, .5, 1], ["12vh", "-8vh", "-25vh"]);
  const finalBallRotate = useTransform(finalProgress, [0, 1], [0, 720]);
  const finalTextScale = useTransform(finalProgress, [0, .5, 1], [.75, 1, 1.15]);
  const finalTextOpacity = useTransform(finalProgress, [0, .25, .8, 1], [0, 1, 1, 0]);
  
  const API_URL = import.meta.env.VITE_API_URL;

const [events, setEvents] = useState([]);
const [eventsLoading, setEventsLoading] = useState(true);

useEffect(() => {
  const fetchEvents = async () => {
    try {
      setEventsLoading(true);

      const response = await fetch(`${API_URL}/api/events`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }

      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch home events:", error);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  fetchEvents();
}, []);

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section ref={heroRef} className="relative h-[115vh] bg-[#071A2B]">
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity, backgroundImage: `linear-gradient(90deg, rgba(7,26,43,.72) 0%, rgba(7,26,43,.38) 45%, rgba(7,26,43,.08) 100%), url(${heroImage})` }}
        
          className="absolute inset-0 bg-cover bg-center will-change-transform"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(255,201,40,.13),transparent_24%)]" />
        <motion.div style={{ y: heroTextY, opacity: heroOpacity }} className="container-site relative z-10 flex h-full items-center pt-16">
          <div className="max-w-5xl">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }} className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-[#FFC928]">
              Play · Train · Compete · Belong
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .8 }} className="display text-[clamp(5rem,13vw,11rem)] leading-[.74] text-white">
              SPIKE<br /><span className="text-[#FFC928]">HIGHER</span>
            </motion.h1>
            <motion.div initial={{ width: 0 }} animate={{ width: 90 }} transition={{ delay: 1, duration: .5 }} className="mt-8 h-1 bg-[#FFC928]" />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .9 }} className="mt-5 max-w-md text-sm font-medium leading-7 text-white/60">
              AIT Volleyball is built around discipline, teamwork, competition and the moments that make a team unforgettable.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }} className="mt-8 flex flex-wrap gap-3">
              <Link to="/journey" className="inline-flex items-center gap-3 bg-[#FFC928] px-6 py-4 text-xs font-black uppercase tracking-widest text-[#071A2B] transition hover:-translate-y-1 hover:bg-white">
                Explore Journey <ArrowRight size={16} />
              </Link>
              <Link to="/players" className="inline-flex items-center gap-3 border border-white/25 bg-white/5 px-6 py-4 text-xs font-black uppercase tracking-widest text-white backdrop-blur hover:border-[#FFC928] hover:text-[#FFC928]">
                Meet The Team
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
          <span>Scroll to enter</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ChevronDown size={17} /></motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="relative z-20 bg-[#071A2B]">
        <div className="container-site grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 sm:grid-cols-4">
          {stats.map(([Icon, value, label], i) => (
            <Reveal key={label} delay={i * .08}>
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center sm:py-12">
                <Icon size={18} className="text-[#FFC928]" />
                <strong className="display text-4xl text-white">{value}</strong>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative bg-[#F5F7FA] py-28 sm:py-36">
        <div className="container-site grid gap-16 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <Reveal>
            <SectionMarker number="01" label="The AIT Spirit" />
            <SectionHeading eyebrow="More than just a sport" title="Volleyball At AIT" />
            <p className="max-w-xl text-base leading-8 text-slate-600">
              A community of passionate players, dedicated training and shared ambition. Every practice adds another chapter to the AIT Volleyball story.
            </p>
            <Link to="/journey" className="mt-8 inline-flex items-center gap-3 bg-[#071A2B] px-5 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-[#FFC928] hover:text-[#071A2B]">
              Our Story <ArrowRight size={15} />
            </Link>
          </Reveal>

          <div className="relative min-h-[510px]">
            <Reveal className="absolute right-0 top-0 z-10 w-[78%] overflow-hidden rounded-2xl sm:w-[68%]">
              <img src={heroImage} alt="Volleyball action" className="h-[430px] w-full object-cover" />
            </Reveal>
            <Reveal delay={.12} className="absolute bottom-0 left-0 z-20 w-[55%] overflow-hidden rounded-2xl border-8 border-[#F5F7FA] sm:w-[48%]">
              <img src={courtImage} alt="Volleyball court" className="h-[260px] w-full object-cover" />
            </Reveal>
            <div className="absolute right-[4%] top-[14%] z-30 hidden -rotate-6 sm:block">
              <span className="display text-7xl text-[#FFC928] drop-shadow-sm">ONE</span>
              <br />
              <span className="display text-7xl text-[#071A2B]">TEAM</span>
            </div>
          </div>
        </div>
      </section>

      {/* COURT PARALLAX */}
      <section ref={courtRef} className="relative h-[115vh] overflow-hidden bg-[#071A2B]">
        <motion.div style={{ scale: courtScale, x: courtX, backgroundImage: `linear-gradient(90deg, rgba(7,26,43,.7), rgba(7,26,43,.08)), url(${courtImage})` }} className="absolute inset-0 bg-cover bg-center will-change-transform" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(7,26,43,.7)_100%)]" />
        <div className="container-site relative z-10 flex h-full flex-col justify-center">
          <Reveal>
            <SectionMarker number="02" label="Where passion meets practice" light />
            <h2 className="display max-w-4xl text-7xl leading-[.8] text-white sm:text-[9rem]">OUR<br /><span className="text-[#FFC928]">COURT</span></h2>
            <div className="mt-8 flex max-w-md items-center gap-3 text-sm text-white/70"><MapPin size={17} className="text-[#FFC928]" /> AIT Volleyball Court · Pune</div>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/55">The place where every serve starts, every block gets tested and every team grows together.</p>
          </Reveal>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-[.3em] text-white/35">Keep scrolling</div>
      </section>

      {/* JOURNEY - HORIZONTAL FEEL */}
      {/* JOURNEY */}
<section className="relative overflow-hidden bg-[#F5F7FA] py-28 sm:py-36">
  <div className="container-site">

    {/* Heading */}
    <Reveal>
      <SectionMarker
        number="03"
        label="Milestones that made us stronger"
      />

      <div className="max-w-3xl">
        <h2 className="display text-7xl leading-[.82] text-[#071A2B] sm:text-[9rem]">
          OUR
          <br />
          <span className="text-[#FFC928]">JOURNEY</span>
        </h2>

        <p className="mt-7 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
          From building a new team to competing beyond campus,
          every season has added another chapter to the AIT Volleyball story.
        </p>
      </div>
    </Reveal>

    {/* Timeline */}
    <div className="relative mt-20">

      {/* Vertical timeline line */}
      <div className="absolute left-[15px] top-0 h-full w-px bg-slate-300 sm:left-1/2 sm:-translate-x-1/2" />

      <div className="space-y-14 sm:space-y-20">
        {journey.map((item, i) => (
          <Reveal
            key={`${item.year}-${item.title}`}
            delay={i * 0.05}
          >
            <div
              className={`relative grid items-center gap-8 sm:grid-cols-2 sm:gap-16 ${
                i % 2 === 0 ? "" : "sm:[&>div:first-child]:order-2"
              }`}
            >

              {/* Content */}
              <div
                className={`pl-12 sm:pl-0 ${
                  i % 2 === 0
                    ? "sm:pr-14 sm:text-right"
                    : "sm:pl-14"
                }`}
              >
                {/* Year */}
                <p className="display text-5xl leading-none text-[#071A2B] sm:text-6xl">
                  {item.year}
                </p>

                {/* Title */}
                <h3 className="mt-3 text-xl font-extrabold text-[#071A2B] sm:text-2xl">
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className={`mt-3 max-w-lg text-sm leading-7 text-slate-500 ${
                    i % 2 === 0 ? "sm:ml-auto" : ""
                  }`}
                >
                  {item.text}
                </p>
              </div>

              {/* Timeline Dot */}
              <div
                className={`absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-[#F5F7FA] bg-[#FFC928] shadow-[0_0_0_1px_rgba(7,26,43,.15)] sm:left-1/2 sm:-translate-x-1/2`}
              >
                <span className="h-2 w-2 rounded-full bg-[#071A2B]" />
              </div>

              {/* Empty opposite side */}
              <div className="hidden sm:block" />

            </div>
          </Reveal>
        ))}
      </div>
    </div>

    {/* Bottom CTA */}
    <Reveal delay={0.2}>
      <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-slate-200 pt-8 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FFC928]">
            The story continues
          </p>

          <p className="mt-2 text-sm text-slate-500">
            More matches. More memories. More chapters ahead.
          </p>
        </div>

        <Link
          to="/journey"
          className="inline-flex items-center gap-3 bg-[#071A2B] px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:-translate-y-1 hover:bg-[#FFC928] hover:text-[#071A2B]"
        >
          Full Timeline
          <ArrowRight size={16} />
        </Link>
      </div>
    </Reveal>

  </div>
</section>

      {/* PLAYERS */}
      <section className="bg-[#071A2B] py-28 sm:py-36">
        <div className="container-site">
          <Reveal><SectionMarker number="04" label="Different roles. One team." light /></Reveal>
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <Reveal><h2 className="display text-7xl leading-[.82] text-white sm:text-[8rem]">MEET THE<br /><span className="text-[#FFC928]">TEAM</span></h2></Reveal>
            <Link to="/players" className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white hover:text-[#FFC928]">All Players <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {players.slice(0, 3).map((player, i) => (
              <Reveal key={player.id} delay={i * .1}>
                <div className="group relative overflow-hidden rounded-2xl bg-[#0D2A43]">
                  <img src={player.image} alt={player.name} className="h-[460px] w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B] via-transparent to-transparent" />
                  <div className="absolute right-5 top-4 display text-7xl text-white/70">#{player.number}</div>
                  <div className="absolute bottom-6 left-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#FFC928]">{player.position}</p>
                    <h3 className="mt-1 text-2xl font-extrabold text-white">{player.name}</h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="bg-[#FFC928] py-24 sm:py-32">
  <div className="container-site">
    <Reveal>
      <SectionMarker
        number="05"
        label="Tournaments. Matches. Moments."
      />
    </Reveal>

    <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
      
      {/* LEFT */}
      <div>
        <h2 className="display text-7xl leading-[.8] text-[#071A2B] sm:text-[8rem]">
          NEXT
          <br />
          <span className="text-white">UP.</span>
        </h2>

        <p className="mt-7 max-w-sm text-sm leading-7 text-[#071A2B]/65">
          Follow the competitions and events that keep the team moving.
        </p>

        <Link
          to="/events"
          className="mt-8 inline-flex items-center gap-3 bg-[#071A2B] px-6 py-4 text-xs font-black uppercase tracking-widest text-white"
        >
          All Events
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* RIGHT */}
      <div className="space-y-3">

        {eventsLoading ? (
          <div className="bg-white p-6 text-sm font-bold text-[#071A2B]">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white p-6 text-sm font-bold text-[#071A2B]">
            No upcoming events.
          </div>
        ) : (
          events.slice(0, 4).map((event, i) => (
            <Reveal
              key={event.eventId}
              delay={i * 0.08}
            >
              <Link
                to="/events"
                className="group grid gap-4 bg-white p-5 transition hover:translate-x-2 sm:grid-cols-[90px_1fr_auto] sm:items-center"
              >

                {/* DATE */}
                <div className="bg-[#071A2B] p-3 text-center text-white">
                  <div className="display text-4xl">
                    {event.day}
                  </div>

                  <div className="text-[10px] font-black">
                    {event.month}
                  </div>
                </div>

                {/* EVENT INFO */}
                <div>
                  <div className="flex items-center gap-2">
                    {event.status === "Live" && (
                      <span className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest text-red-500">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                        Live
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-[#071A2B]">
                    {event.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {event.location || event.venue}
                  </p>
                </div>

                {/* ARROW */}
                <ArrowRight
                  className="text-[#071A2B] transition group-hover:translate-x-2"
                  size={20}
                />

              </Link>
            </Reveal>
          ))
        )}

      </div>
    </div>
  </div>
</section>

      {/* MEMORIES LAYERED */}
      <section ref={memoryRef} className="relative min-h-[120vh] overflow-hidden bg-white py-28 sm:py-36">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <Reveal><SectionMarker number="06" label="Moments that stay forever" /></Reveal>
            <Link to="/memories" className="text-xs font-black uppercase tracking-widest text-[#071A2B] hover:text-[#FFC928]">View All Memories →</Link>
          </div>
          <motion.div style={{ y: memoryY, rotate: memoryRotate }} className="relative mx-auto mt-10 h-[650px] max-w-6xl will-change-transform">
            {memories.slice(0, 5).map((memory, i) => {
              const positions = [
                "left-[4%] top-[12%] w-[42%] h-[52%]",
                "right-[4%] top-[2%] w-[32%] h-[42%]",
                "left-[18%] bottom-[2%] w-[31%] h-[38%]",
                "right-[19%] bottom-[8%] w-[37%] h-[45%]",
                "left-[39%] top-[24%] w-[25%] h-[37%]",
              ];
              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, scale: .9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: .7, delay: i * .08 }}
                  className={`absolute overflow-hidden rounded-xl border-[6px] border-white shadow-2xl ${positions[i]}`}
                >
                  <img src={memory.image} alt={memory.title} className="h-full w-full object-cover" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FINAL CINEMATIC */}
      <section ref={finalRef} className="relative h-[120vh] overflow-hidden bg-[#071A2B]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,201,40,.10),transparent_35%)]" />
        <motion.div style={{ x: finalBallX, y: finalBallY, rotate: finalBallRotate }} className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 will-change-transform">
          <Ball />
        </motion.div>
        <motion.div style={{ scale: finalTextScale, opacity: finalTextOpacity }} className="container-site absolute inset-0 z-10 flex items-center justify-center text-center">
          <div>
            <p className="mb-5 text-[10px] font-black uppercase tracking-[.35em] text-[#FFC928]">Same court. Same dream.</p>
            <h2 className="display text-7xl leading-[.76] text-white sm:text-[10rem]">SAME TEAM.<br /><span className="text-[#FFC928]">SAME DREAM.</span></h2>
            <p className="mx-auto mt-8 max-w-lg text-sm leading-7 text-white/45">The next chapter is waiting. Step onto the court.</p>
          </div>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-[9px] font-black uppercase tracking-[.3em] text-white/30">The journey continues</div>
      </section>
    </div>
  );
}
