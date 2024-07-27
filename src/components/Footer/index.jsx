/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import style from "./style.module.css";

export default function Footer() {
  return (
    <footer>
      <p class={style.container}>
        <b>Der inoffizielle Schichtkalender für Bosch Reutlingen.</b>
        <br />
        Made by Christopher Astfalk.
        <br />
        Dieser Kalender wird{" "}
        <strong>
          <em>nicht</em>
        </strong>{" "}
        von der Robert Bosch GmbH™️ bereitgestellt. Robert Bosch GmbH™️ haftet
        nicht für den Inhalt dieser Seite.
        <br />
        Alle Angaben sind ohne Gewähr.
        <br />
        Alle Daten werden nur lokal gespeichert! Und nicht an einen Server
        übertragen. Deswegen gibt es keine Cookie Meldung.
        <br />
        {"Lizenz: "}
        <a
          href="https://www.mozilla.org/en-US/MPL/2.0/"
          class="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mozilla Public License 2.0
        </a>
        <br />
        <a href="/impressum" class="link">
          Impressum
        </a>
      </p>
    </footer>
  );
}
