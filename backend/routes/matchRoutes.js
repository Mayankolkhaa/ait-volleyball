const express = require("express");
const Match = require("../models/Match");

const createMatchRoutes = (io) =>{
const router = express.Router();

// =========================================================
// VOLLEYBALL SET WINNING RULE
// =========================================================

const checkSetWinner = (set) => {
  const targetPoints = set.number === 5 ? 15 : 25;

  const aitWon =
    set.ait >= targetPoints &&
    set.ait - set.opponent >= 2;

  const opponentWon =
    set.opponent >= targetPoints &&
    set.opponent - set.ait >= 2;

  if (aitWon) return "ait";

  if (opponentWon) return "opponent";

  return null;
};
// =========================================================
// FINISH SET / START NEXT SET
// =========================================================

const finishCurrentSet = (match, winner) => {
  const currentSetIndex = match.sets.findIndex(
    (set) => set.number === match.currentSet
  );

  if (currentSetIndex === -1) {
    throw new Error("Current set not found");
  }

  const currentSet = match.sets[currentSetIndex];

  currentSet.status = "Finished";

  if (winner === "ait") {
    match.aitSetsWon += 1;
  } else {
    match.opponentSetsWon += 1;
  }

  // =====================================================
  // MATCH WON?
  // =====================================================

  if (
    match.aitSetsWon >= 3 ||
    match.opponentSetsWon >= 3
  ) {
    match.status = "Finished";

    match.aitPoints = 0;
    match.opponentPoints = 0;

    match.pointHistory = [];

    match.lastUpdated = new Date();

    return {
      matchFinished: true,
      currentSet,
    };
  }

  // =====================================================
  // START NEXT SET
  // =====================================================

  const nextSetNumber = match.currentSet + 1;

  match.sets.push({
    number: nextSetNumber,
    ait: 0,
    opponent: 0,
    status: "Live",
  });

  match.currentSet = nextSetNumber;

  match.aitPoints = 0;
  match.opponentPoints = 0;

  match.pointHistory = [];

  match.lastUpdated = new Date();

  return {
    matchFinished: false,
    currentSet,
  };
};

/*
GET /api/matches
Get all matches
*/
router.get("/", async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("Error fetching matches:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch matches",
    });
  }
});

