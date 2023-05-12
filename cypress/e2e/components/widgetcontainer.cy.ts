import { Widget } from "../../support/components/Widget";

describe("WidgetContainer", () => {
	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
	});

	it("can delete", () => {
		cy.selectPreset("focus");

		const widget = new Widget(1);
		widget.delete();

		cy.getCy("delete").click();
		widget.get().should("not.exist");
	});

	it("can edit", () => {
		cy.selectPreset("focus");

		const widget = new Widget(1);
		widget.edit();

		cy.contains("Edit Clock");
		cy.get("[name='showPanelBG']").click();
		cy.getCy("edit-ok").click();

		widget.get(".panel").should("exist");
	});

	it("can duplicate", () => {
		cy.selectPreset("focus");
		cy.get(".widget").should("have.length", 2);

		const widget = new Widget(1);
		widget.duplicate();

		cy.get(".widget").should("have.length", 3);
	});
});
