import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";

const links = [
  ["Home", "/"],
  ["Players", "/players"],
  ["Events", "/events"],
  ["Journey", "/journey"],
  ["Memories", "/memories"],
  ["Contact", "/contact"],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[90] transition-all duration-300 ${scrolled ? "bg-[#071A2B]/95 shadow-xl backdrop-blur-md" : "bg-[#071A2B]/45 backdrop-blur-sm"}`}>
        <div className="container-site flex h-20 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 text-white">
            <motion.div
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.2 }}
  className="flex h-11 items-center"
>
  <img
    src="/images/logo/ait-volleyball-logo.jpeg"
    alt="AIT Volleyball"
    className="h-11 w-auto rounded-2xl object-contain"
  />
</motion.div>
            <span className="text-sm font-extrabold tracking-[0.16em]">AIT VOLLEYBALL</span>
          </NavLink>

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map(([label, path]) => (
              <NavLink key={path} to={path} className="relative py-2 text-xs font-bold uppercase tracking-wider">
                {({ isActive }) => (
                  <>
                    <span className={isActive ? "text-[#FFC928]" : "text-white/75 hover:text-white"}>{label}</span>
                    {isActive && <motion.span layoutId="nav-active" className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#FFC928]" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <NavLink to="/contact" className="hidden items-center gap-2 rounded-md bg-[#FFC928] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#071A2B] transition hover:-translate-y-0.5 hover:bg-white lg:flex">
            Join Us <ArrowUpRight size={15} />
          </NavLink>

          <button onClick={() => setOpen(!open)} className="relative z-[100] grid h-11 w-11 place-items-center rounded-md border border-white/20 text-white lg:hidden" aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: .55, ease: [0.76,0,0.24,1] }} className="fixed inset-0 z-[80] flex flex-col bg-[#071A2B] lg:hidden">
            <div className="container-site flex flex-1 flex-col justify-center">
              <p className="mb-8 text-[10px] font-black uppercase tracking-[.35em] text-[#FFC928]">AIT / Volleyball</p>
              <nav className="flex flex-col">
                {links.map(([label, path], i) => (
                  <motion.div key={path} initial={{ x: -35, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * .07 }}>
                    <NavLink to={path} className="display block border-b border-white/10 py-4 text-5xl text-white hover:text-[#FFC928]">{label}</NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-10 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40">Play · Train · Compete · Belong</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
