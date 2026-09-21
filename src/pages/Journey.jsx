import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { journey } from "../data/journey";

export default function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 25%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <>
      <PageHero eyebrow="Milestones. Memories. A stronger tomorrow." title="Our Journey" subtitle="A timeline of the people, matches and moments that shaped AIT Volleyball." image="https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=2200&q=85" />
      <section ref={ref} className="bg-[#071A2B] py-24 sm:py-36">
        <div className="container-site max-w-6xl">
          <div className="relative">
            <div className="absolute bottom-0 left-4 top-0 w-px bg-white/10 sm:left-1/2 sm:-translate-x-1/2" />
            <motion.div style={{ scaleY: progress }} className="absolute left-4 top-0 h-full w-px origin-top bg-[#FFC928] sm:left-1/2 sm:-translate-x-1/2" />
            <div className="space-y-20 sm:space-y-28">
              {journey.map((item, i) => (
                <Reveal key={item.year}>
                  <div className="relative grid gap-8 sm:grid-cols-2">
                    <div className={`${i % 2 ? "sm:col-start-2" : "sm:col-start-1 sm:text-right"} pl-12 sm:pl-0 ${i % 2 ? "" : "sm:pr-14"}`}>
                      <span className="display text-7xl text-[#FFC928]">{item.year}</span>
                      <h2 className="mt-2 text-2xl font-extrabold text-white">{item.title}</h2>
                      <p className="mt-4 leading-7 text-white/45">{item.text}</p>
                    </div>
                    <motion.div whileInView={{ scale: [0.5, 1.2, 1] }} viewport={{ once: true }} className="absolute left-0 top-2 grid h-9 w-9 place-items-center rounded-full border-4 border-[#071A2B] bg-[#FFC928] sm:left-1/2 sm:-translate-x-1/2">
                      <span className="h-2 w-2 rounded-full bg-[#071A2B]" />
                    </motion.div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#FFC928] py-24 text-center">
        <div className="container-site">
          <p className="text-xs font-black uppercase tracking-[.3em] text-[#071A2B]/55">The story continues</p>
          <h2 className="display mt-4 text-7xl leading-none text-[#071A2B] sm:text-[9rem]">NEXT CHAPTER.</h2>
        </div>
      </section>
    </>
  );
}