/*
GET /api/matches/:eventId
Get one match
*/
router.get("/:eventId", async (req, res) => {
  try {
    const match = await Match.findOne({
      eventId: Number(req.params.eventId),
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    res.status(200).json({
      success: true,
      match,
    });
  } catch (error) {
    console.error("Error fetching match:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch match",
    });
  }
});

/*
POST /api/matches
Create a new match
*/
router.post("/", async (req, res) => {
  try {
    const match = await Match.create(req.body);

    res.status(201).json({
      success: true,
      message: "Match created successfully",
      match,
    });
  } catch (error) {
    console.error("Error creating match:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/*
PUT /api/matches/:eventId
Update match
*/
router.put("/:eventId", async (req, res) => {
  try {
    const match = await Match.findOneAndUpdate(
      {
        eventId: Number(req.params.eventId),
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Match updated successfully",
      match,
    });
  } catch (error) {
    console.error("Error updating match:", error.message);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/*
DELETE /api/matches/:eventId
Delete match
*/
router.delete("/:eventId", async (req, res) => {
  try {
    const match = await Match.findOneAndDelete({
      eventId: Number(req.params.eventId),
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Match deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting match:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete match",
    });
  }
});

/*
POST /api/matches/:eventId/score/ait
Add one point to AIT
*/
router.post("/:eventId/score/ait", async (req, res) => {
  try {
    const match = await Match.findOne({
      eventId: Number(req.params.eventId),
      status: "Live",
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Live match not found",
      });
    }

    const currentSetIndex = match.sets.findIndex(
      (set) => set.number === match.currentSet
    );

    if (currentSetIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Current set not found",
      });
    }

    // =====================================================
    // ADD POINT
    // =====================================================

    match.aitPoints += 1;

    match.sets[currentSetIndex].ait += 1;

    match.pointHistory.push({
      team: "ait",
      set: match.currentSet,
    });

    // =====================================================
    // CHECK SET WINNER
    // =====================================================

    const winner = checkSetWinner(
      match.sets[currentSetIndex]
    );

    if (winner) {
      const result = finishCurrentSet(match, winner);

      await match.save();

      console.log("🏐 SET FINISHED");

      console.log(
        `Set ${result.currentSet.number}:`,
        result.currentSet.ait,
        "-",
        result.currentSet.opponent
      );

      console.log(
        "Sets Won:",
        match.aitSetsWon,
        "-",
        match.opponentSetsWon
      );

      if (result.matchFinished) {
        console.log("🏆 MATCH FINISHED");
      } else {
        console.log(
          "Starting Set:",
          match.currentSet
        );
      }

      io.emit("scoreUpdated", match);

      return res.status(200).json({
        success: true,
        message: result.matchFinished
          ? "AIT won the match"
          : "AIT won the set",
        match,
      });
    }

    // =====================================================
    // NORMAL POINT
    // =====================================================

    match.lastUpdated = new Date();

    await match.save();

    console.log("🏐 AIT POINT UPDATED");

    console.log(
      "Current Set:",
      match.currentSet
    );

    console.log(
      "Score:",
      match.aitPoints,
      "-",
      match.opponentPoints
    );

    io.emit("scoreUpdated", match);

    res.status(200).json({
      success: true,
      message: "AIT scored one point",
      match,
    });

  } catch (error) {
    console.error("AIT scoring error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update AIT score",
      error: error.message,
    });
  }
});

/*
POST /api/matches/:eventId/score/opponent
Add one point to opponent
*/
router.post("/:eventId/score/opponent", async (req, res) => {
  try {
    const match = await Match.findOne({
      eventId: Number(req.params.eventId),
      status: "Live",
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Live match not found",
      });
    }

    const currentSetIndex = match.sets.findIndex(
      (set) => set.number === match.currentSet
    );

    if (currentSetIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Current set not found",
      });
    }

    // =====================================================
    // ADD POINT
    // =====================================================

    match.opponentPoints += 1;

    match.sets[currentSetIndex].opponent += 1;

    match.pointHistory.push({
      team: "opponent",
      set: match.currentSet,
    });

    // =====================================================
    // CHECK SET WINNER
    // =====================================================

    const winner = checkSetWinner(
      match.sets[currentSetIndex]
    );

    if (winner) {
      const result = finishCurrentSet(match, winner);

      await match.save();

      console.log("🏐 SET FINISHED");

      console.log(
        `Set ${result.currentSet.number}:`,
        result.currentSet.ait,
        "-",
        result.currentSet.opponent
      );

      console.log(
        "Sets Won:",
        match.aitSetsWon,
        "-",
        match.opponentSetsWon
      );

      if (result.matchFinished) {
        console.log("🏆 MATCH FINISHED");
      } else {
        console.log(
          "Starting Set:",
          match.currentSet
        );
      }

      io.emit("scoreUpdated", match);

      return res.status(200).json({
        success: true,
        message: result.matchFinished
          ? "Opponent won the match"
          : "Opponent won the set",
        match,
      });
    }

    // =====================================================
    // NORMAL POINT
    // =====================================================

    match.lastUpdated = new Date();

    await match.save();

    console.log("🏐 OPPONENT POINT UPDATED");

    console.log(
      "Current Set:",
      match.currentSet
    );

    console.log(
      "Score:",
      match.aitPoints,
      "-",
      match.opponentPoints
    );

    io.emit("scoreUpdated", match);

    res.status(200).json({
      success: true,
      message: "Opponent scored one point",
      match,
    });

  } catch (error) {
    console.error("Opponent scoring error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update opponent score",
      error: error.message,
    });
  }
});

