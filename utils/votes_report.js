const fs = require("fs");
const file = fs.readFileSync("votes.csv", "UTF-8");

// Used to remove duplicates
const votesLookup = {};
const errors = [];

file.split(/\r?\n/).forEach((line, lineNo) => {
	const parts = line.split(",").map(part => part.trim());
	if (parts.length == 1) {
		return null;
	}

	if (parts[2] != "good" && parts[2] != "bad") {
		errors.push(`Line ${lineNo + 1}: vote is neither good nor bad`);
	}

	const vote = {
		ip: parts[0],
		background_id: parts[1],
		background_url: parts[3].replace(/\?.*$/, ""),
		is_good: parts[2] == "good",
	}

	votesLookup[`${vote.ip}/${vote.background}`] = vote;
});

const votes = Object.values(votesLookup);

const backgroundsLookup = {};
votes.forEach(vote => {
	const bg = backgroundsLookup[vote.background_id] ?? { good: 0, bad: 0, balance: 0, url: vote.background_url };
	backgroundsLookup[vote.background_id] = bg;
	if (vote.is_good) {
		bg.good++;
		bg.balance++;
	} else {
		bg.bad++;
		bg.balance--;
	}
});

const backgrounds =
	Object.entries(backgroundsLookup)
		.map(([key, value]) => ({ ...value, id: key }))
		.sort((a, b) => b.balance - a.balance);

console.log(`| Votes               | URL                                     |`);
backgrounds.forEach(bg => {
	const pad = (v, n) => v.toString().padStart(n, " ")
	const votes = `${pad(bg.balance, 2)} = ${pad(bg.good, 1)} - ${pad(bg.bad, 1)}`;
	console.log(`| ${votes.padEnd(19, " ")} | ${bg.url.padEnd(39, " ")} |`);
});

console.log(`\n\nThere are ${votes.length} votes on ${backgrounds.length} backgrounds`);

if (errors.length > 0) {
	console.log("\n\nErrors:");
	errors.forEach(x => console.log("-", x));
}
