import { Widget } from "../../support/components/Widget";


describe("Website icons", () => {
	let iconsURL: string;

	before(() => {
		cy.readFile("config.json").then(config => {
			iconsURL = config.WEBSITE_ICONS_URL;
			expect(iconsURL, "WEBSITE_ICONS_URL in config.json").to.be.a("string").and.not.be.empty;
		});
	});

	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
		cy.selectPreset("focus");
	});

	it("shows website icons by default", () => {
		cy.intercept(`${iconsURL}**`, { statusCode: 404 }).as("websiteIcon");

		cy.createWidget("Links");
		cy.wait("@websiteIcon");

		const widget = new Widget(3);
		widget.edit();
		cy.getCy("field-useWebsiteIcons").should("exist");
	});

	it("can disable website icons", () => {
		cy.get("#open-settings").click();
		cy.get("input[name='disable-website-icons']").check();
		cy.get(".btn.modal-close").click();

		let requests = 0;
		cy.intercept(`${iconsURL}**`, req => {
			requests++;
			req.reply(404);
		});

		cy.reload();
		cy.createWidget("Links");
		cy.get(".link-item[data-title]").should("have.length.at.least", 1);

		const widget = new Widget(3);
		widget.edit();
		cy.getCy("field-links").should("exist");
		cy.getCy("field-useWebsiteIcons").should("not.exist");

		cy.wait(1000).then(() => {
			expect(requests).to.equal(0);
		});
	});
});
