import fs from "fs";
import { expect } from "chai";
import { JSDOM } from "jsdom";
import { FeedSource } from "app/utils/feeds";
import { makeOPML, parseOPML } from "app/utils/feeds/opml";
import { faAudioDescription } from "@fortawesome/free-solid-svg-icons";


function parseTestOPML(name: string): FeedSource[] {
	const text = fs.readFileSync("tests/data/feeds/" + name).toString();
	return parseOPML(text, (s, l) => new JSDOM(s, { contentType: l }).window.document);
}


describe("parseOPML", () => {
	it("handlesEmpty", () => {
		expect(parseTestOPML("empty.opml")).to.deep.equal([]);
	});

	it("handlesFeedlyExample", () => {
		const result: any[] = parseTestOPML("feedly.opml")!;
		result.forEach(x => {
			expect(x.id).to.be.a("string");
			delete x.id;
		});

		expect(result).to.deep.equal(
			[
				{
					"title": "Adafruit Industries – Makers, hackers, artists, designers and engineers!",
					"url": "http://www.adafruit.com/blog/feed/",
				},
				{
					"title": "Evil Mad Scientist Laboratories",
					"url": "http://www.evilmadscientist.com/backend/geeklog.rss",
				},
				{
					"title": "Arduino Blog",
					"url": "http://www.arduino.cc/blog/?feed=rss2",
				},
				{
					"title": "EEVblog",
					"url": "http://www.eevblog.com/feed/",
				},
				{
					"title": "rubenwardy’s blog",
					"url": "https://blog.rubenwardy.com/feed.xml",
				},
				{
					"title": "CSS-Tricks",
					"url": "http://feeds.feedburner.com/CssTricks",
				},
				{
					"title": "The Verge",
					"url": "http://www.theverge.com/rss/full.xml",
				},
				{
					"title": "Daring Fireball",
					"url": "http://daringfireball.net/index.xml",
				},
				{
					"title": "Minetest Blog",
					"url": "https://blog.minetest.net/feed.rss",
				},
				{
					"title": "The Register",
					"url": "http://www.theregister.co.uk/excerpts.rss",
				},
			]
		);
	});
});


describe("makeOPML", () => {
	it("is symmetrical", () => {
		const sources: any[] = parseTestOPML("feedly.opml")!;
		const text = makeOPML(sources);
		const fromExport: any[] = parseOPML(text, (s, l) => new JSDOM(s, { contentType: l }).window.document);
		sources.forEach(x => {
			expect(x.id).to.be.a("string");
			delete x.id;
		});
		fromExport.forEach(x => {
			expect(x.id).to.be.a("string");
			delete x.id;
		});
		expect(fromExport).to.deep.equal(sources);
	})
})
