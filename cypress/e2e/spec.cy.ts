/* eslint-disable jest/expect-expect */

import { shiftModelText } from "../../lib/constants";

describe("basic usage", () => {
  it("should have all shift models on index", () => {
    cy.visit("http://localhost:3000/");

    for (const [key, name] of Object.entries(shiftModelText)) {
      cy.contains("main a", name)
        .should("have.attr", "href")
        .and("include", key);
    }
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
