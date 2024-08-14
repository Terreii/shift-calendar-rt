import { strict as assert } from "node:assert";
import { test } from "node:test";
import { readFile } from "node:fs/promises";

import { getMonthData, getShiftsList } from "../lib/workdata.js";

import { shiftModelNames, shiftModelText } from "../lib/constants.js";
import {
  shift66Name,
  shift64Name,
  shiftWfW,
  rotatingShift,
  shiftAddedNight,
  shiftAddedNight8,
  weekend,
} from "../lib/shifts.js";

test("work data", async (t) => {
  // 2024-06
  const fullMonthData = JSON.parse(
    await readFile(new URL("./workdata.json", import.meta.url), {
      encoding: "utf8",
    }),
  );

  for (const model of shiftModelNames) {
    await t.test(model, async (t) => {
      await t.test("shifts by day", () => {
        const firstDay = {
          [shift66Name]: ["N", "K", "S", "K", "F", "K"],
          [shift64Name]: ["N", "K", "K", "F", "S"],
          [shiftWfW]: ["N", "S", "F", "K", "K", "K"],
          [rotatingShift]: ["K", "K"],
          [shiftAddedNight]: ["K", "N", "N"],
          [shiftAddedNight8]: ["N", "K", "K"],
          [weekend]: ["Normal", "K"],
        };
        assert.deepStrictEqual(
          getMonthData(2023, 10 - 1, model).days[0],
          firstDay[model],
        );

        const day16 = {
          [shift66Name]: ["K", "F", "N", "K", "S", "K"],
          [shift64Name]: ["K", "F", "S", "N", "K"],
          [shiftWfW]: ["K", "N", "S", "F", "K", "K"],
          [rotatingShift]: ["S", "F"],
          [shiftAddedNight]: ["N", "N", "K"],
          [shiftAddedNight8]: ["N", "N", "K"],
          [weekend]: ["K", "Normal"],
        };
        assert.deepStrictEqual(
          getMonthData(2023, 10 - 1, model).days[15],
          day16[model],
        );
      });

      await t.test("full month", () => {
        assert.deepStrictEqual(
          getMonthData(2024, 6, model).days,
          fullMonthData[model],
        );
      });

      await t.test("should return working count", () => {
        const first = {
          [shift66Name]: [14, 17, 16, 15, 18, 13],
          [shift64Name]: [19, 18, 18, 19, 19],
          [shiftWfW]: [14, 16, 18, 17, 15, 13],
          [rotatingShift]: [22, 22],
          [shiftAddedNight]: [19, 17, 18],
          [shiftAddedNight8]: [18, 18, 18],
          [weekend]: [22, 22],
        };
        assert.deepStrictEqual(
          getMonthData(2023, 10 - 1, model).workingCount,
          first[model],
        );

        const second = {
          [shift66Name]: [12, 17, 13, 16, 15, 14],
          [shift64Name]: [18, 18, 17, 17, 17],
          [shiftWfW]: [12, 13, 15, 17, 16, 14],
          [rotatingShift]: [21, 21],
          [shiftAddedNight]: [17, 15, 18],
          [shiftAddedNight8]: [17, 18, 19],
          [weekend]: [21, 21],
        };
        assert.deepStrictEqual(
          getMonthData(2024, 2 - 1, model).workingCount,
          second[model],
        );
      });
    });
  }

  await t.test(`${shift66Name} switches to old model before 2010-04-04`, () => {
    const shiftsBefore = "N K F K S K".split(" ");
    assert.deepStrictEqual(
      getMonthData(2010, 3, shift66Name).days.slice(0, 4),
      [shiftsBefore, shiftsBefore, shiftsBefore, "K S K F N K".split(" ")],
    );
  });

  await t.test("WfW switches to the new model", () => {
    const data = getMonthData(2024, 4 - 1, shiftWfW);
    const workingShifts = [1, 2, 3, 4, 1, 2, 3, 4];
    const base = new Array(4).fill("K");
    const expected = workingShifts.map((group) => {
      // base.with(group - 1, 'X")
      const shift = [...base];
      shift[group - 1] = "X";
      return shift;
    });
    assert.deepStrictEqual(data.days.slice(0, 8), expected);
  });

  await t.test("should export a ics compatible shifts list", () => {
    const data = getShiftsList(shift66Name, 0, 2024);

    assert.deepStrictEqual(data, [
      {
        uid: `bosch-rt-${shift66Name}-frühschicht-2-1@schichtkalender.app`,
        title: "Frühschicht",
        start: [2024, 1, 1, 6, 0],
        duration: { hours: 8, minutes: 30 },
        recurrenceRule: "FREQ=DAILY;INTERVAL=12",
        sequence: 2,
        lastModified: [2024, 8, 14, 20, 0],
        calName: `Bosch Rt ${shiftModelText[shift66Name]}`,
      },
      {
        uid: `bosch-rt-${shift66Name}-frühschicht-2-2@schichtkalender.app`,
        title: "Frühschicht",
        start: [2024, 1, 2, 6, 0],
        duration: { hours: 8, minutes: 30 },
        recurrenceRule: "FREQ=DAILY;INTERVAL=12",
        sequence: 2,
        lastModified: [2024, 8, 14, 20, 0],
        calName: `Bosch Rt ${shiftModelText[shift66Name]}`,
      },
      {
        uid: `bosch-rt-${shift66Name}-spätschicht-2-3@schichtkalender.app`,
        title: "Spätschicht",
        start: [2024, 1, 3, 14, 0],
        duration: { hours: 8, minutes: 30 },
        recurrenceRule: "FREQ=DAILY;INTERVAL=12",
        sequence: 2,
        lastModified: [2024, 8, 14, 20, 0],
        calName: `Bosch Rt ${shiftModelText[shift66Name]}`,
      },
      {
        uid: `bosch-rt-${shift66Name}-spätschicht-2-4@schichtkalender.app`,
        title: "Spätschicht",
        start: [2024, 1, 4, 14, 0],
        duration: { hours: 8, minutes: 30 },
        recurrenceRule: "FREQ=DAILY;INTERVAL=12",
        sequence: 2,
        lastModified: [2024, 8, 14, 20, 0],
        calName: `Bosch Rt ${shiftModelText[shift66Name]}`,
      },
      {
        uid: `bosch-rt-${shift66Name}-nachtschicht-2-5@schichtkalender.app`,
        title: "Nachtschicht",
        start: [2024, 1, 5, 22, 0],
        duration: { hours: 8, minutes: 30 },
        recurrenceRule: "FREQ=DAILY;INTERVAL=12",
        sequence: 2,
        lastModified: [2024, 8, 14, 20, 0],
        calName: `Bosch Rt ${shiftModelText[shift66Name]}`,
      },
      {
        uid: `bosch-rt-${shift66Name}-nachtschicht-2-6@schichtkalender.app`,
        title: "Nachtschicht",
        start: [2024, 1, 6, 22, 0],
        duration: { hours: 8, minutes: 30 },
        recurrenceRule: "FREQ=DAILY;INTERVAL=12",
        sequence: 2,
        lastModified: [2024, 8, 14, 20, 0],
        calName: `Bosch Rt ${shiftModelText[shift66Name]}`,
      },
    ]);
  });
});
