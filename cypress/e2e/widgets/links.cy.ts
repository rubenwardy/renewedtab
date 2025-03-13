import { Widget } from "../../support/components/Widget";


describe("Links", () => {
	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
		cy.selectPreset("focus");
		cy.createWidget("Links");
	});

	it("import links from save", () => {
		const widget = new Widget(3);
		widget.edit();

		cy.getCy("field-links").find("tbody tr").should("have.length", 5);

		const filepath = "src/test_data/saves/mine.json";
		cy.get("input[name='import-file']").selectFile(filepath, { force: true });

		cy.getCy("field-links").find("tbody tr").should("have.length", 8);
	});

	it("export links", () => {
		const widget = new Widget(3);
		widget.edit();

		cy.getCy("field-links").find("tbody tr").should("have.length", 5);

		cy.getCy("export-links").click();
		cy.readFile(`cypress/downloads/renewedtab-links.json`);
	});

	it.skip("import links from infinity", () => {
		const widget = new Widget(3);
		widget.edit();

		for (let i = 0; i < 5; i++) {
			cy.getCy("field-links").find("tr:first-child .btn.btn-danger").click();
		}

		cy.getCy("field-links").find("tbody tr").should("have.length", 1);
		cy.getCy("field-links").find("tbody tr").contains("Nothing here");

		const filepath = "src/test_data/imports/example.infinity";
		cy.get("input[name='import-file']").selectFile(filepath, { force: true });

		cy.getCy("field-links").find("tbody tr").should("have.length", 4);

		cy.getCy("field-links").find("tbody tr:nth-child(1) td:nth-child(2) input").should("have.value", "Example 1");
		cy.getCy("field-links").find("tbody tr:nth-child(2) td:nth-child(2) input").should("have.value", "Example 3");
		cy.getCy("field-links").find("tbody tr:nth-child(3) td:nth-child(2) input").should("have.value", "Folder");
		cy.getCy("field-links").find("tbody tr:nth-child(4) td:nth-child(2) input").should("have.value", "Example 2");
	});
});
