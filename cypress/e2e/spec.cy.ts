/* eslint-disable jest/expect-expect */

describe("template spec", () => {
  it("visit impressum", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Impressum").click();

    cy.url().should("include", "/impressum");
    cy.contains("h3", "Verantwortlicher");

    cy.get("header h1").click();
    cy.url().should("not.include", "/impressum");
  });
});
