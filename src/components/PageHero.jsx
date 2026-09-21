import { motion } from "framer-motion";

export default function PageHero({ eyebrow, title, subtitle, image }) {
  return (
    <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-[#071A2B]">
      <motion.div initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease: [0.22,1,0.36,1] }} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(90deg, rgba(7,26,43,.96) 0%, rgba(7,26,43,.72) 48%, rgba(7,26,43,.22) 100%), url(${image})` }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(255,201,40,.12),transparent_25%)]" />
      <div className="container-site relative z-10 pb-20 pt-36">
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }} className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-[#FFC928]">{eyebrow}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 45 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .34, duration: .7 }} className="display max-w-4xl text-7xl leading-[.82] text-white sm:text-8xl">{title}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }} className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg">{subtitle}</motion.p>
      </div>
    </section>
  );
}
