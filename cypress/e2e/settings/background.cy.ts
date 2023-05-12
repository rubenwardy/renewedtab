describe("Background", () => {
	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
	});

	it("can change background type", () => {
		cy.selectPreset("focus");

		cy.get("#open-settings").click();

		cy.get(".modal #tab-Background").click();
		cy.get("input[name='mode'][value='Color']").click();
		cy.get(".btn.modal-close").click();

		cy.get("#background").then(($bg) => {
			expect($bg[0].style.backgroundImage).to.eq("");
			expect($bg[0].style.backgroundColor).to.not.eq("");
		});
	});
});
