/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { TZDate } from "@date-fns/tz";
import ms from "milliseconds";

import { getDaysInMonth } from "./utils.js";
import ferienData from "./ferien.json";
import ramadan from "./ramadan.json";

const ferien = ferienData.ferien;

/**
 * @typedef {Object} Holidays
 * @property {string}                                  name  Name of the holiday
 * @property {"school"|"closing"|"holiday"|"ramadan"}  type  Type of it.
 * @property {{ name: string, day: number }} [daylightSavingSwitch] Date of daylight Saving time
 */

/**
 * @typedef {Object} DaylightSavingSwitch
 * @property {string}  name  Text that describe the switch.
 * @property {number}  day   Day in month.
 */

/**
 * Get all holidays and school breaks.
 * @param {number} year Year of the month.
 * @param {number} month Month number. With 0 index.
 * @returns {{
 *   [key: string]: Holidays,
 *   daylightSavingSwitch?: DaylightSavingSwitch
 * }}
 */
export default function getHolidays(year, month) {
  const holidays = getSpecialHolidays(year, month);
  const schoolBreaks = getSchoolBreaks(year, month);
  const ramadanData = getRamadan(year, month);

  return {
    ...schoolBreaks,
    ...ramadanData,
    ...holidays,
  };
}

/**
 * Get easter and x-mas. Because those are the only closing days. And get daylight-saving switch.
 * @param {number} year Year of the month.
 * @param {number} month Month number.
 */
function getSpecialHolidays(year, month) {
  switch (month) {
    case 0:
      return {
        1: {
          name: "Neujahr",
          type: "holiday",
        },
      };

    case 2:
    case 3: {
      const easter = getEaster(year); // Is the easter sunday
      // and the number is day since beginning of March
      const dayOfEaster = month === 3 ? easter - 31 : easter; // transform it into a day in month

      const easterData = {
        name: "Ostern",
        type: "closing",
      };

      const data = {};

      for (let i = -2; i < 2; ++i) {
        // All 4 easter days
        const aEasterDay = dayOfEaster + i;
        if (aEasterDay > 0) {
          data[aEasterDay] = easterData;
        }
      }

      if (month === 2) {
        data.daylightSavingSwitch = {
          name: "Zeitumstellung!\r\nEs wird um 1 Stunde vor (von 2 Uhr auf 3 Uhr) gestellt.",
          day: getDaylightSavingDay(year, month),
        };
      }

      return data;
    }

    case 4:
    case 5: {
      const easterDay = getEaster(year) - 31 * (month - 2);

      const dataOfMayJun = [
        {
          date: easterDay + 40,
          name: "Himmelfahrt",
        },
        {
          date: easterDay + 50,
          name: "Pfingsten",
        },
        {
          date: easterDay + 51,
          name: "Pfingsten",
        },
        {
          date: easterDay + 61,
          name: "Fronleichnam",
        },
      ].reduce((monthData, holiday) => {
        if (holiday.date > 0 && holiday.date <= 31) {
          monthData[holiday.date] = {
            name: holiday.name,
            type: "holiday",
          };
        }
        return monthData;
      }, {});

      if (month === 4) {
        dataOfMayJun[1] = {
          name: "Tag der Arbeit",
          type: "holiday",
        };
      }

      return dataOfMayJun;
    }

    case 9:
      return {
        3: {
          name: "Tag der deutschen Einheit",
          type: "holiday",
        },
        daylightSavingSwitch: {
          name: "Zeitumstellung!\r\nEs wird um 1 Stunde zurück (von 3 Uhr auf 2 Uhr) gestellt.",
          day: getDaylightSavingDay(year, month),
        },
      };

    case 10:
      return {
        1: {
          name: "Allerheiligen",
          type: "holiday",
        },
      };

    case 11: {
      const xmasData = {
        name: "Weihnachten",
        type: "closing",
      };
      return {
        24: xmasData,
        25: xmasData,
        26: xmasData,
        31: {
          name: "Silvester",
          type: "holiday",
        },
      };
    }

    default:
      return {};
  }
}

/**
 * Combines closing days with school holidays data for Baden-Württemberg
 * @param {Number} year Year of that month
 * @param {Number} month Month in year
 */
