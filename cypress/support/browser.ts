export function mockBrowserAPIs() {
	const bookmarks: [browser.bookmarks.BookmarkTreeNode] = [{
		id: "",
		title: "Quick Access",
		children: [],
	}];

	let storageValues: any = {};
	let topSites: browser.topSites.MostVisitedURL[] = [];
	const mockBrowser = {
		is_ui_test: true,

		runtime: {
			setUninstallURL() {},
			async getPlatformInfo(): Promise<browser.runtime.PlatformInfo> {
				return {
					arch: "x86-64",
					os: "linux",
				};
			},
			async getBrowserInfo() {
				return {
					name: "firefox",
					vendor: "Mozilla",
					version: "102.1",
					buildID: "2022-01-01",
				};
			},
		},

		/*
			browser.permissions.contains
			browser.tabs.update
			browser.permissions.request
			browser.storagelocal
			browser.bookmarks.getSubTree
			browser.search.get
			browser.search.query and browser.search.search
			browser.tabs.getCurrent
			browser.topSites.get
		*/

		bookmarks: {
			async getSubTree() {
				return bookmarks;
			}
		},

		topSites: {
			get() {
				return topSites;
			}
		},

		storage: {
			local: {
				get() {
					return storageValues;
				},
				set(val: any) {
					Object.assign(storageValues, val);
				},
				remove(key: string) {
					delete storageValues[key];
				},
				clear() {
					storageValues = {};
				}
			}
		},
	};

	return {
		config: {
			onBeforeLoad(win: any) {
				win.browser = mockBrowser;
			}
		},

		browser: mockBrowser,

		setTopSites(sites: browser.topSites.MostVisitedURL[]) {
			topSites = sites;
		},

		setBookmarks(v: browser.bookmarks.BookmarkTreeNode[]) {
			bookmarks[0].children = v;
		},
	};
}
