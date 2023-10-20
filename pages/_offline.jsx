import { useState, useEffect } from "react";
import Head from "next/head";

import ByMonths from "../components/by-month";
import Legend from "../components/legend";
import { useTodayZeroIndex } from "../hooks/time";
import { shift66Name, shiftModelText } from "../lib/constants";

import style from "../styles/calendar.module.css";
import offlineStyles from "../styles/offline.module.css";

export default function Offline() {
  const today = useTodayZeroIndex();
  const year = today[0];
  const month = today[1];
  const { model, group } = useShift();

  return (
    <main className={style.main}>
      <Head>
        <title>
          {`Monat ${year}-${String(month + 1).padStart(2, "0")} - ${
            shiftModelText[model]
          } - Schichtkalender für Bosch Reutlingen`}
        </title>
      </Head>

      <Legend />

      <div className={offlineStyles.container}>
        <string className={offlineStyles.header}>Du bist offline!</string>

        <p className={offlineStyles.text}>
          Es sieht so aus als ob du offline bist.
          <br />
          Dieser Kalender funktioniert <em>auch offline</em>, aber der
          Funktionsumfang ist eingeschränkt.
          <br />
          Z.B. wird nur dein aktueller Monat angezeigt.
        </p>
      </div>

      <ByMonths
        shiftModel={model}
        group={group}
        search={null}
        year={year}
        month={month}
        today={today}
      />
    </main>
  );
}

function useShift() {
  const [shift, setShift] = useState({
    model: shift66Name,
    group: 0,
  });
  useEffect(() => {
    const settings = JSON.parse(window.localStorage.getItem("settings")) ?? {};
    if (settings.didSelectModel) {
      setShift({ model: settings.shiftModel, group: settings.group });
    }
  }, []);
  return shift;
}
