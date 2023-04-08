import { defineMessages } from "react-intl";

export const schemaMessages = defineMessages({
	url: {
		defaultMessage: "URL",
		description: "Form field label",
	},

	text: {
		defaultMessage: "Text",
		description: "Form field label",
	},

	title: {
		defaultMessage: "Title",
		description: "Form field label",
	},

	icon: {
		defaultMessage: "Icon",
		description: "Form field label",
	},

	rssUrlHint: {
		defaultMessage: "URL to an Atom, JSONFeed, or RSS feed",
		description: "Form field hint (Feed URL)",
	},

	linkUrl: {
		defaultMessage: "Link URL",
		description: "Form field label",
	},

	showPanelBG: {
		defaultMessage: "Show panel background",
		description: "Widget styling, checkbox",
	},

	listBoxStyle: {
		defaultMessage: "List box style",
		description: "Form field label",
	},

	showText: {
		defaultMessage: "Show text",
		description: "Widget styling, checkbox for showing text on eg: Links"
	},

	location: {
		defaultMessage: "Location",
		description: "Form field label",
	},

	color: {
		defaultMessage: "Color",
		description: "Form field label",
	},

	colors: {
		defaultMessage: "Colors",
		description: "Form field label",
	},

	textColor: {
		defaultMessage: "Text Color",
		description: "Form field label",
	},

	image: {
		defaultMessage: "Choose an image",
		description: "Form field label",
	},

	imageHint: {
		defaultMessage: "Images are stored locally on your browser, and never uploaded",
		description: "Form field hint (Image)",
	},

	imageUrl: {
		defaultMessage: "Image URL",
		description: "Form field label",
	},

	opacity: {
		defaultMessage: "Opacity",
		description: "Form field label",
	},

	categories: {
		defaultMessage: "Categories",
		description: "Form field label, list of categories. Used by Quotes widget"
	},

	useWebsiteIcons: {
		defaultMessage: "Use icons from websites (favicons)",
		description: "Form field label",
	},

	openInNewTab: {
		defaultMessage: "Open links in new tab",
		description: "Form field label",
	},

	timeZone: {
		defaultMessage: "Time Zone",
	},

	fontScaling: {
		defaultMessage: "Font Scaling",
		description: "Theme settings: form field label",
	},
});


export const miscMessages = defineMessages({
	no_network: {
		defaultMessage: "Unable to connect to the Internet",
	},

	loading: {
		defaultMessage: "Loading…",
	},

	edit: {
		defaultMessage: "Edit",
	},

	add: {
		defaultMessage: "Add",
	},

	ok: {
		defaultMessage: "OK",
	},

	delete: {
		defaultMessage: "Delete",
	},

	cancel: {
		defaultMessage: "Cancel",
	},

	chooseAFile: {
		defaultMessage: "Choose a file",
	},

	requiresBrowserVersion: {
		defaultMessage: "Requires browser extension version",
	},

	noResults: {
		defaultMessage: "No results",
		description: "A search has returned no results here (note: there may be multiple places being searched)"
	},

	globalSearchEditHint: {
		defaultMessage: "You can filter this widget using a Search widget.",
		description: "Edit hint shown on searchable widgets",
	},

	poweredBy: {
		defaultMessage: "Powered by {host}.",
		description: "Credit to a website",
	},

	help: {
		defaultMessage: "Help",
	},

	dismiss: {
		defaultMessage: "Dismiss",
	},

	welcome: {
		defaultMessage: "Welcome to <a>Renewed Tab</a>",
		description: "Onboarding modal: title",
	},

	errFetchBookmarks: {
		defaultMessage: "Unable to get bookmarks",
		description: "Bookmarks widget: error message",
	},

	bookmarksPermissionLabel: {
		defaultMessage: "Grant permission to access bookmarks and fetch icons from websites",
	},

	bookmarksBar: {
		defaultMessage: "Bookmarks Bar",
		description: "Chrome-only, a bar for bookmarks at the top",
	},

	hideBookmarksBar: {
		defaultMessage: "Hide",
		description: "Hide"
	},

	finishEditing: {
		defaultMessage: "Finish Editing",
		description: "Edit bar button to make the grid readonly"
	},

	widgetsHaveSettings: {
		defaultMessage:"<b>Widgets also have settings</b>: hover over a widget and click the pencil to customise it.",
		description: "General settings: help message",
	},

	export: {
		defaultMessage: "Export",
		description: "Import / export settings, export",
	},

	import: {
		defaultMessage: "Import",
		description: "Import / export settings, import",
	},

	typeWidget: {
		defaultMessage: "{name} Widget",
		description: "Name of widget",
	},

	moveDown: {
		defaultMessage: "Move down",
	},

	moveUp: {
		defaultMessage: "Move up",
	},

	duplicate: {
		defaultMessage: "Duplicate",
	},
});
