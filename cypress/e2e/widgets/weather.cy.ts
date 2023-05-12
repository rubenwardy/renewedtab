import { Widget } from "../../support/components/Widget";


function mockLocation(latitude: number, longitude: number) {
	return {
		onBeforeLoad(win: any) {
			cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake((cb) => {
				return cb({ coords: { latitude, longitude } });
			});
		}
	};
}


describe("Weather", () => {
	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
		cy.selectPreset("focus");
		cy.createWidget("Weather");
	});

	it("can set location by query", () => {
		const widget = new Widget(3);
		widget.edit();

		cy.getCy("location-edit").click();

		// Search for Pari
		cy.getCy("location-query").type("Paris");
		cy.getCy("location-search").click();

		// Select first result
		cy.get(".locations.links li").should("have.length", 5);
		cy.contains("Paris, Ville de Paris, France").click();

		// Check edit dialog shows Paris
		cy.contains("Paris at 48.8570 by 2.3510");

		// Check widget shows Paris
		cy.getCy("edit-ok").click();
		widget.get().contains("Paris");
	});

	it("can set location by GPS", () => {
		// Mock GPS to be New York
		cy.visit("/dist/webext/app/index.html", mockLocation(40.7128, -74.0060));

		const widget = new Widget(3);
		widget.edit();

		// Search by GPS
		cy.getCy("location-edit").click();
		cy.getCy("location-gps").click();
		cy.contains("New York").click();

		// Check edit dialog shows New York
		cy.contains("Civic Center, New York, United States at 40.7140 by -74.0030");

		// Check widget shows New York
		cy.getCy("edit-ok").click();
		widget.get().contains("New York");
	});

	it("can cancel location editing", () => {
		const widget = new Widget(3);
		widget.edit();

		cy.getCy("location-edit").click();

		// Search for Pari
		cy.getCy("location-query").type("Paris");
		cy.getCy("location-search").click();

		// Select first result
		cy.get(".locations.links li").should("have.length", 5);
		cy.getCy("location-cancel").click();

		// Check edit dialog still shows Bristol
		cy.contains("Bristol at 51.4545 by -2.5879");

		// Check widget shows Bristol
		cy.getCy("edit-ok").click();
		widget.get().contains("Bristol");
	});

	it("can configure display options", () => {
		const widget = new Widget(3);

		cy.getCy("weather-daily").should("exist");
		cy.getCy("weather-hourly").should("not.exist");
		widget.get(".weather-current").should("exist");

		// Show hourly forecast, hide daily
		widget.edit();
		cy.get("[name='showDailyForecast']").uncheck();
		cy.get("[name='showHourlyForecast']").check();
		cy.getCy("edit-ok").click();

		cy.getCy("weather-daily").should("not.exist");
		cy.getCy("weather-hourly").should("exist");

		// Hide current conditions
		widget.edit();
		cy.get("[name='showCurrent']").uncheck();
		cy.getCy("edit-ok").click();

		widget.get(".weather-current").should("not.exist");
	});

	it("can configure theme", () => {
		const widget = new Widget(3);

		widget.get(".panel").should("exist");
		widget.get(".panel-invis").should("not.exist");

		// Hide panel background
		widget.edit();
		cy.get("[name='showPanelBG']").uncheck();
		cy.getCy("edit-ok").click();

		widget.get(".panel").should("not.exist");
		widget.get(".panel-invis").should("exist");
	});
});
