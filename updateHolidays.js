/*
 * Load Baden-Württemberg holidays from https://www.schulferien.org/
 * and saves them at ./src/lib/ferien.json
 *
 * First load iCal from https://www.schulferien.org/deutschland/ical/
 */

import fs from "node:fs/promises";
import path from "node:path";

import iCal from "node-ical";
import prompt from "prompt";

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
      await fs.readFile(outPath, { encoding: "utf8" }),
    );

    const holidays = allHolidays.ferien.filter(
      (event) => event.start[0] > new Date().getFullYear() - 3,
    );

    for (const event of Object.values(iCal.parseFile(result.filePath))) {
      if (typeof event !== "object" || event.type !== "VEVENT") {
        continue;
      }

      const year = event.start.getFullYear();
      const name = event.summary.split(/\s/)[0];

      const exists = allHolidays.ferien.findIndex((event) => {
        return event.year === year && event.name === name;
      });

      const toDateArray = (date) => [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      ];

      if (exists < 0) {
        holidays.push({
          start: toDateArray(event.start),
          end: toDateArray(event.end),
          stateCode: "BW",
          name,
        });
      }
    }

    holidays.sort((a, b) => {
      const aStart = a.start.join("-");
      const bStart = b.start.join("-");
      if (aStart < bStart) return -1;
      if (aStart > bStart) return 1;
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
    await fs.writeFile(outPath, ferienJSON);
  },
);