router.post("/:eventId/end-match", async (req, res) => {
  try {
    const match = await Match.findOne({
      eventId: Number(req.params.eventId),
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found",
      });
    }

    if (match.status === "Finished") {
      return res.status(400).json({
        success: false,
        message: "Match is already finished",
      });
    }

    // ============================================
    // DETERMINE WINNER
    // ============================================

    let winner = "";

    if (match.aitSetsWon > match.opponentSetsWon) {
      winner = "ait";
    } else if (
      match.opponentSetsWon >
      match.aitSetsWon
    ) {
      winner = "opponent";
    }

    if (!winner) {
      return res.status(400).json({
        success: false,
        message:
          "A winner cannot be determined yet. Finish the required sets first.",
      });
    }

    // ============================================
    // MAKE SURE CURRENT SET IS SAVED
    // ============================================

    const currentSet = match.sets.find(
      (set) =>
        set.number === match.currentSet
    );

    if (
      currentSet &&
      currentSet.status === "Live"
    ) {
      currentSet.status = "Finished";
    }

    // ============================================
    // CREATE COMPLETE HISTORY SNAPSHOT
    // ============================================

    const historySnapshot = {
      eventId: match.eventId,

      title: match.title,

      competition:
        match.competition || "",

      venue:
        match.venue || "",

      opponent:
        match.opponent,

      format:
        match.format || "Best of 5",

      round:
        match.round || "",

      winner,

      winnerName:
        winner === "ait"
          ? "AIT"
          : match.opponent,

      finalScore: {
        aitSets:
          match.aitSetsWon,

        opponentSets:
          match.opponentSetsWon,
      },

      sets: match.sets.map(
        (set) => ({
          number: set.number,
          ait: set.ait,
          opponent: set.opponent,
          status: set.status,
        })
      ),

      pointHistory:
        match.pointHistory.map(
          (point) => ({
            team: point.team,
            set: point.set,
          })
        ),

      mvp:
        match.mvp || "",

      highlights:
        match.highlights || [],

      completedAt: new Date(),
    };

    // ============================================
    // UPDATE MATCH
    // ============================================

    match.status = "Finished";

    match.winner = winner;

    match.winnerName =
      winner === "ait"
        ? "AIT"
        : match.opponent;

    match.completedAt =
      historySnapshot.completedAt;

    match.matchHistory =
      historySnapshot;

    match.lastUpdated = new Date();

    await match.save();

    // ============================================
    // EMIT REAL-TIME UPDATE
    // ============================================

    req.emit(
      "scoreUpdated",
      match
    );

    // ============================================
    // RESPONSE
    // ============================================

    res.status(200).json({
      success: true,
      message:
        "Match ended and history saved successfully",

      match,

      history:
        historySnapshot,
    });
  } catch (error) {
    console.error(
      "End match error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// =========================================================
// UNDO LAST POINT
// =========================================================
router.post("/:eventId/undo", async (req, res) => {
  try {
    const match = await Match.findOne({
      eventId: Number(req.params.eventId),
      status: "Live",
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Live match not found",
      });
    }

    const currentSetIndex = match.sets.findIndex(
      (set) => set.number === match.currentSet
    );

    if (currentSetIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Current set not found",
      });
    }

    // -----------------------------------------
    // Get last point
    // -----------------------------------------
    const lastPoint =
      match.pointHistory[match.pointHistory.length - 1];

    if (!lastPoint) {
      return res.status(400).json({
        success: false,
        message: "No point available to undo",
      });
    }

    // Make sure last point belongs to current set
    if (lastPoint.set !== match.currentSet) {
      return res.status(400).json({
        success: false,
        message: "Cannot undo a point from a finished set",
      });
    }

    // -----------------------------------------
    // Remove point
    // -----------------------------------------
    if (lastPoint.team === "ait") {
      if (match.aitPoints <= 0) {
        return res.status(400).json({
          success: false,
          message: "AIT score cannot go below zero",
        });
      }

      match.aitPoints -= 1;
      match.sets[currentSetIndex].ait -= 1;
    }

    if (lastPoint.team === "opponent") {
      if (match.opponentPoints <= 0) {
        return res.status(400).json({
          success: false,
          message: "Opponent score cannot go below zero",
        });
      }

      match.opponentPoints -= 1;
      match.sets[currentSetIndex].opponent -= 1;
    }

    // Remove last history item
    match.pointHistory.pop();

    match.lastUpdated = new Date();

    await match.save();

    console.log("↩️ LAST POINT UNDONE");
    console.log("Team:", lastPoint.team);
    console.log("Set:", match.currentSet);
    console.log(
      "Score:",
      match.aitPoints,
      "-",
      match.opponentPoints
    );

    // -----------------------------------------
    // Broadcast
    // -----------------------------------------
    io.emit("scoreUpdated", match);

    res.status(200).json({
      success: true,
      message: `Last ${lastPoint.team} point undone`,
      match,
    });
  } catch (error) {
    console.error("❌ Undo point error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to undo last point",
      error: error.message,
    });
  }
});

