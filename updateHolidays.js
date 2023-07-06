"use strict";

/*
 * Load Baden-Württemberg holidays from https://www.schulferien.org/
 * and saves them at ./src/lib/ferien.json
 *
 * First load iCal from https://www.schulferien.org/deutschland/ical/
 */

const fs = require("fs");
const path = require("path");

const iCal = require("node-ical");
const prompt = require("prompt");

prompt.get(
  [
    {
      name: "filePath",
      required: true,
      type: "string",
      description: "Please enter the path to the iCal",
    },
  ],
  async (err, result) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const outPath = path.resolve("lib", "ferien.json");
    const allHolidays = JSON.parse(
      await fs.promises.readFile(outPath, { encoding: "utf8" }),
    );

    const holidays = allHolidays.ferien.filter((event) => event.year > 2018);

    for (const event of Object.values(iCal.parseFile(result.filePath))) {
      if (typeof event !== "object" || event.type !== "VEVENT") {
        continue;
      }

      const year = event.start.getFullYear();
      const name = event.summary.split(/\s/)[0];

      const exists = allHolidays.ferien.findIndex((event) => {
        return event.year === year && event.name === name;
      });

      if (exists < 0) {
        holidays.push({
          start: event.start.toISOString(),
          end: event.end.toISOString(),
          year,
          stateCode: "BW",
          name,
          slug: event.summary,
        });
      }
    }

    holidays.sort((a, b) => {
      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;
      return 0;
    });

    const ferienJSON =
      JSON.stringify(
        {
          lastUpdate: new Date().toJSON(),
          ferien: holidays,
        },
        null,
        2,
      ) + "\n";
    await fs.promises.writeFile(outPath, ferienJSON);
  },
);
