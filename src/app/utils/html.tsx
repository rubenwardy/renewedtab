export function escapeHTMLtoText(html: string): string {
	const root = new window.DOMParser().parseFromString(`<span>${html}</span>`, "text/html");
	return root.children[0].textContent!;
}
