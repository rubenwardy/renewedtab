/**
 * Updates translations based on source translation
 */

const fs = require('fs');
const { execSync } = require("child_process");

function readJSON(path) {
	return JSON.parse(fs.readFileSync(path).toString());
}

function writeJSON(path, data) {
	fs.writeFileSync(path, JSON.stringify(data, null, 4) + "\n");
}

execSync("git show HEAD:src/app/locale/en.json > /tmp/en.json");

const englishOld = readJSON("/tmp/en.json");
const english = readJSON("src/app/locale/en.json");

const updateMap = new Map();

const removedEntries = Object.entries(englishOld)
	.filter(([key,]) => english[key] == undefined) ?? [];

const insertedEntries = Object.entries(english)
	.filter(([key,]) => englishOld[key] == undefined) ?? [];

if (removedEntries.length > 0 && insertedEntries.length > 0) {
	removedEntries.forEach(([oldKey, oldValue]) => {
		const newPair = insertedEntries
			.find(([, value2]) => value2.message == oldValue.message);
		if (newPair) {
			const [newKey, newValue] = newPair;
			console.log(`Detected renamed translation: ${oldKey} to ${newKey}`);
			updateMap.set(oldKey, {
				key: newKey,
				description: newValue.description
			});
		}
	});
}


const dir = fs.opendirSync('src/app/locale');

let item;
while ((item = dir.readSync()) !== null) {
	if (item.name.endsWith(".json") && item.name != "en.json") {
		const path = 'src/app/locale/' + item.name;

		const current = readJSON(path);

		for (let key in current) {
			if (updateMap.has(key)) {
				const update = updateMap.get(key);
				current[update.key] = current[key];
				current[update.key].description = update.description;
				delete current[key];
			} else if (!english.hasOwnProperty(key)) {
				delete current[key];
			}
		}

		writeJSON(path, current);
	}
}

dir.closeSync();
