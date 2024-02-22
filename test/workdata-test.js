import { strict as assert } from "node:assert";
import { test } from "node:test";
import { readFile } from "node:fs/promises";

import { getMonthData, getGroupMonthData } from "../lib/workdata.js";

import {
  shiftModelNames,
  shift66Name,
  shift64Name,
  shiftWfW,
  rotatingShift,
  shiftAddedNight,
  shiftAddedNight8,
  weekend,
  shiftModelNumberOfGroups,
} from "../lib/constants.js";

test("work data", async (t) => {
  // 2024-06
  const fullMonthData = JSON.parse(
    await readFile(new URL("./workdata.json", import.meta.url), {
      encoding: "utf8",
    }),
  );

  for (const model of shiftModelNames) {
    await t.test(model, async (t) => {
      await t.test("all groups month data", async (t) => {
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

      await t.test("single group workdata", async (t) => {
        for (
          let group = 0, max = shiftModelNumberOfGroups[model];
          group < max;
          group++
        ) {
          await t.test(
            `should calculate all shifts of group ${group + 1} in a month`,
            () => {
              const data = getGroupMonthData(2024, 6, model, group);
              let workingCount = 0;
              const expected = fullMonthData[model].map((day) => {
                if (day[group] !== "K") {
                  workingCount++;
                }
                return day[group];
              });
              assert.deepStrictEqual(data, { days: expected, workingCount });
            },
          );
        }
      });

      await t.test("should handle group bigger then model group count", () => {
        const groupCount = shiftModelNumberOfGroups[model] - 1;
        const expected = getGroupMonthData(2024, 6, model, groupCount);
        const actual = getGroupMonthData(2024, 6, model, groupCount + 1000000);
        assert.deepStrictEqual(actual, expected);
      });

      await t.test("should handle group less then 0", () => {
        const expected = getGroupMonthData(2024, 6, model, 0);
        const actual = getGroupMonthData(2024, 6, model, -1);
        assert.deepStrictEqual(actual, expected);
      });
    });
  }

  await t.test(
    shift66Name + " switches to old model before 2010-04-04",
    async (t) => {
      await t.test("all groups", () => {
        const shiftsBefore = "N K F K S K".split(" ");
        assert.deepStrictEqual(
          getMonthData(2010, 3, shift66Name).days.slice(0, 4),
          [shiftsBefore, shiftsBefore, shiftsBefore, "K S K F N K".split(" ")],
        );
      });

      await t.test("single group", () => {
        const shiftsBefore = "S S S N N K".split(" ");
        assert.deepStrictEqual(
          getGroupMonthData(2010, 3, shift66Name, 5 - 1).days.slice(0, 6),
          shiftsBefore,
        );
      });
    },
  );
});
