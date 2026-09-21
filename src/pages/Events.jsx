import { useMemo, useState } from "react";
import { MapPin, CalendarDays, Clock3 } from "lucide-react";
import { motion } from "framer-motion";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { events } from "../data/events";

const tabs = ["Upcoming", "Past", "All"];

export default function Events() {
  const [tab, setTab] = useState("Upcoming");

  const visible = useMemo(() => {
    if (tab === "All") return events;

    return events.filter((event) => event.status === tab);
  }, [tab]);

  return (
    <>
      <PageHero
        eyebrow="Tournaments. Matches. Moments."
        title="Events"
        subtitle="Follow the competitions, matches and activities that shape the AIT Volleyball season."
        image="https://images.unsplash.com/photo-1530137073521-4d2e5f5b4b9a?auto=format&fit=crop&w=2200&q=85"
      />

      <section className="bg-[#F5F7FA] py-20 sm:py-28">
        <div className="container-site">

          {/* FILTERS */}
          <div className="mb-12 flex flex-wrap gap-2">
            {tabs.map((tabName) => (
              <button
                key={tabName}
                onClick={() => setTab(tabName)}
                className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition ${
                  tab === tabName
                    ? "bg-[#FFC928] text-[#071A2B]"
                    : "bg-white text-slate-500 hover:text-[#071A2B]"
                }`}
              >
                {tabName}
              </button>
            ))}
          </div>

          {/* EVENTS */}
          <div className="space-y-4">
            {visible.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.06}>
                <motion.article
                  whileHover={{ x: 5 }}
                  className="group grid gap-6 rounded-2xl bg-white p-5 transition-shadow hover:shadow-md sm:grid-cols-[105px_1fr] sm:items-center sm:p-7"
                >

                  {/* DATE */}
                  <div className="bg-[#071A2B] p-4 text-center text-white">
                    <div className="display text-5xl">
                      {event.day}
                    </div>

                    <div className="text-[10px] font-black">
                      {event.month} {event.year}
                    </div>
                  </div>

                  {/* EVENT INFO */}
                  <div>
                    <div className="mb-3 flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-widest">

                      <span
                        className={
                          event.status === "Upcoming"
                            ? "text-[#071A2B]"
                            : "text-slate-400"
                        }
                      >
                        <CalendarDays
                          className="mr-1 inline"
                          size={12}
                        />

                        {event.status}
                      </span>

                      <span className="text-slate-400">
                        <Clock3
                          className="mr-1 inline"
                          size={12}
                        />

                        Season {event.year}
                      </span>

                    </div>

                    <h2 className="text-xl font-extrabold text-[#071A2B] sm:text-2xl">
                      {event.title}
                    </h2>

                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={14} />
                      {event.location}
                    </p>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                      {event.description}
                    </p>
                  </div>

                </motion.article>
              </Reveal>
            ))}
          </div>

          {/* NO EVENTS */}
          {visible.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-sm font-semibold text-slate-400">
                No {tab.toLowerCase()} events available.
              </p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}