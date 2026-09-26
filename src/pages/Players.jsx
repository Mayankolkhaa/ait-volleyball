import { useMemo, useState } from "react";
import {
  Instagram,
  Linkedin,
  Search,
  RotateCcw,
  Shirt,
  CalendarDays,
  Ruler,
  Zap,
  Trophy,
  Sparkles,
  Heart,
  Quote,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { players } from "../data/players";

const filters = ["All", "Setter", "Spiker", "Blocker", "Libero"];

/* =========================================================
   PLAYER CARD
========================================================= */

function PlayerCard({ player }) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (flipped) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width - 0.5) * 2;

    const y =
      ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    setTilt({
      x: y * -4,
      y: x * 4,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const toggleFlip = () => {
    setFlipped((current) => !current);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      className="group h-[560px] w-full [perspective:1600px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
        onClick={toggleFlip}
        animate={{
          rotateY: flipped ? 180 : 0,
          rotateX: flipped ? 0 : tilt.x,
          rotateZ: flipped ? 0 : tilt.y,
        }}
        transition={{
          rotateY: {
            duration: 0.85,
            ease: [0.16, 1, 0.3, 1],
          },
          rotateX: {
            duration: 0.2,
          },
          rotateZ: {
            duration: 0.2,
          },
        }}
      >

        {/* =====================================================
            FRONT
        ====================================================== */}

        <div
          className="
            absolute inset-0
            overflow-hidden
            rounded-2xl
            border border-white/10
            bg-[#071A2B]
            shadow-[0_25px_70px_rgba(0,0,0,.28)]
            [backface-visibility:hidden]
          "
        >
          {/* IMAGE */}

          {player.image ? (
            <img
              src={player.image}
              alt={player.name}
              className="
                absolute inset-0
                h-full w-full
                object-cover
                transition duration-700
                group-hover:scale-105
              "
            />
          ) : (
            <div className="
              absolute inset-0
              flex items-center justify-center
              bg-[#0D2A43]
            ">
              <span className="display text-[150px] text-white/[0.06]">
                #{player.number}
              </span>
            </div>
          )}

          {/* IMAGE OVERLAY */}

          <div className="
            absolute inset-0
            bg-gradient-to-t
            from-[#071A2B]
            via-[#071A2B]/15
            to-transparent
          " />

          <div className="
            absolute inset-0
            bg-gradient-to-r
            from-[#071A2B]/20
            to-transparent
          " />

          {/* GOLD LIGHT */}

          <motion.div
            className="
              pointer-events-none
              absolute
              -left-[70%]
              top-[-30%]
              h-[160%]
              w-[35%]
              rotate-[18deg]
              bg-gradient-to-r
              from-transparent
              via-[#FFC928]/20
              to-transparent
              blur-2xl
            "
            animate={{
              x: ["0%", "500%"],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
          />

          {/* TOP POSITION */}

          <div className="absolute left-5 top-5 z-10">
            <span className="
              border border-white/20
              bg-[#071A2B]/65
              px-3 py-2
              text-[9px]
              font-black
              uppercase
              tracking-[0.2em]
              text-white
              backdrop-blur-md
            ">
              {player.position}
            </span>
          </div>

          {/* NUMBER */}

          <div className="absolute right-4 top-0 z-10">
            <span className="
              display
              text-[92px]
              leading-none
              text-white/75
              drop-shadow-xl
            ">
              #{player.number}
            </span>
          </div>

          {/* SIDE WORDS */}

          

          {/* QUOTE */}

          {player.quote && (
            <div className="
              absolute
              right-5
              top-[45%]
              z-10
              max-w-[150px]
              rotate-[-5deg]
              hidden
              sm:block
            ">
              <p className="
                font-serif
                text-xl
                italic
                leading-tight
                text-white/80
              ">
                "{player.quote}"
              </p>
            </div>
          )}

          {/* PLAYER INFORMATION */}

          <div className="
            absolute
            bottom-5
            left-5
            right-5
            z-40
          ">
            <p className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.22em]
              text-[#FFC928]
            ">
              {player.role}
            </p>

            <div className="
              mt-1
              flex
              items-end
              justify-between
              gap-3
            ">
              <div>
                <h2 className="
                  text-3xl
                  font-black
                  leading-none
                  text-white
                ">
                  {player.name}
                </h2>

                <p className="
                  mt-2
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/45
                ">
                  #{player.number} · Tap to reveal
                </p>
              </div>
            </div>
          </div>

          {/* FLIP INDICATOR */}

          

          {/* MOBILE FLIP INDICATOR */}

          <div className="
            absolute
            right-5
            top-1/2
            grid
            h-9
            w-9
            -translate-y-1/2
            place-items-center
            rounded-full
            border border-white/20
            bg-black/20
            text-white/60
            backdrop-blur-md
            sm:hidden
          ">
            <RotateCcw size={14} />
          </div>
        </div>

        {/* =====================================================
            BACK
        ====================================================== */}

        <div
          className="
            absolute inset-0
            overflow-hidden
            rounded-2xl
            border border-[#FFC928]/40
            bg-[#061521]
            p-6
            shadow-[0_25px_80px_rgba(0,0,0,.4)]
            [backface-visibility:hidden]
            [transform:rotateY(180deg)]
          "
        >
          {/* BACKGROUND GLOW */}

          <div className="
            pointer-events-none
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-[#FFC928]/10
            blur-3xl
          " />

          <div className="
            pointer-events-none
            absolute
            -bottom-24
            -left-24
            h-72
            w-72
            rounded-full
            bg-[#FFC928]/5
            blur-3xl
          " />

          {/* GIANT NUMBER */}

          <div className="
            pointer-events-none
            absolute
            bottom-[-15px]
            right-0
          ">
            <span className="
              display
              text-[190px]
              leading-none
              text-white/[0.025]
            ">
              {player.number}
            </span>
          </div>

          {/* HEADER */}

          <div className="
            relative
            z-10
            flex
            items-start
            justify-between
          ">
            <div>
              <p className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.28em]
                text-[#FFC928]
              ">
                Player Profile
              </p>

              <h2 className="
                mt-2
                text-3xl
                font-black
                leading-tight
                text-white
              ">
                {player.name}
              </h2>

              <p className="
                mt-1
                text-xs
                font-semibold
                text-white/40
              ">
                #{player.number} · {player.position}
              </p>
            </div>

            <div className="
              grid
              h-11
              w-11
              shrink-0
              place-items-center
              rounded-xl
              bg-[#FFC928]
              text-[#071A2B]
              shadow-[0_0_30px_rgba(255,201,40,.25)]
            ">
              <Sparkles size={18} />
            </div>
          </div>

          {/* QUOTE */}

          {player.quote && (
            <div className="
              relative
              z-10
              mt-5
              rounded-xl
              border
              border-[#FFC928]/20
              bg-[#FFC928]/[0.04]
              p-3
            ">
              <div className="flex gap-3">
                <Quote
                  size={17}
                  className="mt-0.5 shrink-0 text-[#FFC928]"
                />

                <p className="
                  text-xs
                  italic
                  leading-5
                  text-white/60
                ">
                  "{player.quote}"
                </p>
              </div>
            </div>
          )}

          {/* STATS */}

          <div className="
            relative
            z-10
            mt-5
            grid
            grid-cols-2
            gap-2
          ">
            <PlayerStat
              icon={Shirt}
              label="Jersey"
              value={player.jerseyName || player.name}
            />

            <PlayerStat
              icon={CalendarDays}
              label="Age"
              value={player.age || "—"}
            />

            <PlayerStat
              icon={Ruler}
              label="Height"
              value={player.height || "—"}
            />

            <PlayerStat
              icon={Zap}
              label="Jump"
              value={player.verticalJump || "—"}
            />

            <PlayerStat
              icon={Trophy}
              label="Spike Reach"
              value={player.spikeReach || "—"}
            />

            <PlayerStat
              icon={Sparkles}
              label="Role"
              value={player.role || "—"}
            />
          </div>

          {/* FUN FACTS */}

          {player.funFacts?.length > 0 && (
            <div className="relative z-10 mt-5">
              <div className="
                mb-2
                flex
                items-center
                gap-2
              ">
                <Heart
                  size={13}
                  fill="currentColor"
                  className="text-[#FFC928]"
                />

                <p className="
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-[#FFC928]
                ">
                  More Than A Player
                </p>
              </div>

              <div className="grid gap-1.5">
                {player.funFacts
                  .slice(0, 3)
                  .map((fact, index) => (
                    <motion.div
                      key={fact}
                      initial={{
                        opacity: 0,
                        x: -12,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay:
                          0.15 + index * 0.08,
                      }}
                      className="
                        rounded-lg
                        border
                        border-white/[0.08]
                        bg-white/[0.035]
                        px-3
                        py-2
                        text-[10px]
                        leading-4
                        text-white/60
                      "
                    >
                      <span className="mr-2 text-[#FFC928]">
                        {["♥", "✦", "→"][index]}
                      </span>

                      {fact}
                    </motion.div>
                  ))}
              </div>
            </div>
          )}

          {/* SWEET THING */}

          {player.sweetThing && (
            <div className="
              relative
              z-10
              mt-3
              rounded-xl
              border
              border-[#FFC928]/20
              bg-[#FFC928]/[0.04]
              p-3
            ">
              <p className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.2em]
                text-[#FFC928]
              ">
                Sweet Thing
              </p>

              <p className="
                mt-1
                text-[10px]
                leading-4
                text-white/55
              ">
                {player.sweetThing}
              </p>
            </div>
          )}

          {/* FLIP BACK */}

          <div className="
            absolute
            bottom-5
            right-6
            flex
            items-center
            gap-2
            text-[8px]
            font-black
            uppercase
            tracking-widest
            text-white/30
          ">
            <RotateCcw size={11} />
            Tap to flip back
          </div>
        </div>
      </motion.div>

      {/* =====================================================
          SOCIAL LINKS
          Outside the 3D motion surface so clicking these
          links never triggers the card flip.
      ====================================================== */}

      {!flipped && (
        <div
          className="
            pointer-events-auto
            absolute
            bottom-5
            right-5
            z-[200]
            flex
            gap-2
          "
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {player.instagram && (
            <a
              href={player.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${player.name} Instagram`}
              onClick={(e) => e.stopPropagation()}
              className="
                relative
                z-[201]
                grid
                h-10
                w-10
                cursor-pointer
                place-items-center
                rounded-lg
                border
                border-white/25
                bg-black/40
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#FFC928]
                hover:bg-[#FFC928]
                hover:text-[#071A2B]
              "
            >
              <Instagram
                size={17}
                className="pointer-events-none"
              />
            </a>
          )}

          {player.linkedin && (
            <a
              href={player.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${player.name} LinkedIn`}
              onClick={(e) => e.stopPropagation()}
              className="
                relative
                z-[201]
                grid
                h-10
                w-10
                cursor-pointer
                place-items-center
                rounded-lg
                border
                border-white/25
                bg-black/40
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#FFC928]
                hover:bg-[#FFC928]
                hover:text-[#071A2B]
              "
            >
              <Linkedin
                size={17}
                className="pointer-events-none"
              />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PLAYER STAT
========================================================= */

function PlayerStat({ icon: Icon, label, value }) {
  return (
    <div className="
      rounded-xl
      border
      border-white/[0.08]
      bg-white/[0.035]
      p-3
      transition
      hover:border-[#FFC928]/30
    ">
      <div className="flex items-center gap-1.5">
        <Icon
          size={13}
          className="text-[#FFC928]"
        />

        <span className="
          text-[7px]
          font-black
          uppercase
          tracking-[0.16em]
          text-white/30
        ">
          {label}
        </span>
      </div>

      <p className="
        mt-1.5
        truncate
        text-xs
        font-bold
        text-white
      ">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   MAIN PLAYERS PAGE
========================================================= */

export default function Players() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.toLowerCase().trim();

    return players.filter((player) => {
      const matchesFilter =
        filter === "All" ||
        player.role === filter;

      const matchesSearch =
        !q ||
        `${player.name} ${player.position} ${player.role}`
          .toLowerCase()
          .includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [filter, query]);

  return (
    <>
      {/* =====================================================
          PAGE HERO
      ====================================================== */}

      <PageHero
        eyebrow="Different roles. One team."
        title="Our Players"
        subtitle="Meet the people who bring energy, discipline and teamwork to the AIT court."
        image={players[0]?.image}
      />

      {/* =====================================================
          PLAYERS SECTION
      ====================================================== */}

      <section className="
        relative
        overflow-hidden
        bg-[#04121E]
        py-16
        sm:py-24
      ">
        {/* Ambient glow */}

        <div className="
          pointer-events-none
          absolute
          left-1/2
          top-32
          h-[500px]
          w-[500px]
          -translate-x-1/2
          rounded-full
          bg-[#FFC928]/[0.035]
          blur-[130px]
        " />

        {/* Subtle court/grid */}

        <div className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
          [background-size:60px_60px]
        " />

        <div className="
          container-site
          relative
          z-10
        ">

          {/* =================================================
              HEADING
          ================================================== */}

          <div className="mb-12">
            <p className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.3em]
              text-[#FFC928]
            ">
              AIT VOLLEYBALL ROSTER
            </p>

            <h2 className="
              display
              mt-3
              text-6xl
              leading-[0.8]
              text-white
              sm:text-8xl
            ">
              OUR
              <br />
              <span className="text-[#FFC928]">
                PLAYERS
              </span>
            </h2>

            <p className="
              mt-5
              max-w-xl
              text-sm
              leading-6
              text-white/40
            ">
              Different roles. Different personalities.
              One team fighting for every point.
            </p>
          </div>

          {/* =================================================
              FILTERS
          ================================================== */}

          <div className="
            mb-10
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-center
            lg:justify-between
          ">
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`
                    rounded-lg
                    border
                    px-5
                    py-3
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    transition
                    ${
                      filter === item
                        ? "border-[#FFC928] bg-[#FFC928] text-[#071A2B] shadow-[0_0_25px_rgba(255,201,40,.15)]"
                        : "border-white/10 bg-white/[0.025] text-white/45 hover:border-[#FFC928]/40 hover:text-white"
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* SEARCH */}

            <div className="
              flex
              w-full
              max-w-xs
              items-center
              border-b
              border-white/15
              pb-2
            ">
              <Search
                size={16}
                className="mr-3 text-white/30"
              />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search player..."
                className="
                  w-full
                  bg-transparent
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-white/25
                "
              />
            </div>
          </div>

          {/* =================================================
              PLAYER GRID
          ================================================== */}

          <motion.div
            layout
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            <AnimatePresence mode="popLayout">
              {visible.map((player, index) => (
                <motion.div
                  layout
                  key={player.id}
                  initial={{
                    opacity: 0,
                    y: 30,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.94,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.04,
                  }}
                  className={
                    visible.length === 1
                      ? "lg:col-start-2"
                      : ""
                  }
                >
                  <PlayerCard player={player} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {visible.length === 0 && (
            <div className="
              py-24
              text-center
            ">
              <p className="
                text-sm
                font-semibold
                text-white/30
              ">
                No players match this search.
              </p>
            </div>
          )}

          {/* =================================================
              BOTTOM BANNER
          ================================================== */}

          <Reveal className="mt-24">
            <div className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-[#071A2B]
              p-8
              sm:p-12
            ">
              <div className="
                pointer-events-none
                absolute
                right-[-100px]
                top-[-100px]
                h-72
                w-72
                rounded-full
                bg-[#FFC928]/10
                blur-3xl
              " />

              <p className="
                relative
                text-xs
                font-black
                uppercase
                tracking-[0.25em]
                text-[#FFC928]
              ">
                Built together
              </p>

              <h2 className="
                relative
                display
                mt-3
                text-6xl
                leading-[0.8]
                text-white
                sm:text-8xl
              ">
                ONE COURT.
                <br />
                <span className="text-[#FFC928]">
                  ONE TEAM.
                </span>
              </h2>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}