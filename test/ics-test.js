import { strict as assert } from "node:assert";
import { test } from "node:test";
import ical from "node-ical";

import { shift66Name } from "../lib/constants.js";

import generate from "../lib/ics_generator.js";

test("ics generation", async (t) => {
  await t.test("should generate ics metadata", (context) => {
    context.mock.timers.enable({
      apis: ["Date"],
      now: new Date(2024, 1, 16, 8, 0, 0).getTime(),
    });

    const icsFile = Array.from(generate(shift66Name, 5 - 1)).join("");
    const calendarData = ical.sync.parseICS(icsFile);

    assert.deepStrictEqual(calendarData.vcalendar, {
      type: "VCALENDAR",
      method: "PUBLISH",
      version: "2.0",
      "WR-CALNAME": "6 - 6 Kontischicht Gruppe 5",
      "WR-TIMEZONE": "Europe/Berlin",
      calscale: "GREGORIAN",
    });
    assert.deepStrictEqual(
      Object.values(calendarData).find((v) => v.type === "VTIMEZONE"),
      {
        method: "PUBLISH",
        params: [],
        type: "VTIMEZONE",
        tzid: "Europe/Berlin",
        end: new Date("2024-02-17T07:00:00.000Z"),
        EU_TIMEZONE_STANDARD: {
          datetype: "date-time",
          end: new Date("1601-10-28T02:06:32.000Z"),
          params: [],
          rrule: "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10",
          start: new Date("1601-10-28T02:06:32.000Z"),
          type: "STANDARD",
          tzoffsetfrom: "+0200",
          tzoffsetto: "+0100",
          uid: "EU_TIMEZONE_STANDARD",
        },
        EU_TIMEZONE_DAYLIGHT: {
          datetype: "date-time",
          end: new Date("1601-03-25T01:06:32.000Z"),
          params: [],
          rrule: "RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3",
          start: new Date("1601-03-25T01:06:32.000Z"),
          type: "DAYLIGHT",
          tzoffsetfrom: "+0100",
          tzoffsetto: "+0200",
          uid: "EU_TIMEZONE_DAYLIGHT",
        },
      },
    );
  });

  await t.test(
    "should generate a ics file with shifts of a group",
    (context) => {
      context.mock.timers.enable({
        apis: ["Date"],
        now: new Date(2024, 1, 16, 8, 0, 0).getTime(),
      });

      const icsFile = Array.from(generate(shift66Name, 5 - 1, 3, 1)).join("");
      const calendarData = ical.sync.parseICS(icsFile);

      const toDate = (string) => {
        const date = new Date(string);
        date.tz = "Etc/UTC";
        return date;
      };
      const base = {
        type: "VEVENT",
        method: "PUBLISH",
        params: [],
        datetype: "date-time",
        location: "Tübingerstraße 123\n72762 Reutlingen\nDeutschland",
        geo: { lat: 48.495252, lon: 9.192696 },
      };

      const firstId = "SHIFT_6-6_GROUP_5_2023-2-3";
      assert.deepStrictEqual(calendarData[firstId], {
        ...base,
        uid: firstId,
        summary: "Frühschicht",
        dtstamp: toDate("2022-02-01T00:00:00.000Z"),
        start: toDate("2023-02-03T06:00:00.000Z"),
        end: toDate("2023-02-03T14:30:00.000Z"),
      });
      const nowId = "SHIFT_6-6_GROUP_5_2024-2-10";
      assert.deepStrictEqual(calendarData[nowId], {
        ...base,
        uid: nowId,
        summary: "Frühschicht",
        dtstamp: toDate("2023-02-01T00:00:00.000Z"),
        start: toDate("2024-02-10T06:00:00.000Z"),
        end: toDate("2024-02-10T14:30:00.000Z"),
      });
      const lastId = "SHIFT_6-6_GROUP_5_2026-1-31";
      assert.deepStrictEqual(calendarData[lastId], {
        ...base,
        uid: lastId,
        summary: "Frühschicht",
        dtstamp: toDate("2025-01-01T00:00:00.000Z"),
        start: toDate("2026-01-31T06:00:00.000Z"),
        end: toDate("2026-01-31T14:30:00.000Z"),
      });
    },
  );
});
