const express = require("express");
const Event = require("../models/Event");
const Match = require("../models/Match");

const router = express.Router();

// =========================================================
// CREATE MATCH FROM LIVE EVENT
// =========================================================

const createMatchFromEvent = async (event) => {
  if (event.status !== "Live") {
    return null;
  }

  // Prevent duplicate matches
  const existingMatch = await Match.findOne({
    eventId: event.eventId,
  });

  if (existingMatch) {
    return existingMatch;
  }

  const opponent =
    event.opponent?.trim() || "Opponent";

  const match = await Match.create({
    eventId: event.eventId,

    title: event.title,

    competition:
      event.competition || "AIT Volleyball",

    venue:
      event.venue ||
      event.location ||
      "",

    opponent,

    format:
      event.format || "Best of 5",

    round:
      event.round || "",

    status: "Live",

    currentSet: 1,

    aitSetsWon: 0,

    opponentSetsWon: 0,

    aitPoints: 0,

    opponentPoints: 0,

    sets: [
      {
        number: 1,
        ait: 0,
        opponent: 0,
        status: "Live",
      },
      {
        number: 2,
        ait: 0,
        opponent: 0,
        status: "Upcoming",
      },
      {
        number: 3,
        ait: 0,
        opponent: 0,
        status: "Upcoming",
      },
      {
        number: 4,
        ait: 0,
        opponent: 0,
        status: "Upcoming",
      },
      {
        number: 5,
        ait: 0,
        opponent: 0,
        status: "Upcoming",
      },
    ],

    pointHistory: [],

    mvp: event.mvp || "",

    highlights:
      event.highlights || [],

    lastUpdated: new Date(),
  });

  console.log(
    `🏐 Match automatically created for Event #${event.eventId}`
  );

  return match;
};

// =========================================================
// GET ALL EVENTS
// =========================================================

router.get("/", async (req, res) => {
  try {
    const events =
      await Event.find().sort({
        year: 1,
        month: 1,
        day: 1,
      });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error(
      "Fetch events error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================================================
// GET SINGLE EVENT
// =========================================================

router.get("/:eventId", async (req, res) => {
  try {
    const event =
      await Event.findOne({
        eventId:
          Number(req.params.eventId),
      });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================================================
// CREATE EVENT
// =========================================================

router.post("/", async (req, res) => {
  try {
    const event =
      await Event.create(req.body);

    let match = null;

    if (event.status === "Live") {
      match =
        await createMatchFromEvent(
          event
        );
    }

    res.status(201).json({
      success: true,
      message:
        "Event created successfully",
      event,
      match,
    });
  } catch (error) {
    console.error(
      "Create event error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================================================
// UPDATE EVENT
// =========================================================

router.put("/:eventId", async (req, res) => {
  try {
    const event =
      await Event.findOneAndUpdate(
        {
          eventId:
            Number(req.params.eventId),
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let match = null;

    if (event.status === "Live") {
      match =
        await createMatchFromEvent(
          event
        );
    }

    res.status(200).json({
      success: true,
      message:
        "Event updated successfully",
      event,
      match,
    });
  } catch (error) {
    console.error(
      "Update event error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =========================================================
// DELETE EVENT
// =========================================================

router.delete("/:eventId", async (req, res) => {
  try {
    const eventId =
      Number(req.params.eventId);

    const event =
      await Event.findOneAndDelete({
        eventId,
      });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Also delete linked match
    await Match.findOneAndDelete({
      eventId,
    });

    res.status(200).json({
      success: true,
      message:
        "Event and linked match deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete event error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;