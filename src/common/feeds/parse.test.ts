/* eslint-disable @typescript-eslint/no-unused-expressions */

import { expect } from "chai";
import { JSDOM } from "jsdom";
import fs from "fs";
import { Feed, parseFeed } from "common/feeds/parse";


function parseTestFeed(name: string, base?: string): Feed | null {
	const text = fs.readFileSync("src/test_data/feeds/" + name).toString();
	return parseFeed(text, base ?? "https://example.com/",
		(s, l) => new JSDOM(s, { contentType: l }).window.document);
}


describe("parseFeed", () => {
	it("RSS", () => {
		const feed = parseTestFeed("nasa.rss");
		expect(feed).to.exist;
		expect(feed!.title).to.equal("NASA Image of the Day");
		expect(feed!.link).to.equal("http://www.nasa.gov/");

		expect(feed!.articles[0].id).to.equal("an_id");
		expect(feed!.articles[0].title).to.equal("Detecting X-Rays From Uranus");
		expect(feed!.articles[0].link).to.equal("http://www.nasa.gov/image-feature/detecting-x-rays-from-uranus");
		expect(feed!.articles[0].image).to.equal("http://www.nasa.gov/sites/default/files/thumbnails/image/uranus_lg.jpeg");

		expect(feed!.articles[1].id).to.equal("http://www.nasa.gov/image-feature/administrator-bill-nelson-gives-his-first-state-of-nasa-address");
		expect(feed!.articles[1].title).to.equal("Administrator Bill Nelson Gives His First State of NASA Address");
		expect(feed!.articles[1].link).to.equal("http://www.nasa.gov/image-feature/administrator-bill-nelson-gives-his-first-state-of-nasa-address");
		expect(feed!.articles[1].image).to.equal("http://www.nasa.gov/sites/default/files/thumbnails/image/51221294498_8a0636de32_o.jpeg");
	});

	it("RSS - without titles", () => {
		const feed = parseTestFeed("mastodon.rss");
		expect(feed).to.exist;

		expect(feed!.title).to.equal("rubenwardy");
		expect(feed!.link).to.equal("https://hachyderm.io/@rubenwardy");
		expect(feed!.articles).to.have.length(2);
	});

	it("Atom", () => {
		const feed = parseTestFeed("xkcd.atom");
		expect(feed).to.exist;
		expect(feed!.title).to.equal("xkcd.com");
		expect(feed!.link).to.equal("https://xkcd.com/");
		expect(feed!.articles).length(4);

		expect(feed!.articles[0].id).to.equal("https://xkcd.com/2472/");
		expect(feed!.articles[0].title).to.equal("Fuzzy Blob");
		expect(feed!.articles[0].link).to.equal("https://xkcd.com/2472/");
		expect(feed!.articles[0].image).to.equal("https://imgs.xkcd.com/comics/fuzzy_blob.png");

		expect(feed!.articles[1].id).to.equal("id123");
		expect(feed!.articles[1].title).to.equal("Hippo Attacks");
		expect(feed!.articles[1].link).to.equal("https://xkcd.com/2471/");
		expect(feed!.articles[1].image).to.equal("https://imgs.xkcd.com/comics/hippo_attacks.png");

		expect(feed!.articles[2].id).to.equal("https://xkcd.com/2470/");
		expect(feed!.articles[2].title).to.equal("Next Slide Please");
		expect(feed!.articles[2].link).to.equal("https://xkcd.com/2470/");
		expect(feed!.articles[2].image).to.equal("https://imgs.xkcd.com/comics/next_slide_please.png");
	});

	it("Atom test", () => {
		const feed = parseTestFeed("atomOrder.atom");
		expect(feed).to.exist;
		expect(feed!.title).to.equal("xkcd.com");
		expect(feed!.link).to.equal("https://xkcd.com/");
		expect(feed!.articles).length(1);

		expect(feed!.articles[0].id).to.equal("https://xkcd.com/2472/");
		expect(feed!.articles[0].title).to.equal("Fuzzy Blob");
		expect(feed!.articles[0].link).to.equal("https://xkcd.com/2472/");
		expect(feed!.articles[0].image).to.equal("https://imgs.xkcd.com/comics/fuzzy_blob.png");
	});

	it("JSON", () => {
		const feed = parseTestFeed("ruben.json", "https://blog.rubenwardy.com");
		expect(feed).to.exist;
		expect(feed!.title).to.equal("rubenwardy’s blog");
		expect(feed!.link).to.equal("https://blog.rubenwardy.com/");
		expect(feed!.articles).length(4);

		expect(feed!.articles[0].id).to.equal("/2021/05/15/my-computer");
		expect(feed!.articles[0].title).to.equal("My Computer and Server");
		expect(feed!.articles[0].link).to.equal("https://blog.rubenwardy.com/2021/05/15/my-computer/");
		expect(feed!.articles[0].image).to.be.undefined;

		expect(feed!.articles[1].id).to.equal("id123");
		expect(feed!.articles[1].title).to.equal("Securing Markdown user content with Mozilla Bleach");
		expect(feed!.articles[1].link).to.equal("https://blog.rubenwardy.com/2021/05/08/mozilla-bleach-markdown/");
		expect(feed!.articles[1].image).to.equal("https://blog.rubenwardy.com/one/two/image.png");

		expect(feed!.articles[2].id).to.equal("https://blog.rubenwardy.com/2020/09/13/return-to-android-dev/");
		expect(feed!.articles[2].title).to.equal("ForumMate: My return to Android app development");
		expect(feed!.articles[2].link).to.equal("https://blog.rubenwardy.com/2020/09/13/return-to-android-dev/");
		expect(feed!.articles[2].image).to.be.undefined;
	});

	it("RDF", () => {
		const feed = parseTestFeed("feed.rdf");
		expect(feed).to.exist;
		expect(feed!.title).to.equal("XML.com");
		expect(feed!.link).to.equal("http://xml.com/pub");
		expect(feed!.articles).length(2);

		expect(feed!.articles[0].id).to.equal("http://xml.com/pub/2000/08/09/xslt/xslt.html");
		expect(feed!.articles[0].title).to.equal("Processing Inclusions with XSLT");
		expect(feed!.articles[0].link).to.equal("http://xml.com/pub/2000/08/09/xslt/xslt.html");
		expect(feed!.articles[0].image).to.be.undefined;

		expect(feed!.articles[1].id).to.equal("http://xml.com/pub/2000/08/09/rdfdb/index.html");
		expect(feed!.articles[1].title).to.equal("Putting RDF to Work");
		expect(feed!.articles[1].link).to.equal("http://xml.com/pub/2000/08/09/rdfdb/index.html");
		expect(feed!.articles[1].image).to.be.undefined;
	});
});
