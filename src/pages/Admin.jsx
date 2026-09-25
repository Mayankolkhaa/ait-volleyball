import { useEffect, useMemo, useState } from "react";
import socket from "../services/socket";

const API_URL = import.meta.env.VITE_API_URL;

const emptyEvent = {
  title: "",
  description: "",
  details: "",
  day: "",
  month: "",
  year: "",
  date: "",
  time: "",
  location: "",
  venue: "",
  status: "Upcoming",
  competition: "",
  organizer: "",
  opponent: "",
  round: "",
  format: "Best of 5",
  mvp: "",
  highlights: [],
  image: "",
  featured: false,
};

export default function Admin() {
  // =========================================================
  // MAIN NAVIGATION
  // =========================================================

  const [activeSection, setActiveSection] = useState("events");

  // =========================================================
  // EVENTS
  // =========================================================

  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [eventForm, setEventForm] = useState(emptyEvent);

  const [eventSearch, setEventSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");

  const [eventSaving, setEventSaving] = useState(false);

  const [newHighlight, setNewHighlight] = useState("");

  // =========================================================
  // MATCHES
  // =========================================================

  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // =========================================================
  // FETCH EVENTS
  // =========================================================

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);

      const response = await fetch(
        `${API_URL}/api/events`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch events"
        );
      }

      setEvents(data.events || []);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      alert(error.message);
    } finally {
      setEventsLoading(false);
    }
  };

  // =========================================================
  // FETCH MATCHES
  // =========================================================

  const fetchMatches = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/matches`
      );

      const data = await response.json();

      if (data.success) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error(
        "Failed to fetch matches:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchEvents();
    fetchMatches();
  }, []);

  // =========================================================
  // REAL-TIME SCORE UPDATES
  // =========================================================

  useEffect(() => {
    const handleScoreUpdate = (match) => {
      console.log(
        "ADMIN SCORE UPDATE:",
        match
      );

      setMatches((currentMatches) =>
        currentMatches.map((item) =>
          item.eventId === match.eventId
            ? match
            : item
        )
      );

      setSelectedMatch((currentMatch) =>
        currentMatch?.eventId === match.eventId
          ? match
          : currentMatch
      );
    };

    socket.on(
      "scoreUpdated",
      handleScoreUpdate
    );

    return () => {
      socket.off(
        "scoreUpdated",
        handleScoreUpdate
      );
    };
  }, []);

  // =========================================================
  // EVENT FORM CHANGE
  // =========================================================

  const handleEventChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEventForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =========================================================
  // OPEN CREATE EVENT
  // =========================================================

  const openCreateEvent = () => {
    setEditingEvent(null);
    setEventForm(emptyEvent);
    setNewHighlight("");
    setEventModalOpen(true);
  };

  // =========================================================
  // OPEN EDIT EVENT
  // =========================================================

  const openEditEvent = (event) => {
    setEditingEvent(event);

    setEventForm({
      title: event.title || "",
      description: event.description || "",
      details: event.details || "",
      day: event.day || "",
      month: event.month || "",
      year: event.year || "",
      date: event.date || "",
      time: event.time || "",
      location: event.location || "",
      venue: event.venue || "",
      status: event.status || "Upcoming",
      competition: event.competition || "",
      organizer: event.organizer || "",
      opponent: event.opponent || "",
      round: event.round || "",
      format: event.format || "Best of 5",
      mvp: event.mvp || "",
      highlights: event.highlights || [],
      image: event.image || "",
      featured: event.featured || false,
    });

    setNewHighlight("");
    setEventModalOpen(true);
  };

  // =========================================================
  // CLOSE EVENT MODAL
  // =========================================================

  const closeEventModal = () => {
    if (eventSaving) return;

    setEventModalOpen(false);
    setEditingEvent(null);
    setEventForm(emptyEvent);
    setNewHighlight("");
  };

  // =========================================================
  // ADD HIGHLIGHT
  // =========================================================

  const addHighlight = () => {
    const value = newHighlight.trim();

    if (!value) return;

    setEventForm((current) => ({
      ...current,
      highlights: [
        ...current.highlights,
        value,
      ],
    }));

    setNewHighlight("");
  };

  // =========================================================
  // REMOVE HIGHLIGHT
  // =========================================================

  const removeHighlight = (index) => {
    setEventForm((current) => ({
      ...current,
      highlights:
        current.highlights.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // =========================================================
  // SAVE EVENT
  // =========================================================

  const saveEvent = async (e) => {
    e.preventDefault();

    if (!eventForm.title.trim()) {
      alert("Event title is required.");
      return;
    }

    if (!eventForm.day || !eventForm.month || !eventForm.year) {
      alert("Day, month and year are required.");
      return;
    }

    try {
      setEventSaving(true);

      const isEditing = Boolean(
        editingEvent
      );

      const url = isEditing
        ? `${API_URL}/api/events/${editingEvent.eventId}`
        : `${API_URL}/api/events`;

      const method = isEditing
        ? "PUT"
        : "POST";

      const nextEventId =
  events.length > 0
    ? Math.max(
        ...events.map((event) =>
          Number(event.eventId) || 0
        )
      ) + 1
    : 1;

const payload = {
  ...eventForm,

  // Generate eventId only when creating
  ...(isEditing
    ? {}
    : {
        eventId: nextEventId,
      }),

  day: String(eventForm.day),
  month: String(eventForm.month).toUpperCase(),
  year: String(eventForm.year),
 };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save event"
        );
      }

      await fetchEvents();
      await fetchMatches();

      closeEventModal();

      alert(
        isEditing
          ? "Event updated successfully."
          : "Event created successfully."
      );
    } catch (error) {
      console.error(
        "Save event failed:",
        error
      );

      alert(error.message);
    } finally {
      setEventSaving(false);
    }
  };

  // =========================================================
  // DELETE EVENT
  // =========================================================

  const deleteEvent = async (event) => {
    const confirmed = window.confirm(
      `Delete "${event.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/api/events/${event.eventId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete event"
        );
      }

      setEvents((current) =>
        current.filter(
          (item) =>
            item.eventId !== event.eventId
        )
      );

      await fetchMatches();

      if (
        selectedMatch?.eventId === event.eventId
      ) {
        setSelectedMatch(null);
      }

      alert("Event deleted successfully.");
    } catch (error) {
      console.error(
        "Delete event failed:",
        error
      );

      alert(error.message);
    }
  };

  // =========================================================
  // FILTER EVENTS
  // =========================================================

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesStatus =
        eventFilter === "All" ||
        event.status === eventFilter;

      const query =
        eventSearch.trim().toLowerCase();

      const matchesSearch =
        !query ||
        event.title
          ?.toLowerCase()
          .includes(query) ||
        event.competition
          ?.toLowerCase()
          .includes(query) ||
        event.location
          ?.toLowerCase()
          .includes(query) ||
        event.opponent
          ?.toLowerCase()
          .includes(query);

      return (
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    events,
    eventFilter,
    eventSearch,
  ]);

  // =========================================================
  // EVENT STATS
  // =========================================================

  const eventStats = useMemo(() => {
    return {
      total: events.length,

      upcoming: events.filter(
        (event) =>
          event.status === "Upcoming"
      ).length,

      live: events.filter(
        (event) =>
          event.status === "Live"
      ).length,

      past: events.filter(
        (event) =>
          event.status === "Past"
      ).length,
    };
  }, [events]);

  // =========================================================
  // SELECT MATCH
  // =========================================================

  const selectMatch = (match) => {
    setSelectedMatch(match);
  };

  // =========================================================
  // ADD POINT
  // =========================================================

  const addPoint = async (team) => {
    if (
      !selectedMatch ||
      updating
    ) {
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        `${API_URL}/api/matches/${selectedMatch.eventId}/score/${team}`,
        {
          method: "POST",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update score"
        );
      }

      setSelectedMatch(data.match);
    } catch (error) {
      console.error(
        "Score update failed:",
        error
      );

      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
  // UNDO
  // =========================================================

  const undoPoint = async () => {
    if (
      !selectedMatch ||
      updating
    ) {
      return;
    }

    try {
      setUpdating(true);

      const response = await fetch(
        `${API_URL}/api/matches/${selectedMatch.eventId}/undo`,
        {
          method: "POST",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to undo last point"
        );
      }

      setSelectedMatch(data.match);
    } catch (error) {
      console.error(
        "Undo failed:",
        error
      );

      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // =========================================================
// FINISH SET
// =========================================================

const finishSet = async () => {
  if (!selectedMatch || updating) return;

  try {
    setUpdating(true);

    const response = await fetch(
      `${API_URL}/api/matches/${selectedMatch.eventId}/finish-set`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to finish set"
      );
    }

    console.log(
      "🏐 Set finished:",
      data.match
    );

    setSelectedMatch(data.match);

    // Keep match list synchronized
    setMatches((currentMatches) =>
      currentMatches.map((match) =>
        match.eventId === data.match.eventId
          ? data.match
          : match
      )
    );
  } catch (error) {
    console.error(
      "Finish set failed:",
      error
    );

    alert(error.message);
  } finally {
    setUpdating(false);
  }
 };
  // =========================================================
// END MATCH
// =========================================================

const endMatch = async () => {
  if (
    !selectedMatch ||
    updating
  ) {
    return;
  }

  const confirmed =
    window.confirm(
      `End this match?\n\nAIT ${selectedMatch.aitSetsWon} - ${selectedMatch.opponentSetsWon} ${selectedMatch.opponent}\n\nThe complete match history will be saved.`
    );

  if (!confirmed) {
    return;
  }

  try {
    setUpdating(true);

    const response =
      await fetch(
        `${API_URL}/api/matches/${selectedMatch.eventId}/end-match`,
        {
          method: "POST",
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to end match"
      );
    }

    console.log(
      "🏁 Match ended:",
      data
    );

    setSelectedMatch(
      data.match
    );

    setMatches(
      (currentMatches) =>
        currentMatches.map(
          (match) =>
            match.eventId ===
            data.match.eventId
              ? data.match
              : match
        )
    );

    // Refresh events because
    // the event may become Past
    await fetchEvents();

    alert(
      "Match ended successfully. Complete match history has been saved."
    );
  } catch (error) {
    console.error(
      "End match failed:",
      error
    );

    alert(error.message);
  } finally {
    setUpdating(false);
  }
 };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#071A2B] text-white">
        Loading admin panel...
      </div>
    );
  }

  // =========================================================
  // ADMIN
  // =========================================================

  return (
    <main className="min-h-screen bg-[#071A2B] px-4 py-6 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-8">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#FFC928]">
            AIT Volleyball
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-black sm:text-5xl">
                ADMIN CONTROL CENTER
              </h1>

              <p className="mt-2 max-w-xl text-sm text-white/40">
                Manage events and control
                live volleyball matches.
              </p>
            </div>
          </div>
        </header>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}

        <div className="mb-8 flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          <button
            type="button"
            onClick={() =>
              setActiveSection("events")
            }
            className={`
              flex-1 rounded-xl px-5 py-3
              text-xs font-black uppercase
              tracking-widest transition
              ${
                activeSection === "events"
                  ? "bg-[#FFC928] text-[#071A2B]"
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            Events
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSection("matches");
              setSelectedMatch(null);
            }}
            className={`
              flex-1 rounded-xl px-5 py-3
              text-xs font-black uppercase
              tracking-widest transition
              ${
                activeSection === "matches"
                  ? "bg-[#FFC928] text-[#071A2B]"
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            Matches
          </button>
        </div>

        {/* =====================================================
            EVENTS SECTION
        ===================================================== */}

        {activeSection === "events" && (
          <section>

            {/* EVENT STATISTICS */}

            <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                label="Total Events"
                value={eventStats.total}
              />

              <StatCard
                label="Upcoming"
                value={eventStats.upcoming}
              />

              <StatCard
                label="Live"
                value={eventStats.live}
                live
              />

              <StatCard
                label="Past"
                value={eventStats.past}
              />
            </div>

            {/* EVENT TOOLBAR */}

            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.25em] text-white/30">
                    Content Management
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    EVENTS
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={openCreateEvent}
                  className="
                    rounded-xl
                    bg-[#FFC928]
                    px-5
                    py-3
                    text-xs
                    font-black
                    uppercase
                    tracking-widest
                    text-[#071A2B]
                    transition
                    hover:bg-[#FFD84D]
                  "
                >
                  + Create Event
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">

                <input
                  type="text"
                  value={eventSearch}
                  onChange={(e) =>
                    setEventSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search events..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-4
                    py-3
                    text-sm
                    text-white
                    outline-none
                    placeholder:text-white/20
                    focus:border-[#FFC928]/40
                  "
                />

                <div className="flex gap-1 rounded-xl bg-white/[0.04] p-1">
                  {[
                    "All",
                    "Upcoming",
                    "Live",
                    "Past",
                  ].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setEventFilter(
                          status
                        )
                      }
                      className={`
                        rounded-lg
                        px-3
                        py-2
                        text-[8px]
                        font-black
                        uppercase
                        tracking-wider
                        transition
                        ${
                          eventFilter ===
                          status
                            ? "bg-[#FFC928] text-[#071A2B]"
                            : "text-white/30 hover:text-white"
                        }
                      `}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* EVENTS LIST */}

            {eventsLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/30">
                Loading events...
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
                <p className="text-lg font-black">
                  No events found
                </p>

                <p className="mt-2 text-sm text-white/30">
                  Create your first event
                  to get started.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredEvents.map(
                  (event) => (
                    <EventAdminCard
                      key={event.eventId}
                      event={event}
                      onEdit={
                        openEditEvent
                      }
                      onDelete={
                        deleteEvent
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>
        )}

        {/* =====================================================
            MATCH SECTION
        ===================================================== */}

        {activeSection === "matches" && (
          <section>

            {!selectedMatch ? (
              <>
                <div className="mb-6">
                  <p className="text-[8px] font-black uppercase tracking-[0.25em] text-white/30">
                    Live Control
                  </p>

                  <h2 className="mt-1 text-3xl font-black">
                    MATCHES
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {matches.map(
                    (match) => (
                      <button
                        key={
                          match.eventId
                        }
                        type="button"
                        onClick={() =>
                          selectMatch(
                            match
                          )
                        }
                        className="
                          rounded-2xl
                          border
                          border-white/10
                          bg-white/[0.04]
                          p-6
                          text-left
                          transition
                          hover:border-[#FFC928]/40
                          hover:bg-white/[0.07]
                        "
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-[#FFC928]">
                            {
                              match.status
                            }
                          </span>

                          <span className="text-xs text-white/30">
                            #
                            {
                              match.eventId
                            }
                          </span>
                        </div>

                        <h3 className="mt-4 text-2xl font-black">
                          {
                            match.title
                          }
                        </h3>

                        <p className="mt-2 text-sm text-white/40">
                          AIT vs{" "}
                          {
                            match.opponent
                          }
                        </p>

                        <div className="mt-5 text-3xl font-black">
                          {
                            match.aitPoints
                          }

                          <span className="mx-2 text-white/20">
                            -
                          </span>

                          {
                            match.opponentPoints
                          }
                        </div>

                        <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-white/20">
                          Set{" "}
                          {
                            match.currentSet
                          }
                        </p>
                      </button>
                    )
                  )}
                </div>
              </>
            ) : (
              <MatchScoreboard
                selectedMatch={
                  selectedMatch
                }
                setSelectedMatch={
                  setSelectedMatch
                }
                updating={
                  updating
                }
                addPoint={
                  addPoint
                }
                undoPoint={
                  undoPoint
                }
                finishSet={
                  finishSet
                }
                endMatch={endMatch}
              />
            )}
          </section>
        )}
      </div>

      {/* =====================================================
          EVENT MODAL
      ===================================================== */}

      {eventModalOpen && (
        <EventModal
          eventForm={eventForm}
          setEventForm={
            setEventForm
          }
          editingEvent={
            editingEvent
          }
          eventSaving={
            eventSaving
          }
          newHighlight={
            newHighlight
          }
          setNewHighlight={
            setNewHighlight
          }
          handleEventChange={
            handleEventChange
          }
          addHighlight={
            addHighlight
          }
          removeHighlight={
            removeHighlight
          }
          onClose={
            closeEventModal
          }
          onSubmit={
            saveEvent
          }
        />
      )}
    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  live = false,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <p className="text-[8px] font-black uppercase tracking-widest text-white/30">
          {label}
        </p>

        {live && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        )}
      </div>

      <p className="mt-3 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EVENT ADMIN CARD
========================================================= */

function EventAdminCard({
  event,
  onEdit,
  onDelete,
}) {
  const statusStyles = {
    Upcoming:
      "bg-[#FFC928]/10 text-[#FFC928]",
    Live:
      "bg-red-500/10 text-red-400",
    Past:
      "bg-white/10 text-white/40",
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20">
      <div className="flex items-start justify-between gap-4">

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`
                rounded-full
                px-2.5
                py-1
                text-[7px]
                font-black
                uppercase
                tracking-widest
                ${statusStyles[event.status]}
              `}
            >
              {event.status}
            </span>

            {event.featured && (
              <span className="rounded-full bg-[#FFC928] px-2.5 py-1 text-[7px] font-black uppercase tracking-widest text-[#071A2B]">
                Featured
              </span>
            )}
          </div>

          <p className="mt-4 text-[8px] font-black uppercase tracking-[0.2em] text-[#FFC928]">
            {event.competition ||
              "AIT Volleyball"}
          </p>

          <h3 className="mt-2 text-xl font-black">
            {event.title}
          </h3>

          <p className="mt-2 text-xs text-white/40">
            {event.date ||
              `${event.day} ${event.month} ${event.year}`}
          </p>

          <p className="mt-1 text-xs text-white/30">
            {event.venue ||
              event.location}
          </p>

          {event.opponent && (
            <p className="mt-3 text-xs font-bold text-white/50">
              AIT vs{" "}
              {event.opponent}
            </p>
          )}
        </div>

        <span className="text-[8px] font-black text-white/20">
          #{event.eventId}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-xs leading-5 text-white/30">
        {event.description}
      </p>

      <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() =>
            onEdit(event)
          }
          className="
            flex-1
            rounded-xl
            border
            border-white/10
            bg-white/[0.04]
            px-4
            py-3
            text-[9px]
            font-black
            uppercase
            tracking-widest
            text-white/60
            transition
            hover:border-[#FFC928]/30
            hover:text-[#FFC928]
          "
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() =>
            onDelete(event)
          }
          className="
            rounded-xl
            border
            border-red-500/20
            bg-red-500/[0.05]
            px-4
            py-3
            text-[9px]
            font-black
            uppercase
            tracking-widest
            text-red-400
            transition
            hover:bg-red-500/10
          "
        >
          Delete
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   EVENT MODAL
========================================================= */

function EventModal({
  eventForm,
  setEventForm,
  editingEvent,
  eventSaving,
  newHighlight,
  setNewHighlight,
  handleEventChange,
  addHighlight,
  removeHighlight,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8">

      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[#0B2238] shadow-2xl">

        {/* HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0B2238]/95 px-6 py-5 backdrop-blur sm:px-8">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.25em] text-[#FFC928]">
              Event Management
            </p>

            <h2 className="mt-1 text-2xl font-black">
              {editingEvent
                ? "EDIT EVENT"
                : "CREATE EVENT"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={eventSaving}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            ✕
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="space-y-6 p-6 sm:p-8"
        >

          {/* BASIC */}

          <div>
            <SectionLabel>
              Basic Information
            </SectionLabel>

            <div className="grid gap-4">

              <Field
                label="Event Title *"
                name="title"
                value={
                  eventForm.title
                }
                onChange={
                  handleEventChange
                }
                placeholder="SPPU Inter-College Volleyball Zonals"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Competition"
                  name="competition"
                  value={
                    eventForm.competition
                  }
                  onChange={
                    handleEventChange
                  }
                  placeholder="SPPU Volleyball"
                />

                <SelectField
                  label="Status"
                  name="status"
                  value={
                    eventForm.status
                  }
                  onChange={
                    handleEventChange
                  }
                  options={[
                    "Upcoming",
                    "Live",
                    "Past",
                  ]}
                />
              </div>
            </div>
          </div>

          {/* DATE */}

          <div>
            <SectionLabel>
              Schedule
            </SectionLabel>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Day *"
                name="day"
                value={
                  eventForm.day
                }
                onChange={
                  handleEventChange
                }
                placeholder="09"
              />

              <Field
                label="Month *"
                name="month"
                value={
                  eventForm.month
                }
                onChange={
                  handleEventChange
                }
                placeholder="OCT"
              />

              <Field
                label="Year *"
                name="year"
                value={
                  eventForm.year
                }
                onChange={
                  handleEventChange
                }
                placeholder="2026"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Display Date"
                name="date"
                value={
                  eventForm.date
                }
                onChange={
                  handleEventChange
                }
                placeholder="09 October 2026"
              />

              <Field
                label="Time"
                name="time"
                value={
                  eventForm.time
                }
                onChange={
                  handleEventChange
                }
                placeholder="10:00 AM"
              />
            </div>
          </div>

          {/* LOCATION */}

          <div>
            <SectionLabel>
              Location
            </SectionLabel>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Location"
                name="location"
                value={
                  eventForm.location
                }
                onChange={
                  handleEventChange
                }
                placeholder="AIT Pune"
              />

              <Field
                label="Venue"
                name="venue"
                value={
                  eventForm.venue
                }
                onChange={
                  handleEventChange
                }
                placeholder="AIT Volleyball Court"
              />
            </div>
          </div>

          {/* MATCH DETAILS */}

          <div>
            <SectionLabel>
              Match Details
            </SectionLabel>

            <div className="grid gap-4 sm:grid-cols-2">

              <Field
                label="Opponent"
                name="opponent"
                value={
                  eventForm.opponent
                }
                onChange={
                  handleEventChange
                }
                placeholder="CAMPUS XI"
              />

              <Field
                label="Round"
                name="round"
                value={
                  eventForm.round
                }
                onChange={
                  handleEventChange
                }
                placeholder="Final"
              />

              <Field
                label="Format"
                name="format"
                value={
                  eventForm.format
                }
                onChange={
                  handleEventChange
                }
                placeholder="Best of 5"
              />

              <Field
                label="Organizer"
                name="organizer"
                value={
                  eventForm.organizer
                }
                onChange={
                  handleEventChange
                }
                placeholder="AIT Sports Committee"
              />
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <SectionLabel>
              Content
            </SectionLabel>

            <div className="space-y-4">

              <TextArea
                label="Short Description"
                name="description"
                value={
                  eventForm.description
                }
                onChange={
                  handleEventChange
                }
                placeholder="Describe the event..."
              />

              <TextArea
                label="Detailed Information"
                name="details"
                value={
                  eventForm.details
                }
                onChange={
                  handleEventChange
                }
                placeholder="Detailed information shown in the Match Center..."
              />

              <Field
                label="Image URL"
                name="image"
                value={
                  eventForm.image
                }
                onChange={
                  handleEventChange
                }
                placeholder="/images/events/event-01.jpg"
              />

              <Field
                label="MVP"
                name="mvp"
                value={
                  eventForm.mvp
                }
                onChange={
                  handleEventChange
                }
                placeholder="Player name"
              />
            </div>
          </div>

          {/* HIGHLIGHTS */}

          <div>
            <SectionLabel>
              Highlights
            </SectionLabel>

            <div className="flex gap-2">
              <input
                type="text"
                value={
                  newHighlight
                }
                onChange={(e) =>
                  setNewHighlight(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter"
                  ) {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
                placeholder="Championship Final"
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-white/20
                  focus:border-[#FFC928]/40
                "
              />

              <button
                type="button"
                onClick={
                  addHighlight
                }
                className="
                  rounded-xl
                  bg-white/10
                  px-4
                  text-xs
                  font-black
                  uppercase
                  tracking-wider
                  text-white
                  transition
                  hover:bg-white/15
                "
              >
                Add
              </button>
            </div>

            {eventForm.highlights
              .length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {eventForm.highlights.map(
                  (
                    highlight,
                    index
                  ) => (
                    <span
                      key={`${highlight}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[#FFC928]/20 bg-[#FFC928]/5 px-3 py-2 text-[9px] font-bold text-[#FFC928]"
                    >
                      {highlight}

                      <button
                        type="button"
                        onClick={() =>
                          removeHighlight(
                            index
                          )
                        }
                        className="text-white/40 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* FEATURED */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <input
              type="checkbox"
              name="featured"
              checked={
                eventForm.featured
              }
              onChange={
                handleEventChange
              }
              className="h-4 w-4 accent-[#FFC928]"
            />

            <div>
              <p className="text-sm font-bold">
                Featured Event
              </p>

              <p className="mt-1 text-[10px] text-white/30">
                Highlight this event in
                future public layouts.
              </p>
            </div>
          </label>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={eventSaving}
              className="
                rounded-xl
                border
                border-white/10
                px-5
                py-3
                text-xs
                font-black
                uppercase
                tracking-widest
                text-white/50
                transition
                hover:text-white
                disabled:opacity-30
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                eventSaving
              }
              className="
                rounded-xl
                bg-[#FFC928]
                px-6
                py-3
                text-xs
                font-black
                uppercase
                tracking-widest
                text-[#071A2B]
                transition
                hover:bg-[#FFD84D]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {eventSaving
                ? "Saving..."
                : editingEvent
                ? "Update Event"
                : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
        {label}
      </span>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-white/[0.04]
          px-4
          py-3
          text-sm
          text-white
          outline-none
          placeholder:text-white/15
          focus:border-[#FFC928]/40
        "
      />
    </label>
  );
}

/* =========================================================
   SELECT FIELD
========================================================= */

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
        {label}
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-[#0B2238]
          px-4
          py-3
          text-sm
          text-white
          outline-none
          focus:border-[#FFC928]/40
        "
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
        {label}
      </span>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="
          w-full
          resize-none
          rounded-xl
          border
          border-white/10
          bg-white/[0.04]
          px-4
          py-3
          text-sm
          leading-6
          text-white
          outline-none
          placeholder:text-white/15
          focus:border-[#FFC928]/40
        "
      />
    </label>
  );
}

/* =========================================================
   SECTION LABEL
========================================================= */

function SectionLabel({
  children,
}) {
  return (
    <p className="mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-[#FFC928]">
      {children}
    </p>
  );
}

/* =========================================================
   MATCH SCOREBOARD
========================================================= */

function MatchScoreboard({
  selectedMatch,
  setSelectedMatch,
  updating,
  addPoint,
  undoPoint,
  finishSet,
  endMatch,
}) {
  return (
    <div>

      {/* BACK */}

      <button
        type="button"
        onClick={() =>
          setSelectedMatch(null)
        }
        className="
          mb-6
          text-xs
          font-black
          uppercase
          tracking-widest
          text-white/40
          transition
          hover:text-white
        "
      >
        ← Back to Matches
      </button>

      {/* HEADER */}

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">

        <div className="border-b border-white/10 p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#FFC928]">
            {selectedMatch.competition ||
              "AIT Volleyball"}
          </p>

          <h2 className="mt-2 text-3xl font-black">
            {selectedMatch.title}
          </h2>

          <p className="mt-2 text-xs text-white/30">
            AIT vs{" "}
            {selectedMatch.opponent}
          </p>
        </div>

        {/* SCORE */}

        <div className="grid gap-8 p-6 sm:grid-cols-[1fr_auto_1fr] sm:p-10">

          {/* AIT */}

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-[#FFC928]">
              AIT
            </p>

            <div className="mt-4 text-8xl font-black leading-none">
              {selectedMatch.aitPoints}
            </div>

            <button
              type="button"
              disabled={
                updating ||
                selectedMatch.status !==
                  "Live"
              }
              onClick={() =>
                addPoint("ait")
              }
              className="
                mt-6
                w-full
                rounded-2xl
                bg-[#FFC928]
                px-6
                py-5
                text-lg
                font-black
                text-[#071A2B]
                transition
                hover:bg-[#FFD84D]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              +1 AIT
            </button>
          </div>

          {/* CENTER */}

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-white/30">
              SET
            </p>

            <div className="mt-2 text-5xl font-black">
              {selectedMatch.currentSet}
            </div>

            <div className="mt-4 text-xs font-bold text-white/30">
              {selectedMatch.aitSetsWon}{" "}
              -{" "}
              {
                selectedMatch.opponentSetsWon
              }
            </div>

            <p className="mt-1 text-[10px] uppercase tracking-widest text-white/20">
              Sets Won
            </p>

            {selectedMatch.status ===
              "Live" && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-red-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                Live
              </div>
            )}

            {selectedMatch.status ===
              "Finished" && (
              <div className="mt-5 rounded-full bg-[#FFC928]/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-[#FFC928]">
                Match Finished
              </div>
            )}
          </div>

          {/* OPPONENT */}

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest text-white/40">
              {selectedMatch.opponent}
            </p>

            <div className="mt-4 text-8xl font-black leading-none">
              {
                selectedMatch.opponentPoints
              }
            </div>

            <button
              type="button"
              disabled={
                updating ||
                selectedMatch.status !==
                  "Live"
              }
              onClick={() =>
                addPoint("opponent")
              }
              className="
                mt-6
                w-full
                rounded-2xl
                border
                border-white/15
                bg-white/5
                px-6
                py-5
                text-lg
                font-black
                transition
                hover:bg-white/10
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              +1{" "}
              {selectedMatch.opponent}
            </button>
          </div>
        </div>

        {/* CONTROLS */}

        {/* =================================================
    MATCH CONTROLS
================================================= */}

<div className="border-t border-white/10 px-6 py-5 sm:px-10">

  <div className="grid gap-3 sm:grid-cols-3">

    {/* UNDO */}

    <button
      type="button"
      disabled={
        updating ||
        selectedMatch.status !== "Live"
      }
      onClick={undoPoint}
      className="
        rounded-2xl
        border
        border-red-500/20
        bg-red-500/[0.06]
        px-5
        py-4
        text-sm
        font-black
        uppercase
        tracking-widest
        text-red-400
        transition
        hover:bg-red-500/10
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
    >
      ↩ Undo Last Point
    </button>

    {/* FINISH SET */}

    <button
      type="button"
      disabled={
        updating ||
        selectedMatch.status !== "Live"
      }
      onClick={finishSet}
      className="
        rounded-2xl
        bg-[#FFC928]
        px-5
        py-4
        text-sm
        font-black
        uppercase
        tracking-widest
        text-[#071A2B]
        transition
        hover:bg-[#FFD84D]
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
    >
      Finish Set →
    </button>

    {/* END MATCH */}

    <button
      type="button"
      disabled={
        updating ||
        selectedMatch.status !== "Live"
      }
      onClick={endMatch}
      className="
        rounded-2xl
        border
        border-red-500/30
        bg-red-500/10
        px-5
        py-4
        text-sm
        font-black
        uppercase
        tracking-widest
        text-red-400
        transition
        hover:bg-red-500/15
        hover:text-red-300
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
    >
      End Match
    </button>

  </div>
</div>

        {/* FINAL SET SCORES */}

        <div className="border-t border-white/10 p-6 sm:p-8">
          <p className="mb-5 text-xs font-black uppercase tracking-widest text-white/30">
            Final Set Scores
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {selectedMatch.sets
              ?.filter(
                (set) =>
                  set.status ===
                  "Finished"
              )
              .map((set) => (
                <div
                  key={set.number}
                  className="
                    rounded-xl
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    px-4
                    py-4
                    text-center
                  "
                >
                  <p className="text-[7px] font-black uppercase tracking-wider text-white/30">
                    Set {set.number}
                  </p>

                  <p className="mt-2 text-xl font-black">
                    {set.ait}
                    <span className="mx-2 text-white/20">
                      -
                    </span>
                    {set.opponent}
                  </p>

                  <p className="mt-1 text-[7px] font-black uppercase tracking-wider text-white/20">
                    Final
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}