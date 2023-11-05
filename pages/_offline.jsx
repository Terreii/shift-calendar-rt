import Head from "next/head";
import Link from "next/link";

import style from "../styles/calendar.module.css";
import offlineStyles from "../styles/offline.module.css";
import formStyles from "../styles/form.module.css";

export default function Offline() {
  return (
    <main className={style.main}>
      <Head>
        <title>Schichtkalender für Bosch Reutlingen</title>
      </Head>

      <div className={offlineStyles.container}>
        <div className={offlineStyles.border}>
          <string className={offlineStyles.header}>Du bist offline!</string>

          <p className={offlineStyles.text}>
            Es sieht so aus als ob du offline bist.
          </p>
        </div>
        <Link href="/?pwa" className={formStyles.accept_button} replace>
          Neu laden?
        </Link>
      </div>
    </main>
  );
}
