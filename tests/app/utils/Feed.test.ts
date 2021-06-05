import { Feed, parseFeed } from "app/utils/Feed";
import { expect } from "chai";
import { JSDOM } from "jsdom";
import fs from "fs";


function parseTestFeed(name: string): Feed | null {
	const text = fs.readFileSync("tests/data/" + name).toString();
	const document = new JSDOM(text, { contentType: "application/xml" });
	return parseFeed(document.window.document.children[0],
		(s, l) => new JSDOM(s, { contentType: l }).window.document);
}

describe("Feed", () => {
	it("parsesXML", () => {
		const feed = parseTestFeed("nasa.rss");
		expect(feed).to.exist;
		expect(feed!.title).to.equal("NASA Image of the Day");
		expect(feed!.link).to.equal("http://www.nasa.gov/");



		expect(feed!.articles[0].title).to.equal("Detecting X-Rays From Uranus");
		expect(feed!.articles[0].link).to.equal("http://www.nasa.gov/image-feature/detecting-x-rays-from-uranus");
		expect(feed!.articles[0].image).to.equal("http://www.nasa.gov/sites/default/files/thumbnails/image/uranus_lg.jpeg");

		expect(feed!.articles[1].title).to.equal("Administrator Bill Nelson Gives His First State of NASA Address");
		expect(feed!.articles[1].link).to.equal("http://www.nasa.gov/image-feature/administrator-bill-nelson-gives-his-first-state-of-nasa-address");
		expect(feed!.articles[1].image).to.equal("http://www.nasa.gov/sites/default/files/thumbnails/image/51221294498_8a0636de32_o.jpeg");
	})

	it("parsesAtom", () => {
		const feed = parseTestFeed("xkcd.atom");
		expect(feed).to.exist;
		expect(feed!.title).to.equal("xkcd.com");
		expect(feed!.link).to.equal("https://xkcd.com/");

		expect(feed!.articles[0].title).to.equal("Fuzzy Blob");
		expect(feed!.articles[0].link).to.equal("https://xkcd.com/2472/");
		expect(feed!.articles[0].image).to.equal("https://imgs.xkcd.com/comics/fuzzy_blob.png");

		expect(feed!.articles[1].title).to.equal("Hippo Attacks");
		expect(feed!.articles[1].link).to.equal("https://xkcd.com/2471/");
		expect(feed!.articles[1].image).to.equal("https://imgs.xkcd.com/comics/hippo_attacks.png");

		expect(feed!.articles[2].title).to.equal("Next Slide Please");
		expect(feed!.articles[2].link).to.equal("https://xkcd.com/2470/");
		expect(feed!.articles[2].image).to.equal("https://imgs.xkcd.com/comics/next_slide_please.png");
	});
});
