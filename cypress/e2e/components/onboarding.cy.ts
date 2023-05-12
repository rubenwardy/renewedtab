describe("Onboarding", () => {
	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
	});

	it("can change language", () => {
		cy.contains("Welcome to Renewed Tab");
		cy.get("select[name='locale']").select("fr");
		cy.contains("Bienvenue sur Renewed Tab");
		cy.reload().then(() => {
			cy.contains("Bienvenue sur Renewed Tab");
		});
	});

	it("has presets, choose focus", () => {
		cy.contains("Welcome to Renewed Tab");
		cy.get(".carousel-next").click();

		cy.contains("Drag and Drop Widgets");
		cy.get(".carousel-next").click();

		cy.contains("Choose a Starting Point");
		cy.contains("Focus");
		cy.contains("Grid");
		cy.contains("Goals");
		cy.getCy("preset-focus").click();

		cy.get(".modal").should("not.exist");
		cy.get(".widget").should("have.length", 2);
	});

	it("has presets, choose grid", () => {
		cy.contains("Welcome to Renewed Tab");
		cy.get(".carousel-next").click();

		cy.contains("Drag and Drop Widgets");
		cy.get(".carousel-next").click();

		cy.contains("Choose a Starting Point");
		cy.contains("Focus");
		cy.contains("Grid");
		cy.contains("Goals");
		cy.getCy("preset-grid").click();

		cy.get(".modal").should("not.exist");
		cy.get(".widget").should("have.length", 8);
	});

	it("can import from .json", () => {
		const filepath = "tests/data/saves/mine.json";

		cy.contains("Welcome to Renewed Tab");
		cy.get(".carousel-next").click();

		cy.contains("Drag and Drop Widgets");
		cy.get(".carousel-next").click();

		cy.contains("Choose a Starting Point");
		cy.get("input[name='import-file']").selectFile(filepath, { force: true });

		cy.get(".modal").should("not.exist");
		cy.get(".widget").should("have.length", 10);
	});
});
