const mongoose = require("mongoose");

// =========================================================
// SET SCHEMA
// =========================================================

const setSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },

    ait: {
      type: Number,
      default: 0,
      min: 0,
    },

    opponent: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Live", "Finished"],
      default: "Upcoming",
    },
  },
  {
    _id: false,
  }
);

// =========================================================
// POINT HISTORY SCHEMA
// =========================================================

const pointHistorySchema = new mongoose.Schema(
  {
    team: {
      type: String,
      enum: ["ait", "opponent"],
      required: true,
    },

    set: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
);

// =========================================================
// MATCH SCHEMA
// =========================================================

const matchSchema = new mongoose.Schema(
  {
    eventId: {
      type: Number,
      required: true,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    competition: {
      type: String,
      trim: true,
    },

    venue: {
      type: String,
      trim: true,
    },

    opponent: {
      type: String,
      required: true,
      trim: true,
    },

    format: {
      type: String,
      default: "Best of 5",
    },

    round: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Live", "Finished"],
      default: "Upcoming",
    },

    // =====================================================
    // CURRENT SET
    // =====================================================

    currentSet: {
      type: Number,
      default: 1,
      min: 1,
    },

    // =====================================================
    // SETS WON
    // =====================================================

    aitSetsWon: {
      type: Number,
      default: 0,
      min: 0,
    },

    opponentSetsWon: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // CURRENT LIVE SCORE
    // =====================================================

    aitPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    opponentPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =====================================================
    // SET SCORES
    // =====================================================

    sets: {
      type: [setSchema],
      default: [],
    },

    // =====================================================
    // POINT HISTORY
    // Used for Undo Last Point
    // =====================================================

    pointHistory: {
      type: [pointHistorySchema],
      default: [],
    },

    // =====================================================
    // MATCH INFORMATION
    // =====================================================
    winner: {
  type: String,
  enum: ["ait", "opponent", ""],
  default: "",
 },

 winnerName: {
  type: String,
  default: "",
  trim: true,
 },

 completedAt: {
  type: Date,
  default: null,
 },

 matchHistory: {
  type: Object,
  default: null,
 },
    mvp: {
      type: String,
      default: "",
      trim: true,
    },

    highlights: {
      type: [String],
      default: [],
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Match", matchSchema);