const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
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

    description: {
      type: String,
      default: "",
      trim: true,
    },

    details: {
      type: String,
      default: "",
      trim: true,
    },

    day: {
      type: String,
      required: true,
    },

    month: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      default: "",
    },

    time: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    venue: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Live", "Past"],
      default: "Upcoming",
    },

    competition: {
      type: String,
      default: "",
      trim: true,
    },

    organizer: {
      type: String,
      default: "",
      trim: true,
    },

    opponent: {
      type: String,
      default: "",
      trim: true,
    },

    round: {
      type: String,
      default: "",
      trim: true,
    },

    format: {
      type: String,
      default: "",
      trim: true,
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

    image: {
      type: String,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);