// =========================================================
// FINISH CURRENT SET
// =========================================================

router.post("/:eventId/finish-set", async (req, res) => {
  try {
    const match = await Match.findOne({
      eventId: Number(req.params.eventId),
      status: "Live",
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Live match not found",
      });
    }

    // -----------------------------------------------------
    // Find current set
    // -----------------------------------------------------

    const currentSetIndex = match.sets.findIndex(
      (set) => set.number === match.currentSet
    );

    if (currentSetIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Current set not found",
      });
    }

    const currentSet = match.sets[currentSetIndex];

    // -----------------------------------------------------
    // Make sure current set is actually live
    // -----------------------------------------------------

    if (currentSet.status !== "Live") {
      return res.status(400).json({
        success: false,
        message: "Current set is not live",
      });
    }

    // -----------------------------------------------------
    // Don't allow empty set
    // -----------------------------------------------------

    if (
      currentSet.ait === 0 &&
      currentSet.opponent === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot finish a set with 0-0 score",
      });
    }

    // -----------------------------------------------------
    // Mark current set as FINISHED
    // -----------------------------------------------------

    currentSet.status = "Finished";

    // -----------------------------------------------------
    // Determine set winner
    // -----------------------------------------------------

    if (currentSet.ait > currentSet.opponent) {
      match.aitSetsWon += 1;
    } else if (currentSet.opponent > currentSet.ait) {
      match.opponentSetsWon += 1;
    } else {
      return res.status(400).json({
        success: false,
        message: "A set cannot finish with a tie.",
      });
    }

    // -----------------------------------------------------
    // Create next set
    // -----------------------------------------------------

    const nextSetNumber = match.currentSet + 1;

    match.sets.push({
      number: nextSetNumber,
      ait: 0,
      opponent: 0,
      status: "Live",
    });

    // -----------------------------------------------------
    // Move to next set
    // -----------------------------------------------------

    match.currentSet = nextSetNumber;

    // Reset live points
    match.aitPoints = 0;
    match.opponentPoints = 0;

    // Reset point history for the new set
    //match.pointHistory = [];

    match.lastUpdated = new Date();

    await match.save();

    console.log("🏐 SET FINISHED");
    console.log(
      `Set ${currentSet.number}:`,
      currentSet.ait,
      "-",
      currentSet.opponent
    );

    console.log(
      "Sets Won:",
      match.aitSetsWon,
      "-",
      match.opponentSetsWon
    );

    console.log(
      "Starting Set:",
      match.currentSet
    );

    // -----------------------------------------------------
    // Broadcast updated match
    // -----------------------------------------------------

    io.emit("scoreUpdated", match);

    res.status(200).json({
      success: true,
      message: `Set ${currentSet.number} finished`,
      match,
    });

  } catch (error) {
    console.error("❌ Finish set error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to finish set",
      error: error.message,
    });
  }
});

return router;
};
module.exports = createMatchRoutes;