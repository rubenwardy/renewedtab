import Button, { ButtonVariant } from 'app/components/Button';
import { Form } from 'app/components/forms';
import { LinkBoxPanel, LinkSchema, LinkBoxWidgetProps, FullLinkSchema, Link } from 'app/components/LinkBox';
import Modal from 'app/components/Modal';
import { miscMessages, schemaMessages } from 'app/locale/common';
import { parseLinksJson } from 'app/utils/imports';
import { type } from 'app/utils/Schema';
import uuid from 'app/utils/uuid';
import { Vector2 } from 'app/utils/Vector2';
import { defaultLinksThemeSchema, ListBoxStyle, Widget, WidgetEditComponentProps, WidgetProps, WidgetType } from 'app/Widget';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';


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

	showAddButton: {
		defaultMessage: "Show '+ Add' button",
		description: "Links widget: form field label",
	},
});


interface LinksWidgetProps extends LinkBoxWidgetProps {
	enableCustomIcons?: boolean;
	showAddButton?: boolean;
}


function LinksQuickAdd(props: WidgetProps<LinksWidgetProps> & { onClose: () => void}) {
	const [values, setValues] = useState({ title: "", url: "" });
	const intl = useIntl();
	const disabled = values.title === "" || values.url === "";
	function handleAdd() {
		props.props.links.push({
			...values,
			id: uuid(),
		});
		props.save();
		props.onClose();
	}

	return (
		<Modal onClose={props.onClose} title={intl.formatMessage({ defaultMessage: "Add link" })}>
			<div className="modal-body">
				<Form
					schema={LinkSchema}
					values={values}
					onChange={(key, value) => setValues({...values, [key]: value})} />
				<Button data-cy="add-link" label={miscMessages.add} disabled={disabled} onClick={handleAdd} />
			</div>
		</Modal>);
}


function Links(props: WidgetProps<LinksWidgetProps>) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const intl = useIntl();
	const linkProps = useMemo(() => {
		const ret = {...props.props};
		if (props.props.showAddButton) {
			ret.links = [...ret.links,
				{
					id: "links_add",
					title: intl.formatMessage(miscMessages.add),
					url: "",
					onClick: () => setIsModalOpen(true),
					icon: "fa-add",
					muted: true,
				}
			];
		}
		return ret;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [intl, props.props, isModalOpen]);

	if (isModalOpen) {
		return (<LinksQuickAdd {...props} onClose={() => setIsModalOpen(false)} />);
	} else {
		return (<LinkBoxPanel {...linkProps} widgetTheme={props.theme} />);
	}
}


function encode(str: string) {
	// Escapes needed to fix `#` in data.
	return btoa(unescape(encodeURIComponent(str)));
}


function LinksImportExport(props: WidgetEditComponentProps<LinksWidgetProps>) {
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

const initialProps: LinksWidgetProps = {
	showAddButton: true,
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


const widget: WidgetType<LinksWidgetProps> = {
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
				showAddButton: type.boolean(messages.showAddButton),
			};
		} else {
			return {
				links: type.array(linkSchema, messages.links),
				openInNewTab: type.boolean(schemaMessages.openInNewTab),
				enableCustomIcons: type.boolean(messages.enableCustomIcons),
				showAddButton: type.boolean(messages.showAddButton),
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

		if (widget.props.showAddButton === undefined) {
			widget.props.showAddButton = true;
		}
	},
};
export default widget;