function getSchoolBreaks(year, month) {
  month += 1; // go to 1 to 12 month indexing

  const schoolBreaks = ferien
    .filter((holiday) => {
      // Filter out all school holidays
      const [startYear, startMonth] = holiday.start;
      const [endYear, endMonth] = holiday.end;

      return (
        (startYear === year && startMonth === month) || // if it starts in this month
        (endYear === year && endMonth === month) || // if it ends in this month
        (startYear === endYear && startMonth < month && endMonth > month)
      ); // summer holidays
    })
    .reduce((monthData, holiday) => {
      // select the start and end of the for loop
      const start = holiday.start[1] === month ? holiday.start[2] : 1;
      const end =
        holiday.end[1] === month
          ? holiday.end[2]
          : getDaysInMonth(year, month - 1);
      const data = {
        name: holiday.name,
        type: "school",
      };

      // apply holiday data to the month data
      for (let i = start; i <= end; ++i) {
        monthData[i] = data;
      }

      return monthData;
    }, {});

  return schoolBreaks;
}

/**
 * Get the start and end date of Ramadan. Source https://www.ramadan.de/wann-ist-ramadan/
 *
 * Ramadan is 30 days, followed by Idul-Fitr.
 * @param {number} year Year of the Month.
 * @param {number} month Month number. Zero indexed.
 */
function getRamadan(year, month) {
  const ramadanData = {};
  const thisYearRamadanData = ramadan[year];

  if (thisYearRamadanData == null) {
    return ramadanData;
  }
  const startMonth = thisYearRamadanData.month - 1;
  const startDay = thisYearRamadanData.day;
  const start = new TZDate(
    year,
    startMonth,
    startDay,
    12,
    0,
    0,
    "Europe/Berlin",
  );
  const end = new TZDate(start.getTime() + ms.days(30), "Europe/Berlin");
  const idulFitr = new TZDate(end.getTime() + ms.days(1), "Europe/Berlin");

  if (startMonth === month) {
    ramadanData[startDay] = {
      name: "Ramadan Start\r\nErster Fastentag",
      type: "ramadan",
    };
  }
  if (end.getMonth() === month) {
    ramadanData[end.getDate()] = {
      name: "Ramadan Ende\r\nLetzter Fastentag",
      type: "ramadan",
    };
  }
  if (idulFitr.getMonth() === month) {
    ramadanData[idulFitr.getDate()] = {
      name: "Fest des Ramadan Fastenbrechens\r\n\r\nIdul-Fitr / Ramazan Bayram",
      type: "ramadan",
    };
  }

  return ramadanData;
}

/**
 * Gauss's Easter algorithm  https://en.wikipedia.org/wiki/Computus#Gauss's_Easter_algorithm
 * @param {number} year Year of that easter
 */
function getEaster(year) {
  const k = Math.floor(year / 100);
  const M = 15 + k - Math.floor(k / 3) - Math.floor(k / 4);
  const N = 5;
  const a = Math.round(afterDot(year / 19) * 19);
  const b = Math.round(afterDot(year / 4) * 4);
  const c = Math.round(afterDot(year / 7) * 7);
  const d = Math.round(afterDot((19 * a + M) / 30) * 30);
  const e = Math.round(afterDot((2 * b + 4 * c + 6 * d + N) / 7) * 7);
  return 22 + d + e;
}

/**
 * Returns the post dot part of a number.
 * @param {number} number Decimal number
 * @returns {number}
 */
function afterDot(number) {
  // 1.1 - 1.0 = 0.1
  return number - Math.floor(number);
}

/**
 * Get the day of the daylight saving switch in a year and month.
 * @param {number} year Full Year number
 * @param {number} month Month number in the year
 * @returns {number} Day in month of the switch, or -1
 */
function getDaylightSavingDay(year, month) {
  if (month !== 2 && month !== 9) return -1;

  const lastDay = new TZDate(year, month, 31, "Europe/Berlin").getDay();
  // sunday is 0, all other a >0, and therefore show how many days since the last sunday did pass.
  return 31 - lastDay;
}
