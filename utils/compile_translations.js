const fs = require('fs');
const { execSync } = require("child_process");


const dir = fs.opendirSync('src/app/locale');

let item;
while ((item = dir.readSync()) !== null) {
	if (item.name.endsWith(".json")) {
		console.log(item.name);
		execSync(`formatjs compile src/app/locale/${item.name} --ast --out-file src/app/locale/compiled/${item.name}`);
	}
}

dir.closeSync();
