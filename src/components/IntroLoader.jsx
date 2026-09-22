import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const INTRO_TIME = 4400;

function playIntroSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;

    if (ctx.state === "suspended") ctx.resume();

    // Deep arena rumble
    const rumble = ctx.createOscillator();
    const rumbleGain = ctx.createGain();
    rumble.type = "sine";
    rumble.frequency.setValueAtTime(48, now);
    rumble.frequency.exponentialRampToValueAtTime(30, now + 2.8);
    rumbleGain.gain.setValueAtTime(0.0001, now);
    rumbleGain.gain.exponentialRampToValueAtTime(0.12, now + 0.6);
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
    rumble.connect(rumbleGain).connect(ctx.destination);
    rumble.start(now);
    rumble.stop(now + 3.3);

    // Ball/air whoosh
    const whoosh = ctx.createOscillator();
    const whooshGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    whoosh.type = "sawtooth";
    whoosh.frequency.setValueAtTime(100, now + 1.2);
    whoosh.frequency.exponentialRampToValueAtTime(1100, now + 2.55);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(5000, now + 2.5);
    whooshGain.gain.setValueAtTime(0.0001, now + 1.1);
    whooshGain.gain.exponentialRampToValueAtTime(0.055, now + 2.0);
    whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.7);
    whoosh.connect(filter).connect(whooshGain).connect(ctx.destination);
    whoosh.start(now + 1.1);
    whoosh.stop(now + 2.75);

    // Impact
    const impact = ctx.createOscillator();
    const impactGain = ctx.createGain();
    impact.type = "triangle";
    impact.frequency.setValueAtTime(125, now + 2.55);
    impact.frequency.exponentialRampToValueAtTime(32, now + 3.15);
    impactGain.gain.setValueAtTime(0.0001, now + 2.5);
    impactGain.gain.exponentialRampToValueAtTime(0.34, now + 2.58);
    impactGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
    impact.connect(impactGain).connect(ctx.destination);
    impact.start(now + 2.5);
    impact.stop(now + 3.25);

    window.setTimeout(() => ctx.close(), 3600);
  } catch {
    // Audio can be blocked by browser autoplay policy.
  }
}

