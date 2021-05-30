exports.format = function (msgs) {
	const results = {};
	for (const [id, msg] of Object.entries(msgs)) {
		results[id] = {
			message: msg.defaultMessage,
			description: msg.description,
		};
	}
	return results;
};

exports.compile = function (msgs) {
	const results = {};
	for (const [id, msg] of Object.entries(msgs)) {
		results[id] = msg.message;
	}
	return results;
};
