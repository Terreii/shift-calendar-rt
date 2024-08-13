/*
License:

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of
the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { useState, useEffect, useRef } from "preact/hooks";
import ms from "milliseconds";

import Confirm from "./Confirm";

import addOutline from "bootstrap-icons/icons/plus-circle.svg";
import iOSShare from "../../assets/ios-share.png";
import iOSAddToHome from "../../assets/ios-add-to-home-screen.png";

/**
 * Renders an install button for add-to-home-screen of PWA.
 */
export default function InstallButton() {
  const [show, setShow] = useState("none");
  const deferredPrompt = useRef(null);

  useEffect(() => {
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isInStandaloneMode =
      "standalone" in window.navigator && window.navigator.standalone;
    const dismissedTime = new Date(
      window.localStorage.getItem("dismissedInstallMessage") ?? 0,
    ).getTime();

    if (
      isIos &&
      !isInStandaloneMode &&
      dismissedTime < Date.now() - ms.days(12)
    ) {
      setTimeout(setShow, ms.seconds(15), "ios");
    } else {
      const handler = (event) => {
        // for Chrome 67 and earlier
        event.preventDefault();

        // Stash the event so it can be triggered later.
        deferredPrompt.current = event;

        if (dismissedTime < Date.now() - ms.days(12)) {
          setTimeout(setShow, ms.seconds(15), "popup");
        }
      };

      /**
       * Event from the browser, that the Web-App can be installed.
       */
      window.addEventListener("beforeinstallprompt", handler);
      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }
  }, []);

  useEffect(() => {
    // Handling updates
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox != null
    ) {
      const wb = window.workbox;

      const promptNewVersionAvailable = () => {
        // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated
        // service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is
        // still waiting.

        // Ask for reloading?
        // The update process takes to long after hitting update.
        // Deactivated for now.
        // setShow('update')
        wb.addEventListener("controlling", () => {
          window.location.reload();
        });

        // Send a message to the waiting service worker, instructing it to activate.
        wb.messageSW({ type: "SKIP_WAITING" });
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);
      wb.addEventListener("externalwaiting", promptNewVersionAvailable);
    }
  }, []);

  const onClickInstallButton = () => {
    setShow("none");

    if (deferredPrompt.current == null) return;

    // Show the prompt
    deferredPrompt.current.prompt();

    // Install
    deferredPrompt.current.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt");
      } else {
        console.log("User dismissed the A2HS prompt");
      }

      deferredPrompt.current = null;
      setShow("none");
    });
  };

  const dismiss = () => {
    window.localStorage.setItem("dismissedInstallMessage", new Date().toJSON());
    setShow("none");
  };

  switch (show) {
    case "popup":
      return (
        <Confirm
          confirmText={
            <>
              <img src={addOutline} height="25" width="25" alt="" />
              <span>Installieren</span>
            </>
          }
          onClick={(confirmed) => {
            if (confirmed) {
              onClickInstallButton();
            } else {
              dismiss();
            }
          }}
        >
          <p>
            Dieser Kalender kann wie eine <em>App installiert</em> werden!
            <br />
            <br />
            Klicke auf <strong>Installieren</strong> um ihn bei deinen Apps zu
            speichern. Mit <strong>Abbrechen</strong> wirst du für 12 Tage nicht
            mehr danach gefragt.
          </p>
        </Confirm>
      );

    case "ios":
      return (
        <div class="sticky bottom-0 z-10 flex w-full flex-col items-center border-0 border-t border-gray-200 bg-white shadow-lg pb-safe px-safe-offset-2 sm:bottom-1 sm:left-1 sm:max-w-96 sm:rounded sm:border sm:mb-safe sm:ml-safe">
          <span class="my-1 text-center text-sm text-gray-900 mx-safe-offset-16">
            Klicke auf Teilen &amp; dann{" "}
            <strong>&quot;Zum Home-Bildschirm&quot; </strong>
            um den Kalender wie eine App zu installieren:
          </span>
          <div class="mb-1 flex flex-col items-center py-1">
            <img
              class="h-20 rounded object-contain object-center p-1 shadow"
              src={iOSShare}
              alt="klicke Teilen"
            />
            <span class="mx-3 my-auto block">↓</span>
            <img
              class="h-20 rounded object-contain object-center p-1 shadow"
              src={iOSAddToHome}
              alt="klicke Zum Home-Bildschirm"
            />
          </div>
          <CloseButton onClick={dismiss} />
        </div>
      );

    case "update":
      // The update process takes to long after hitting update.
      // Deactivated for now.
      return (
        <Confirm
          confirmText="Neu laden"
          onClick={(confirmed) => {
            if (confirmed && window.workbox) {
              const wb = window.workbox;
              wb.addEventListener("controlling", () => {
                window.location.reload();
              });

              // Send a message to the waiting service worker, instructing it to activate.
              wb.messageSW({ type: "SKIP_WAITING" });
            }
            setShow("none");
          }}
        >
          <p>
            Eine neue Version der Kalender-App ist bereit.
            <br />
            Neu laden um das Update zu aktivieren?
          </p>
        </Confirm>
      );

    case "none":
    default:
      return null;
  }
}

function CloseButton({ onClick }) {
  return (
    <button
      type="button"
      class="absolute top-0 ml-1 border-0 bg-transparent right-safe"
      onClick={onClick}
      aria-label="schließe Meldung"
    >
      <svg
        class="size-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  );
}
