async function migrateToSync() {
	const data = await browser.storage.local.get();
	const widgets = data.widgets ?? [];
	if (widgets.length == 0) {
		return;
	}

	const toSet = {};
	Object.entries(data).forEach(([key, value]) => {
		if (key !== "widgets") {
			toSet[key] = value;
		}
	});

	toSet.widgets = widgets.map(widget => ({
		id: widget.id,
		type: widget.type,
		theme: widget.theme,
		position: widget.position,
		size: widget.size,
	}));

	widgets.forEach(widget =>
		toSet[`widget-${widget.id}`] = {
			props: widget.props,
		});

	await browser.storage.sync.set(toSet);
	await browser.storage.local.clear();
}

browser.runtime.onInstalled.addListener((details) => {
	if (details.reason === "update") {
		migrateToSync().catch(console.error);
	}
})
