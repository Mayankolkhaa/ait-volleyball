import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = previous;
    }, 3200);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-hidden bg-[#061521]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Court atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(255,201,40,.16),transparent_28%),radial-gradient(circle_at_20%_75%,rgba(20,120,180,.18),transparent_32%)]" />
          <div className="intro-grid absolute inset-0 opacity-20" />
          <div className="absolute bottom-[-25vh] left-1/2 h-[55vh] w-[120vw] -translate-x-1/2 rounded-[50%] border border-white/10" />
          <div className="absolute bottom-[18%] left-0 right-0 h-px bg-white/10" />

          {/* Net */}
          <div className="intro-net absolute bottom-[18%] left-1/2 h-[22%] w-[1px] bg-white/30" />
          <div className="intro-net-line absolute bottom-[39.5%] left-0 right-0 h-px bg-white/25" />

          {/* Spiking ball */}
          <motion.div
            className="volleyball-intro absolute left-[10%] top-[16%] h-20 w-20 rounded-full border-[3px] border-white/90 bg-[#FFC928] shadow-[0_0_60px_rgba(255,201,40,.45)] sm:h-24 sm:w-24"
            initial={{ x: 0, y: 0, rotate: 0, scale: 0.55 }}
            animate={{
              x: ["0vw", "23vw", "47vw", "68vw", "84vw"],
              y: ["0vh", "13vh", "39vh", "20vh", "69vh"],
              rotate: [0, 130, 280, 470, 720],
              scale: [0.55, 0.8, 1, 0.9, 0.55],
            }}
            transition={{
              duration: 2.15,
              times: [0, 0.22, 0.48, 0.72, 1],
              ease: "easeInOut",
            }}
          >
            <span className="absolute inset-[14%] rounded-full border-2 border-[#071A2B]/70" />
            <span className="absolute left-[18%] top-[40%] h-1/2 w-[110%] -rotate-[38deg] rounded-full border-t-2 border-[#071A2B]/70" />
            <span className="absolute left-[35%] top-[-5%] h-[110%] w-1/2 rotate-[48deg] rounded-full border-r-2 border-[#071A2B]/70" />
          </motion.div>

          {/* Impact flash */}
          <motion.div
            className="absolute left-[78%] top-[66%] h-20 w-20 rounded-full bg-[#FFC928]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0, 0, 0.9, 0], scale: [0, 0, 0, 4, 9] }}
            transition={{ duration: 2.35, times: [0, .65, .72, .82, 1] }}
          />

          {/* Branding */}
          <div className="absolute inset-x-0 bottom-[7%] z-10 text-center">
            <motion.p
              className="mb-3 text-[10px] font-black uppercase tracking-[0.5em] text-[#FFC928]"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: [0, 1, 1], y: [15, 0, 0] }}
              transition={{ duration: 1, delay: 0.55 }}
            >
              Play · Train · Compete · Belong
            </motion.p>
            <motion.h1
              className="display text-7xl leading-none text-white sm:text-9xl"
              initial={{ opacity: 0, y: 35, skewX: -8 }}
              animate={{ opacity: [0, 1, 1], y: [35, 0, 0], skewX: [-8, 0, 0] }}
              transition={{ duration: 0.9, delay: 0.35 }}
            >
              AIT <span className="text-[#FFC928]">VOLLEYBALL</span>
            </motion.h1>
            <motion.div
              className="mx-auto mt-5 h-1 bg-[#FFC928]"
              initial={{ width: 0 }}
              animate={{ width: "76px" }}
              transition={{ duration: 0.5, delay: 1.05 }}
            />
          </div>

          <motion.div
            className="absolute right-6 top-6 text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 sm:right-10 sm:top-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            AIT / VOLLEYBALL / 01
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
