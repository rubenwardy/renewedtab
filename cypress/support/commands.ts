/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************


declare namespace Cypress {
	interface Chainable {
		getCy(id: string): Chainable<Subject>;
		skipAnalyticsConsent(): Chainable<void>;
		selectPreset(id: string): Chainable<void>;
		createWidget(id: string): Chainable<void>;
	}
}


Cypress.Commands.add("getCy", (selector, ...args) => {
	return cy.get(`[data-cy=${selector}]`, ...args)
});


Cypress.Commands.add("skipAnalyticsConsent", () => {
	cy.get(".modal-body").then($body => {
		if ($body.text().includes("Help Improve Renewed Tab")) {
			cy.getCy("analytics-deny").click();
		}
	});
});


Cypress.Commands.add("selectPreset", (id: string) => {
	cy.contains("Welcome to Renewed Tab");
	cy.get(".carousel-next").click();
	cy.skipAnalyticsConsent();

	cy.contains("Drag and Drop Widgets");
	cy.get(".carousel-next").click();

	cy.contains("Choose a Starting Point");
	cy.getCy(`preset-${id}`).click();

	cy.get(".modal").should("not.exist");
});


Cypress.Commands.add("createWidget", (id: string) => {
	cy.get("#add-widget").click();
	cy.get(`[data-widget-type='${id}']`).click();
});
