import { Instagram, Youtube, Linkedin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#071A2B] text-white">
      <div className="container-site grid gap-12 py-16 md:grid-cols-3">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20">🏐</span>
            <span className="font-extrabold tracking-[0.16em]">AIT VOLLEYBALL</span>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/55">
            Play today. Lead tomorrow. A community built around teamwork, discipline and the love of volleyball.
          </p>
        </div>

        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#FFC928]">Quick Links</p>
          <div className="grid grid-cols-2 gap-y-4 text-sm text-white/65">
            {["Players", "Events", "Journey", "Memories", "Contact"].map((item) => (
              <Link key={item} to={`/${item.toLowerCase()}`} className="transition hover:text-white">
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#FFC928]">Follow The Team</p>
          <div className="flex gap-3">
            {[Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="grid h-11 w-11 place-items-center border border-white/15 transition hover:border-[#FFC928] hover:text-[#FFC928]">
                <Icon size={17} />
              </a>
            ))}
          </div>
          <Link to="/contact" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#FFC928]">
            Contact the team <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-5 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} AIT Volleyball. All rights reserved.</span>
          <span>#AITVolleyball</span>
        </div>
      </div>
    </footer>
  );
}