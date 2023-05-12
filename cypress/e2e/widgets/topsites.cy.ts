import { Widget } from "../../support/components/Widget";
import { mockBrowserAPIs } from "../../support/browser";


const testTopSites = [
	{
		title: "GitLab",
		url: "https://gitlab.com",
	},
	{
		title: "GitHub",
		url: "https://github.com",
	},
	{
		title: "Minetest",
		url: "https://www.minetest.net",
	},
	{
		title: "Youtube",
		url: "https://youtube.com",
	},
	{
		title: "Google",
		url: "https://google.com",
	},
	{
		title: "TopSites Test",
		url: "https://en.wikipedia.org",
	},
];


describe("TopSites", () => {
	it("see top sites", () => {
		const { config, setTopSites } = mockBrowserAPIs();
		cy.visit("/dist/webext/app/index.html", config);
		cy.selectPreset("focus");
		cy.createWidget("TopSites");

		const widget = new Widget(3);
		widget.get(".iconbar li").should("not.exist").then(() => {
			setTopSites(testTopSites);
			cy.visit("/dist/webext/app/index.html", config);
			widget.get(".iconbar li").should("have.length", 6);
		});
	});

	it("global search", () => {
		const { config, setTopSites } = mockBrowserAPIs();
		setTopSites(testTopSites);
		cy.visit("/dist/webext/app/index.html", config);
		cy.selectPreset("focus");
		cy.createWidget("TopSites");

		const search = new Widget(2);
		const topsites = new Widget(3);

		topsites.get(".iconbar li").should("have.length", 6);
		search.get("input").type("GitHub");
		topsites.get(".iconbar li").should("have.length", 1);
		search.get("input").type("asdf");
		topsites.get().contains("No results");
	});
});
