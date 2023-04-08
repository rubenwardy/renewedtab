import { FeedSource } from ".";
import { XMLParser } from "./parse";
import uuid from "../../app/utils/uuid";


export function parseOPML(data: string, parseXML: XMLParser): FeedSource[] {
	const root = parseXML(data, "application/xml");
	return Array.from(root.querySelectorAll("outline[type='rss'][xmlUrl]")).map(x => ({
		id: uuid(),
		title: x.getAttribute("title") ?? x.getAttribute("text") ?? "",
		url: x.getAttribute("xmlUrl")!,
		htmlUrl: x.getAttribute("htmlUrl") ?? undefined,
	}));
}


function quoteattr(s: string) {
	return ('' + s) /* Forces the conversion to string. */
		.replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
		.replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		/*
		You may add other replacements here for HTML only
		(but it's not necessary).
		Or for XML, only if the named entities are defined in its DTD.
		*/
		.replace(/\r\n/g, '\n') /* Must be before the next replacement. */
		.replace(/[\r\n]/g, '\n');
}


export function makeOPML(sources: FeedSource[]) {
	// This is hacky, but I want to avoid needing an XML writer
	const inner = sources.map(
		x => `<outline type="rss"
			text="${quoteattr(x.title)}"
			title="${quoteattr(x.title)}"
			xmlUrl="${quoteattr(x.url)}"
			htmlUrl="${quoteattr(x.htmlUrl ?? '')}" />`);

	return `<?xml version="1.0" encoding="UTF-8"?>
		<opml version="1.0">
			<head>
				<title>Renewed Tab feed export</title>
			</head>
			<body>
				<outline text="Feeds" title="Feeds">
					${inner.join("\n")}
				</outline>
			</body>
		</opml>
	`;
}
