require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = require("./config/db");
const Match = require("./models/Match");

const createTestMatch = async () => {
  try {
    await connectDB();

    const match = await Match.findOneAndUpdate(
      { eventId: 5 },
      {
        eventId: 5,
        title: "AIT Volleyball Championship",
        competition: "AIT Volleyball Championship",
        venue: "AIT Main Volleyball Court",
        opponent: "CAMPUS XI",
        format: "Best of 5",
        round: "Final",
        status: "Live",

        currentSet: 4,

        aitSetsWon: 2,
        opponentSetsWon: 1,

        aitPoints: 18,
        opponentPoints: 14,

        sets: [
          {
            number: 1,
            ait: 25,
            opponent: 21,
            status: "Finished",
          },
          {
            number: 2,
            ait: 21,
            opponent: 25,
            status: "Finished",
          },
          {
            number: 3,
            ait: 25,
            opponent: 19,
            status: "Finished",
          },
          {
            number: 4,
            ait: 18,
            opponent: 14,
            status: "Live",
          },
        ],

        highlights: [
          "Championship Final",
          "Best of 5",
          "Home Court",
        ],

        lastUpdated: new Date(),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    console.log("Match saved successfully!");
    console.log(match);

    process.exit(0);
  } catch (error) {
    console.error("Error saving match:");
    console.error(error);
    process.exit(1);
  }
};

createTestMatch();