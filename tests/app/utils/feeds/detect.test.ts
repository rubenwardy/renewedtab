import fs from "fs";
import { expect } from "chai";
import { JSDOM } from "jsdom";
import { FeedType } from "app/utils/feeds";
import { detectFeed } from "app/utils/feeds/detect";


function loadFromFile(urlStr: string): (Element | null) {
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
	it("handlesDirectLinks", () => {
		expect(detectFeed("http://example.com/nasa.rss", loadFromFile)).to.deep.eq({
			type: FeedType.Rss,
			url: "http://example.com/nasa.rss"
		});

		expect(detectFeed("http://example.com/xkcd.atom", loadFromFile)).to.deep.eq({
			type: FeedType.Atom,
			url: "http://example.com/xkcd.atom"
		});
	});

	it("handlesMissingURLs", () => {
		expect(detectFeed("http://example.com/nonexistant/", loadFromFile)).to.be.null;
		expect(detectFeed("http://example.com/pageWithDeadUrl.html", loadFromFile)).to.be.null;
	});

	it("handlesLink", () => {
		expect(detectFeed("http://example.com/pageNoFeed.html", loadFromFile)).to.be.null;
		expect(detectFeed("http://example.com/pageWithRSS.html", loadFromFile)).to.deep.eq({
			type: FeedType.Rss,
			url: "http://example.com/nasa.rss"
		});
		expect(detectFeed("http://example.com/pageWithAbsUrl.html", loadFromFile)).to.deep.eq({
			type: FeedType.Rss,
			url: "http://other.com/nasa.rss"
		});
		expect(detectFeed("http://example.com/pageWithAtom.html", loadFromFile)).to.deep.eq({
			type: FeedType.Atom,
			url: "http://example.com/xkcd.atom"
		});
	});
});
