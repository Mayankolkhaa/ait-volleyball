import { motion } from "framer-motion";
import {
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";

export default function Contact() {
  const socials = [
    {
      name: "Instagram",
      handle: "@aitvolleyball",
      href: "https://www.instagram.com/aitvolleyball/",
      icon: Instagram,
    },
    {
      name: "LinkedIn",
      handle: "ait-volley",
      href: "https://www.linkedin.com/in/ait-volley/",
      icon: Linkedin,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Stay Connected"
        title="Contact Us"
        subtitle="Connect with AIT Volleyball for matches, collaborations, events and team updates."
        image="https://images.unsplash.com/photo-1530137073521-4d2e5f5b4b9a?auto=format&fit=crop&w=2200&q=85"
      />

      <section className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="container-site">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">

            {/* Left Side */}
            <Reveal>
              <div className="rounded-2xl bg-[#071A2B] p-8 text-white sm:p-10">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#FFC928]">
                  AIT Volleyball
                </p>

                <h2 className="display text-5xl leading-none sm:text-6xl">
                  LET'S CONNECT.
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
                  Whether you're a player, supporter, college team, organizer,
                  or simply passionate about volleyball — we'd love to hear
                  from you.
                </p>

                <div className="mt-10 space-y-5">

                  {/* Email */}
                  <a
                    href="mailto:itsmrolkha@gmail.com"
                    className="group flex items-center gap-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-[#FFC928] group-hover:text-[#071A2B]">
                      <Mail size={18} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Email
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        itsmrolkha@gmail.com
                      </p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:7410901181"
                    className="group flex items-center gap-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition group-hover:bg-[#FFC928] group-hover:text-[#071A2B]">
                      <Phone size={18} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Phone
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        +91 74109 01181
                      </p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Location
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        AIT Pune, Dighi
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </Reveal>

            {/* Right Side */}
            <div className="grid gap-5 sm:grid-cols-2">

              {socials.map((social, index) => {
                const Icon = social.icon;

                return (
                  <Reveal key={social.name} delay={index * 0.08}>
                    <motion.a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -5 }}
                      className="group flex min-h-[220px] flex-col justify-between rounded-2xl bg-white p-7 shadow-sm transition-shadow hover:shadow-xl"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071A2B] text-white transition-colors group-hover:bg-[#FFC928] group-hover:text-[#071A2B]">
                          <Icon size={21} />
                        </div>

                        <ArrowUpRight
                          size={20}
                          className="text-slate-300 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#071A2B]"
                        />
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                          {social.name}
                        </p>

                        <h3 className="mt-2 text-xl font-extrabold text-[#071A2B]">
                          {social.handle}
                        </h3>
                      </div>
                    </motion.a>
                  </Reveal>
                );
              })}

              {/* Email Card */}
              <Reveal delay={0.16}>
                <motion.a
                  href="mailto:itsmrolkha@gmail.com"
                  whileHover={{ y: -5 }}
                  className="group flex min-h-[220px] flex-col justify-between rounded-2xl bg-[#fcfbf8] p-7 shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071A2B] text-white">
                      <Mail size={21} />
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="text-[#071A2B]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#071A2B]/60">
                      Email Us
                    </p>

                    <h3 className="mt-2 break-all text-lg font-extrabold text-[#071A2B]">
                      itsmrolkha@gmail.com
                    </h3>
                  </div>
                </motion.a>
              </Reveal>

              {/* Phone Card */}
              <Reveal delay={0.24}>
                <motion.a
                  href="tel:7410901181"
                  whileHover={{ y: -5 }}
                  className="group flex min-h-[220px] flex-col justify-between rounded-2xl bg-white p-7 shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071A2B] text-white transition-colors group-hover:bg-[#FFC928] group-hover:text-[#071A2B]">
                      <Phone size={21} />
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="text-slate-300 group-hover:text-[#071A2B]"
                    />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Call Us
                    </p>

                    <h3 className="mt-2 text-xl font-extrabold text-[#071A2B]">
                      +91 74109 01181
                    </h3>
                  </div>
                </motion.a>
              </Reveal>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}