import { getProbableURL } from "app/utils";
import { expect } from "chai";


describe("isProbablyURL", () => {
	expect(getProbableURL("")).to.be.null;
	expect(getProbableURL("/")).to.be.null;
	expect(getProbableURL("https://google.com/abs")).to.eq("https://google.com/abs");
	expect(getProbableURL("https://google.com:433")).to.eq("https://google.com:433/");
	expect(getProbableURL("https://invalid domain.com")).to.be.null;
	expect(getProbableURL("https://domain.com/ !!!")).to.eq("https://domain.com/%20!!!");
	expect(getProbableURL("http://example.com/ test")).to.eq("http://example.com/%20test");
	expect(getProbableURL("http://abc.notatld")).to.eq("http://abc.notatld/");
	expect(getProbableURL("google.com")).to.eq("http://google.com/");
	expect(getProbableURL("google.com/abs")).to.eq("http://google.com/abs");
	expect(getProbableURL("google.com:433")).to.eq("http://google.com:433/");
	expect(getProbableURL("hello world")).to.be.null;
	expect(getProbableURL("hello world.com")).to.be.null;
	expect(getProbableURL("hello world.com/")).to.be.null;
	expect(getProbableURL("example.com test")).to.be.null;
	expect(getProbableURL("example.com/ test")).to.eq("http://example.com/%20test");
	expect(getProbableURL("abc.notatld")).to.be.null;
	expect(getProbableURL("abc.notatld/")).to.eq("http://abc.notatld/");
	expect(getProbableURL("abc.notatld:123")).to.be.null;
	expect(getProbableURL("abc.notatld:123/")).to.eq("http://abc.notatld:123/");
	expect(getProbableURL("abc.notatld/abc")).to.be.null;
	expect(getProbableURL("abc.notatld/abc/")).to.eq("http://abc.notatld/abc/");
	expect(getProbableURL("other.app")).to.eq("http://other.app/");
	expect(getProbableURL("china.中国")).to.eq("http://china.xn--fiqs8s/");
	expect(getProbableURL("other.丌")).to.be.null;
	expect(getProbableURL("other.丌/")).to.eq("http://other.xn--hhq/");
});
