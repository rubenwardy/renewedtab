import fs from "fs";
import { expect } from "chai";
import { JSDOM } from "jsdom";
import { FeedType } from "common/feeds";
import { detectFeed, Loader } from "common/feeds/detect";


const loadFromFile: Loader = async (urlStr) => {
	const url = new URL(urlStr);
	const path = "tests/data/feeds/" + url.pathname;
	if (!fs.existsSync(path)) {
		return null;
	}

	const text = fs.readFileSync(path).toString();
	const type = url.pathname.endsWith(".html") ? "text/html" : "application/xml";
	const document = new JSDOM(text, { contentType: type });
	return document.window.document.children[0];
}


describe("detectFeed", () => {
	it("handlesDirectURLs", async () => {
		expect(await detectFeed("http://example.com/nasa.rss", loadFromFile)).to.deep.eq([
			{
				type: FeedType.Rss,
				url: "http://example.com/nasa.rss",
				numberOfArticles: 0,
				numberOfImages: 0,
				title: "",
			},
		]);

		expect(await detectFeed("http://example.com/xkcd.atom", loadFromFile)).to.deep.eq([
			{
				type: FeedType.Atom,
				url: "http://example.com/xkcd.atom",
				numberOfArticles: 0,
				numberOfImages: 0,
				title: "",
			},
		]);
	});

	it("handlesMissingURLs", async () => {
		expect(await detectFeed("http://example.com/nonexistant/", loadFromFile)).to.be.empty;
		expect(await detectFeed("http://example.com/pageWithDeadUrl.html", loadFromFile)).to.be.empty;
	});

	it("handlesLink", async () => {
		expect(await detectFeed("http://example.com/pageNoFeed.html", loadFromFile)).to.be.empty;
		expect(await detectFeed("http://example.com/pageWithRSS.html", loadFromFile)).to.deep.eq([
			{
				type: FeedType.Rss,
				url: "http://example.com/nasa.rss",
				numberOfArticles: 0,
				numberOfImages: 0,
				title: "Subscribe to What's New",
			},
		]);
		expect(await detectFeed("http://example.com/pageWithAbsUrl.html", loadFromFile)).to.deep.eq([
			{
				type: FeedType.Rss,
				url: "http://other.com/nasa.rss",
				numberOfArticles: 0,
				numberOfImages: 0,
				title: "Subscribe to What's New",
			},
		]);
		expect(await detectFeed("http://example.com/pageWithAtom.html", loadFromFile)).to.deep.eq([
			{
				type: FeedType.Atom,
				url: "http://example.com/xkcd.atom",
				numberOfArticles: 0,
				numberOfImages: 0,
				title: "Atom 1.0",
			},
		]);
	});

	it("handlesMultipleLinks", async () => {
		expect(await detectFeed("http://example.com/pageWithMultiple.html", loadFromFile)).to.deep.eq([
			{
				type: FeedType.Rss,
				url: "http://example.com/nasa.rss",
				numberOfArticles: 0,
				numberOfImages: 0,
				title: "Subscribe to What's New",
			},

			{
				type: FeedType.Atom,
				url: "http://example.com/xkcd.atom",
				numberOfArticles: 0,
				numberOfImages: 0,
				title: "Atom 1.0",
			},

			// TODO: Detect json feeds
			// {
			// 	type: FeedType.Json,
			// 	url: "http://other.com/nasa.rss",
			// 	numberOfArticles: 0,
			// 	numberOfImages: 0,
			// 	title: "",
			// },
		]);
	});
});
