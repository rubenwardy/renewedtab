import Button, { ButtonVariant } from 'app/components/Button';
import LinkBox, { LinkSchema, LinkBoxProps, FullLinkSchema, Link } from 'app/components/LinkBox';
import { miscMessages, schemaMessages } from 'app/locale/common';
import { parseLinksJson } from 'app/utils/imports';
import { type } from 'app/utils/Schema';
import uuid from 'app/utils/uuid';
import { Vector2 } from 'app/utils/Vector2';
import { defaultLinksThemeSchema, ListBoxStyle, Widget, WidgetEditComponentProps, WidgetProps, WidgetType } from 'app/Widget';
import React, { useCallback, useMemo, useRef } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Links",
		description: "Links Widget",
	},

	description: {
		defaultMessage: "Links, with support for headings and icons (speed dial)",
		description: "Links widget description",
	},

	links: {
		defaultMessage: "Links",
		description: "Links widget: form field label",
	},

	enableCustomIcons: {
		defaultMessage: "Enable custom icons",
		description: "Links widget: form field label",
	},
});


function Links(props: WidgetProps<LinkBoxProps>)  {
	return (<LinkBox {...props.props} widgetTheme={props.theme} />);
}


function encode(str: string) {
	// Escapes needed to fix `#` in data.
	return btoa(unescape(encodeURIComponent(str)));
}


function LinksImportExport(props: WidgetEditComponentProps<LinkBoxProps>) {
	const handleImport = useCallback(async (file: File) => {
		try {
			const text = new TextDecoder("utf-8").decode(await file.arrayBuffer());

			let links: Link[] = [];
			// if (file.name.endsWith(".infinity")) {
			// 	const json = JSON.parse(text);
			// 	if (!json) {
			// 		return;
			// 	}

			// 	links = parseInfinity(json).links;

			// 	if (links.length > 0) {
			// 		alert(intl.formatMessage(miscMessages.importsMayContainAffiliates));
			// 	}
			// } else
			if (file.name.endsWith(".json")) {
				const json = JSON.parse(text);
				if (!json) {
					return;
				}

				links = parseLinksJson(json);
			} else {
				alert("Unknown " + file.name);
				return;
			}

			const added = new Set();
			props.props.links.forEach(link => added.add(link.url));

			props.props.links = [
				...props.props.links,
				...links.filter(link => !added.has(link.url)),
			];
			props.onChange();
		} catch (e) {
			alert(e);
			return;
		}
	}, [props]);

	const exportData = useMemo(() => {
		return `data:application/json;base64,${encode(JSON.stringify(props.props.links))}`
	}, [props.props.links]);

	const ref = useRef<HTMLInputElement>(null);
	return (
		<div className="buttons row-centered mb-4">
			<p className="col my-0 text-muted">
				<FormattedMessage {...miscMessages.globalSearchEditHint} />
			</p>
			<input ref={ref} type="file" className="display-none"
				accept="application/json,.json" name="import-file"
				onChange={(e) => handleImport(e.target.files![0]).catch(console.error)} />
			<Button id="import"
				variant={ButtonVariant.Secondary}
				onClick={() => ref.current?.click()}
				label={miscMessages.import} />
			<Button id="export" data-cy="export-links"
				variant={ButtonVariant.Secondary}
				href={exportData}
				download="renewedtab-links.json"
				label={miscMessages.export} />
		</div>);
}


const initialProps: LinkBoxProps = {
	links: [
		{
			id: uuid(),
			title: "Renewed Tab",
			icon: "",
			url: "",
		},
		{
			id: uuid(),
			title: "Help and Support",
			icon: "",
			url: "https://renewedtab.com/help/"
		},
		{
			id: uuid(),
			title: "Popular",
			icon: "",
			url: "",
		},
		{
			id: uuid(),
			title: "YouTube",
			icon: "",
			url: "https://www.youtube.com/"
		},
		{
			id: uuid(),
			title: "Wikipedia",
			icon: "",
			url: "https://en.wikipedia.org/"
		},
	],
};


const widget: WidgetType<LinkBoxProps> = {
	Component: Links,
	title: messages.title,
	description: messages.description,
	editHeaderComponent: LinksImportExport,
	defaultSize: new Vector2(5, 5),
	initialProps: initialProps,
	themeSchema: defaultLinksThemeSchema,

	async schema(widget) {
		const linkSchema = widget.props.enableCustomIcons ? FullLinkSchema : LinkSchema;
		if (typeof browser !== "undefined") {
			return {
				links: type.array(linkSchema, messages.links),
				openInNewTab: type.boolean(schemaMessages.openInNewTab),
				enableCustomIcons: type.boolean(messages.enableCustomIcons),
				useWebsiteIcons: type.booleanHostPerm(schemaMessages.useWebsiteIcons),
			};
		} else {
			return {
				links: type.array(linkSchema, messages.links),
				openInNewTab: type.boolean(schemaMessages.openInNewTab),
				enableCustomIcons: type.boolean(messages.enableCustomIcons),
			};
		}
	},

	async onLoaded(widget: Widget<any>) {
		if (widget.props.sections && !widget.props.links) {
			widget.props.links = widget.props.sections.map((section: any) => [
				{ title: section.title, url: "" },
				section.links
			]).flat(10).map((link: any) => {
				link.id = uuid();
				return link;
			});
		}

		if (typeof widget.props.useIconBar !== "undefined") {
			widget.theme.listBoxStyle = widget.props.useIconBar
				? ListBoxStyle.Icons
				: ListBoxStyle.Vertical;
			widget.theme.showPanelBG = !widget.props.useIconBar;
			delete widget.props.useIconBar;
		}

		if (typeof (widget.theme as any).useIconBar !== "undefined") {
			widget.theme.listBoxStyle = (widget.theme as any).useIconBar
				? ListBoxStyle.Icons
				: ListBoxStyle.Vertical;
			delete (widget.theme as any).useIconBar;
		}
	},
};
export default widget;
