const fs = require('fs');

function readJSON(path) {
	return JSON.parse(fs.readFileSync(path).toString());
}

function writeJSON(path, data) {
	fs.writeFileSync(path, JSON.stringify(data, null, 2));
}


const english = readJSON("src/app/locale/en.json");
const dir = fs.opendirSync('src/app/locale');

let item;
while ((item = dir.readSync()) !== null) {
	if (item.name.endsWith(".json") && item.name != "en.json") {
		const path = 'src/app/locale/' + item.name;

		const current = readJSON(path);

		for (let key in current) {
			if (!english.hasOwnProperty(key)) {
				delete current[key];
			}
		}

		writeJSON(path, current);
	}
}

dir.closeSync();
