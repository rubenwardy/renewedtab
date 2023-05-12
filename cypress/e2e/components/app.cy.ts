describe("App", () => {
	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
	});

	it("has a title", () => {
		cy.title().should("eq", "Renewed Tab Web");
	});

	it("can lock and unlock", () => {
		cy.selectPreset("focus");
		cy.getCy("edit-bar").should("exist");
		cy.getCy("finish-editing").click();

		cy.getCy("finish-editing").should("not.exist");
		cy.getCy("edit-bar").should("not.exist");

		cy.reload().then(() => {
			cy.getCy("finish-editing").should("not.exist");
			cy.getCy("edit-bar").should("not.exist");

			cy.getCy("start-editing").click();
			cy.getCy("start-editing").should("not.exist");
			cy.getCy("edit-bar").should("exist");
		});
	});
});
