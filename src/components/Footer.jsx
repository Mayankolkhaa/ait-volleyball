import {
  Instagram,
  Youtube,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/aitvolleyball/",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: "#",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/ait-volley/",
    },
  ];

  return (
    <footer className="bg-[#071A2B] text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-3">

        {/* BRAND */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#071A2B] p-1">
              <img
                src="/images/logo/ait-volleyball-logo.png"
                alt="AIT Volleyball"
                className="h-full w-full object-contain"
              />
            </div>

            <span className="font-extrabold tracking-[0.16em]">
              AIT VOLLEYBALL
            </span>
          </div>

          <p className="max-w-sm text-sm leading-7 text-white/55">
            Play today. Lead tomorrow. A community built around teamwork,
            discipline and the love of volleyball.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#FFC928]">
            Quick Links
          </p>

          <div className="grid grid-cols-2 gap-y-4 text-sm text-white/65">
            {[
              "Players",
              "Events",
              "Journey",
              "Memories",
              "Contact",
            ].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="transition hover:text-white"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        {/* SOCIALS */}
        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#FFC928]">
            Follow The Team
          </p>

          <div className="flex gap-3">
            {socialLinks.map(({ name, icon: Icon, href }) => {
              const isAvailable = href !== "#";

              return (
                <a
                  key={name}
                  href={href}
                  target={isAvailable ? "_blank" : undefined}
                  rel={isAvailable ? "noopener noreferrer" : undefined}
                  aria-label={name}
                  title={isAvailable ? `Visit ${name}` : `${name} link coming soon`}
                  onClick={(e) => {
                    if (!isAvailable) e.preventDefault();
                  }}
                  className={`grid h-11 w-11 place-items-center border border-white/15 transition ${
                    isAvailable
                      ? "hover:border-[#FFC928] hover:text-[#FFC928]"
                      : "cursor-not-allowed opacity-40"
                  }`}
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>

          <Link
            to="/contact"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white transition hover:text-[#FFC928]"
          >
            Contact the team
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} AIT Volleyball. All rights reserved.
          </span>

          <span>#AITVolleyball made with love</span>
        </div>
      </div>
    </footer>
  );
}