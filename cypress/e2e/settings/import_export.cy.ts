
describe("Import/Export", () => {
	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
	});

	it("can import", () => {
		const filepath = "src/test_data/saves/mine.json";

		cy.selectPreset("focus");

		cy.get("#open-settings").click();
		cy.get(".modal #tab-ImportExport").click();
		cy.get("input[name='import-file']").selectFile(filepath, { force: true });

		cy.get(".modal").should("not.exist");

		cy.get(".widget").should("have.length", 10);
	});

	it("can export", () => {
		cy.selectPreset("focus");

		cy.get("#open-settings").click();
		cy.get(".modal #tab-ImportExport").click();

		cy.getCy("export").click();
		cy.readFile(`cypress/downloads/renewedtab.json`);
	})
});
