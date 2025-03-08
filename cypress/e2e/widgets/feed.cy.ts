import { Widget } from "../../support/components/Widget";


describe("Feed", () => {
	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
		cy.selectPreset("focus");
		cy.createWidget("Feed");
	});

	it("add source by URL", () => {
		const widget = new Widget(3);
		widget.edit();

		cy.getCy("field-sources").find("tbody tr").should("have.length", 2);
		cy.getCy("field-sources").find("[data-cy='add-row']").click();
		cy.getCy("field-sources").find("tbody tr").should("have.length", 3);
		cy.getCy("field-sources").find("[name='url'][value=''], [name='url']:not([value])")
			.type("https://www.nasa.gov/rss/dyn/breaking_news.rss");
		cy.getCy("edit-ok").click();
		cy.contains("www.nasa.gov").click();
		cy.contains("NASA");
	});

	it("import OPML", () => {
		const widget = new Widget(3);
		widget.edit();

		cy.getCy("field-sources").find("tbody tr").should("have.length", 2);

		const filepath = "tests/data/feeds/feedly.opml";
		cy.get("input[name='import-file']").selectFile(filepath, { force: true });

		cy.getCy("field-sources").find("tbody tr").should("have.length", 12);
		cy.getCy("edit-ok").click();

		widget.get().should("exist");
		cy.contains("Adafruit Industries");
		cy.contains("CSS-Tricks");
	});

	it("export OPML", () => {
		const widget = new Widget(3);
		widget.edit();

		cy.getCy("field-sources").find("tbody tr").should("have.length", 2);

		cy.getCy("export-opml").click();
		cy.readFile(`cypress/downloads/renewedtab-feeds.opml`);
	});

	it("combine feeds", () => {
		const widget = new Widget(3);

		widget.get(".tabs").should("exist");

		widget.edit();

		cy.get("[name='combineSources']").check();
		cy.getCy("edit-ok").click();

		widget.get().should("exist");
		widget.get(".tabs").should("not.exist");
		widget.get(".links").contains("The Register");
		widget.get(".links").contains("BBC News");
	});

	it("global search", () => {
		const search = new Widget(2);
		const feed = new Widget(3);

		// As the data isn't fixed, it's hard to search for a specific thing
		// here, so we just search to get no results.

		feed.get(".links li").should("have.length.gt", 1);
		search.get("input").type("sdkfjbsdkfjbasdkjfbasdf")
		feed.get(".links li").should("have.length", 1);
		feed.get().contains("No results");
	});
});