function VolleyballOrb() {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 z-20"
      initial={{ x: "-50%", y: "-50%", scale: 0.08, rotate: -160, opacity: 0 }}
      animate={{
        x: ["-50%", "-50%", "-50%", "-50%"],
        y: ["-50%", "-90%", "-10%", "-50%"],
        scale: [0.08, 0.38, 1.08, 0.18],
        rotate: [-160, 20, 250, 650],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 3.05,
        times: [0, 0.25, 0.68, 1],
        ease: [0.22, 0.8, 0.25, 1],
      }}
    >
      <div className="relative h-28 w-28 sm:h-40 sm:w-40">
        <div className="absolute left-1/2 top-[84%] h-8 w-24 -translate-x-1/2 rounded-full bg-black/70 blur-xl" />
        <div
          className="relative h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at 29% 22%, #fff 0%, #fff 5%, #ffe99b 14%, #ffc928 32%, #d99d00 68%, #735400 100%)",
            boxShadow:
              "inset -22px -25px 38px rgba(0,0,0,.42), inset 12px 10px 22px rgba(255,255,255,.45), 0 25px 70px rgba(255,201,40,.3)",
          }}
        >
          <span className="absolute inset-[11%] rounded-full border-[3px] border-[#071A2B]/65" />
          <span className="absolute left-[17%] top-[40%] h-[52%] w-[112%] -rotate-[38deg] rounded-full border-t-[3px] border-[#071A2B]/70" />
          <span className="absolute left-[35%] top-[-4%] h-[112%] w-1/2 rotate-[48deg] rounded-full border-r-[3px] border-[#071A2B]/70" />
          <span className="absolute left-[18%] top-[13%] h-[17%] w-[20%] rounded-full bg-white/80 blur-[2px]" />
        </div>
      </div>
    </motion.div>
  );
}

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);
  const soundPlayed = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const startSound = () => {
      if (soundPlayed.current) return;
      soundPlayed.current = true;
      playIntroSound();
    };

    startSound();

    window.addEventListener("pointerdown", startSound, { once: true });
    window.addEventListener("keydown", startSound, { once: true });

    const timer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = previousOverflow;
    }, INTRO_TIME);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", startSound);
      window.removeEventListener("keydown", startSound);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden bg-[#020609]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.025 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Arena image */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero/ait-arena-intro.png')" }}
            initial={{ scale: 1.08, filter: "brightness(.45) saturate(.8)" }}
            animate={{ scale: 1, filter: "brightness(.82) saturate(1)" }}
            transition={{ duration: 3.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Premium dark grade */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_20%,rgba(0,0,0,.42)_72%,rgba(0,0,0,.84)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />

          {/* Camera-like push */}
          <motion.div
            className="absolute inset-[-5%] border border-white/[0.03]"
            initial={{ scale: 1.02 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 4.2, ease: "easeOut" }}
          />

          {/* Light sweep */}
          <motion.div
            className="absolute inset-y-[-30%] left-[-35%] z-10 w-[28%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent blur-2xl"
            initial={{ x: "-20vw" }}
            animate={{ x: "140vw" }}
            transition={{ duration: 2.8, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Falling gold dust */}
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute z-10 h-1 w-1 rounded-full bg-[#FFC928]"
              style={{ left: `${42 + ((i * 17) % 17)}%`, top: `${8 + ((i * 23) % 28)}%` }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: [0, 0.9, 0], y: [0, 70 + i * 8] }}
              transition={{ duration: 1.8, delay: 1.1 + i * 0.07, repeat: 1 }}
            />
          ))}

          <VolleyballOrb />

          {/* Impact */}
          <motion.div
            className="absolute left-1/2 top-[65%] z-20 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FFC928]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0, 1, 0], scale: [0, 0.5, 5, 11] }}
            transition={{ duration: 3.4, times: [0, 0.72, 0.81, 1], ease: "easeOut" }}
          />

          <motion.div
            className="absolute inset-0 z-20 bg-[#FFC928]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0, 0.17, 0] }}
            transition={{ duration: 3.4, times: [0, 0.72, 0.79, 0.83, 1] }}
          />

          {/* Logo reveal */}
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.72, 0.72, 1, 1.04, 1.08] }}
            transition={{
              duration: 2.0,
              delay: 2.25,
              times: [0, 0.25, 0.5, 0.82, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="relative flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">
              <div className="absolute inset-0 rounded-[28px] bg-[#FFC928]/15 blur-2xl" />
              <img
                src="/images/logo/ait-volleyball-logo.png"
                alt="AIT Volleyball"
                className="relative h-full w-full object-contain drop-shadow-[0_0_25px_rgba(255,201,40,.25)]"
              />
            </div>
          </motion.div>

          {/* Wordmark */}
          <motion.div
            className="absolute inset-x-0 bottom-[14%] z-50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -8] }}
            transition={{ duration: 2.2, delay: 2.35, times: [0, 0.25, 0.82, 1] }}
          >
            <p className="text-[8px] font-black uppercase tracking-[0.52em] text-[#FFC928] sm:text-[10px]">
              PLAY · TRAIN · COMPETE · BELONG
            </p>
            <h1 className="display mt-3 text-5xl leading-none text-white sm:text-7xl">
              AIT <span className="text-[#FFC928]">VOLLEYBALL</span>
            </h1>
          </motion.div>

          {/* Minimal HUD */}
          <div className="absolute left-6 top-6 z-50 text-[8px] font-bold uppercase tracking-[0.3em] text-white/35 sm:left-10 sm:top-10">
            AIT / VOLLEYBALL / 01
          </div>

          <div className="absolute bottom-6 right-6 z-50 text-[8px] font-bold uppercase tracking-[0.3em] text-white/35 sm:bottom-10 sm:right-10">
            PUNE · INDIA
          </div>

          <div className="absolute bottom-6 left-1/2 z-50 w-32 -translate-x-1/2 sm:bottom-10 sm:w-44">
            <div className="h-px bg-white/20">
              <motion.div
                className="h-full bg-[#FFC928]"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 4.1, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
