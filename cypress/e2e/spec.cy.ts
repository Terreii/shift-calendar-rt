/* eslint-disable jest/expect-expect */

import {
  shiftModelText,
  shiftModelNames,
  monthNames,
} from "../../lib/constants";
import { shift44Name } from "../../config/shifts";

describe("basic usage", () => {
  it("should have all shift models on index", () => {
    cy.visit("http://localhost:3000/");

    for (const key of shiftModelNames) {
      const name = shiftModelText[key];
      cy.contains("main a", name)
        .should("have.attr", "href")
        .and("include", key);
    }
    cy.contains("main a", shift44Name).should("not.exist");
  });

  it("should redirect a user to their last viewed shift model on /?pwa", () => {
    const shiftModel =
      shiftModelNames[Math.floor(Math.random() * shiftModelNames.length)];
    cy.visit("/?pwa");
    cy.contains(shiftModelText[shiftModel]).click();
    cy.url().should("include", "/cal/" + shiftModel);

    cy.visit("/?pwa");
    cy.url().should("include", "/cal/" + shiftModel);
  });

  it("visit impressum", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Impressum").click();

    cy.url().should("include", "/impressum");
    cy.contains("h3", "Verantwortlicher");

    cy.get("header h1").click();
    cy.url().should("not.include", "/impressum");
  });
});

describe("download", () => {
  it("should be accessable by the calendars", () => {
    cy.visit(
      `http://localhost:3000/cal/${
        shiftModelNames[Math.floor(Math.random() * shiftModelNames.length)]
      }`,
    );
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(250); // needed because it has to render the next month after load.
    cy.contains("Es gibt mehr Download-Optionen!").click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(250);
    cy.url().should("include", "/download");

    const now = new Date();
    const href = `/api/excel_export/all/${now.getFullYear()}/${
      now.getMonth() + 1
    }`;
    cy.contains(
      `Alle Schichten für ${
        monthNames[now.getMonth()]
      } ${now.getFullYear()} als Tabelle:`,
    )
      .next()
      .should("have.attr", "href")
      .and("include", href);

    cy.get("header h1").click();
    cy.url().should("not.include", "/download");
  });

  it("should have a year calendar for every shift model", () => {
    cy.visit("http://localhost:3000/download");
    const year = new Date().getFullYear();

    for (const name of shiftModelNames) {
      cy.contains(shiftModelText[name] + ":")
        .next()
        .should("have.attr", "href")
        .and("include", `/api/excel_export/shift/${name}/${year}`);
    }
  });
});
