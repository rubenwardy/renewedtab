import { Widget } from "../../support/components/Widget";
import { mockBrowserAPIs } from "../../support/browser";


const testBookmarks = [
	{
		id: "1",
		title: "One",
		url: "https://example.com/",
	},
	{
		id: "2",
		title: "Two",
		url: "https://example.com/",
	},
	{
		id: "100",
		title: "Folder",
		children: [
			{
				id: "3",
				title: "Three",
				url: "https://example.com/",
			},
			{
				id: "4",
				title: "Four",
				url: "https://example.com/",
			},
		],
	},
];


describe("Bookmarks", () => {
	it("see bookmarkss", () => {
		const { config, setBookmarks } = mockBrowserAPIs();
		setBookmarks(testBookmarks);
		cy.visit("/dist/webext/app/index.html", config);
		cy.selectPreset("focus");
		cy.createWidget("Bookmarks");

		const widget = new Widget(3);
		widget.get(".iconbar li").should("have.length", 2);
		widget.get().contains("One");
		widget.get().contains("Two");

		widget.edit();
		cy.get("[name='includeFolders']").check();
		cy.getCy("edit-ok").click();
		widget.get(".iconbar li").should("have.length", 5);

		widget.get().contains("Folder");
		widget.get().contains("Three");
		widget.get().contains("Four");
	});

	it("global search", () => {
		const { config, setBookmarks } = mockBrowserAPIs();
		setBookmarks(testBookmarks);
		cy.visit("/dist/webext/app/index.html", config);
		cy.selectPreset("focus");
		cy.createWidget("Bookmarks");

		const search = new Widget(2);
		const bookmarks = new Widget(3);

		bookmarks.get(".iconbar li").should("have.length", 2);
		search.get("input").type("two");
		bookmarks.get(".iconbar li").should("have.length", 1);
		search.get("input").type("asdf");
		bookmarks.get().contains("No results");
	});
});
