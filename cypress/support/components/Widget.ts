export class Widget {
	private rootCSS: string;

	constructor(id_or_css: (string | number)) {
		if (typeof(id_or_css) == "string") {
			this.rootCSS = id_or_css;
		} else {
			this.rootCSS = `.widget[data-widget-id="${id_or_css}"]`;
		}
	}

	delete() {
		cy.get(this.rootCSS + " .widget-delete").click({ force: true });
	}

	edit() {
		cy.get(this.rootCSS + " .widget-edit").click({ force: true });
	}

	duplicate() {
		cy.get(this.rootCSS + " [data-cy='widget-duplicate']").click({ force: true });
	}

	get(extra?: string) {
		return cy.get(this.rootCSS + " " + (extra ?? ""));
	}
}
