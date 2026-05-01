
const widgetTypes = ["Clock", "Greeting", "Search", "Age", "Links", "Weather", "Feed", "Notes"];

interface MyPerformance {
	loadTime: number;
	timeToFirstByte: number;
	responseTime: number;
	throughput: number;
	firstContentfulPaint: number;
	javascriptStarted: number;
	backgroundContentfulRender: number;
	widgetRepositoryStartLoad: number;
	widgetRepositoryEndLoad: number;
	appMounted: number;
	widgetGridMounted: number;
	widgetFirstRender: Record<string, number>;
	widgetContentfulRender: Record<string, number>;
}

function waitForWindow(): Promise<Cypress.AUTWindow> {
	return new Promise((resolve) => {
		cy.window().then(resolve);
	});
}

describe("Performance", () => {
	beforeEach(() => {
		cy.visit("/dist/webext/app/index.html");
		cy.selectPreset("grid");
	});

	it("run performance benchmarks", async () => {
		const iterations = 20;
		const performance: MyPerformance = {
			loadTime: 0,
			timeToFirstByte: 0,
			responseTime: 0,
			throughput: 0,
			firstContentfulPaint: 0,
			javascriptStarted: 0,
			backgroundContentfulRender: 0,
			widgetRepositoryStartLoad: 0,
			widgetRepositoryEndLoad: 0,
			appMounted: 0,
			widgetGridMounted: 0,
			widgetFirstRender: {},
			widgetContentfulRender: {},
		};

		for (let i = 0; i < iterations; i++) {
			cy.reload();

			cy.contains("The Register").should("be.visible");
			cy.contains("Bristol").should("be.visible");
			cy.wait(200);

			const win = await waitForWindow();
			const [navigationTiming] = win.performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
			if (!navigationTiming) {
				throw new Error("No navigation timing");
			}

			performance.loadTime += navigationTiming.loadEventEnd - navigationTiming.startTime;
			performance.timeToFirstByte += navigationTiming.responseStart - navigationTiming.startTime;
			performance.firstContentfulPaint += navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime;
			performance.responseTime += navigationTiming.responseEnd - navigationTiming.requestStart;
			performance.throughput += navigationTiming.encodedBodySize / (navigationTiming.responseEnd - navigationTiming.responseStart) || 0;

			const markJS = win.performance.getEntriesByName("app-js-start")[0];
			performance.javascriptStarted += markJS ? markJS.startTime - navigationTiming.startTime : 10000000;

			const markApp = win.performance.getEntriesByName("app-mounted")[0];
			performance.appMounted += markApp ? markApp.startTime - navigationTiming.startTime : 10000000;

			const markBg = win.performance.getEntriesByName("background-loaded")[0];
			performance.backgroundContentfulRender += markBg ? markBg.startTime - navigationTiming.startTime : 10000000;

			const markWRStart = win.performance.getEntriesByName("widget-repository-start-load")[0];
			performance.widgetRepositoryStartLoad += markWRStart ? markWRStart.startTime - navigationTiming.startTime : 10000000;

			const markWREnd = win.performance.getEntriesByName("widget-repository-end-load")[0];
			performance.widgetRepositoryEndLoad += markWREnd ? markWREnd.startTime - navigationTiming.startTime : 10000000;

			const markWG = win.performance.getEntriesByName("widget-grid-mounted")[0];
			performance.widgetGridMounted += markWG ? markWG.startTime - navigationTiming.startTime : 10000000;

			widgetTypes.forEach(type => {
				const markStart = win.performance.getEntriesByName(`widget-${type}-render-start`)[0];
				const markLoaded = win.performance.getEntriesByName(`widget-${type}-loaded`)[0];

				const firstRenderTime = markStart ? markStart.startTime - navigationTiming.startTime : 10000000;
				performance.widgetFirstRender[type] = firstRenderTime + (performance.widgetFirstRender[type] ?? 0);

				const loadTime = markLoaded ? markLoaded.startTime - navigationTiming.startTime : 10000000;
				performance.widgetContentfulRender[type] = loadTime + (performance.widgetContentfulRender[type] ?? 0);
			});
		}

		const calcRoundedAverage = (value: number) => Math.round(value / iterations);

		const report: MyPerformance = {
			loadTime: calcRoundedAverage(performance.loadTime),
			timeToFirstByte: calcRoundedAverage(performance.timeToFirstByte),
			responseTime: calcRoundedAverage(performance.responseTime),
			throughput: calcRoundedAverage(performance.throughput),
			firstContentfulPaint: calcRoundedAverage(performance.firstContentfulPaint),
			javascriptStarted: calcRoundedAverage(performance.javascriptStarted),
			backgroundContentfulRender: calcRoundedAverage(performance.backgroundContentfulRender),
			widgetRepositoryStartLoad: calcRoundedAverage(performance.widgetRepositoryStartLoad),
			widgetRepositoryEndLoad: calcRoundedAverage(performance.widgetRepositoryEndLoad),
			appMounted: calcRoundedAverage(performance.appMounted),
			widgetGridMounted: calcRoundedAverage(performance.widgetGridMounted),
			widgetFirstRender:
				Object.fromEntries(
					Object.entries(performance.widgetFirstRender)
					.map(([key, value]) => [key, calcRoundedAverage(value)])),
			widgetContentfulRender:
				Object.fromEntries(
					Object.entries(performance.widgetContentfulRender)
					.map(([key, value]) => [key, calcRoundedAverage(value)])),
		}

		cy.log(JSON.stringify(report, undefined, 4));

		cy.writeFile("cypress/performance.json", JSON.stringify(report, undefined, 4));
	});
});
