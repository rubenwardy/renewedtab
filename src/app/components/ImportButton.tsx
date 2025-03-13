import { storage } from "app/storage";
import React, { useRef } from "react";
import Button, { ButtonProps } from "./Button";
import { miscMessages } from "app/locale/common";
import { parseInfinity } from "app/utils/imports";
import { WidgetManager } from "app/WidgetManager";
import { useWidgetManager } from "app/hooks/widgetManagerContext";
import { gridPreset } from "app/features/onboarding/OnboardingPresets";
import { LinkBoxProps } from "./LinkBox";
import { TodoListProps } from "app/widgets/TodoList";
import { IntlShape, useIntl } from "react-intl";


async function handleImport(intl: IntlShape, widgetManager: WidgetManager, file: File) {
	const text = new TextDecoder("utf-8").decode(await file.arrayBuffer());
	const json = JSON.parse(text);
	if (file.name.endsWith(".infinity")) {
		try {
			const data = parseInfinity(json);
			if (widgetManager.widgets.length == 0) {
				widgetManager.createFromArray(gridPreset.widgets);
				widgetManager.findWidgetByType<LinkBoxProps>("Links")!.props.links = [];
			}

			if (data.links.length > 0) {
				let widget = widgetManager.findWidgetByType<LinkBoxProps>("Links");
				if (widget == undefined) {
					widget = widgetManager.createWidget("Links");
					widget.props.links = [];
				}

				const added = new Set();
				widget.props.links.forEach(link => added.add(link.url));

				widget.props.links = [
					...widget.props.links,
					...data.links.filter(link => !added.has(link.url)),
				];

				alert(intl.formatMessage(miscMessages.importsMayContainAffiliates));
			}

			if (data.todo.length > 0) {
				let widget = widgetManager.findWidgetByType<TodoListProps>("TodoList");
				if (widget == undefined) {
					widget = widgetManager.createWidget("TodoList");
					widget.props.list = [];
				}

				widget.props.list = [
					...widget.props.list,
					...data.todo,
				];
			}

			widgetManager.save();
		} catch (e) {
			alert(e);
			return;
		}
	} else {
		for (const [key, value] of Object.entries(json)) {
			await storage.set(key, value);
		}
	}

	location.reload();
}


export default function ImportButton(props: Partial<ButtonProps>) {
	const ref = useRef<HTMLInputElement>(null);
	const intl = useIntl();
	const widgetManager = useWidgetManager();
	return (<>
		<input ref={ref} type="file" className="display-none"
			accept=".json,application/json,.infinity" name="import-file"
			onChange={(e) => handleImport(intl, widgetManager, e.target.files![0]).catch(console.error)} />
		<Button id="import" onClick={() => ref.current?.click()} label={miscMessages.import} {...props} />
	</>);
}
