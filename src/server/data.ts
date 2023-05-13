import fs from "fs";


function readAutocompleteFromFile(filename: string) {
	return fs.readFileSync(`src/server/data/${filename}.csv`)
		.toString()
		.split(/\r?\n/)
		.map(x => x.split(","))
		.filter(x => x.length == 2)
		.map(([label, value]) => ({ label: label.trim(), value: value.trim() }))
		.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
}


export const autocompleteFeeds = readAutocompleteFromFile("feeds");
export const autocompleteWebcomics = readAutocompleteFromFile("webcomics");
export const autocompleteBackgroundFeeds = readAutocompleteFromFile("feeds_background");
