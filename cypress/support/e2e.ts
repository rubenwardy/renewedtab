import './commands'


// eslint-disable-next-line @typescript-eslint/no-unused-vars
Cypress.on('uncaught:exception', (err, runnable) => {
	// Whitelist ResizeObserver errors
	const whitelistedMessages = [
		"ResizeObserver loop completed with undelivered notifications",
		"ResizeObserver loop limit exceeded",
	];
	if (whitelistedMessages.some(x => err.message.includes(x))) {
		return false;
	}
});
