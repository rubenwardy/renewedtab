import { usePromise } from "app/hooks";
import { miscMessages } from "app/locale/common";
import { storage } from "app/storage";
import { toTypedJSON } from "app/utils/TypedJSON";
import React, { useRef } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import Button, { ButtonVariant } from "../Button";


const messages = defineMessages({
	reset: {
		defaultMessage: "Reset everything",
		description: "Import / export settings, reset",
	},

	import: {
		defaultMessage: "Import",
		description: "Import / export settings, import",
	},

	export: {
		defaultMessage: "Export",
		description: "Import / export settings, export",
	},

	confirmReset: {
		defaultMessage: "Are you sure you want to reset all data?",
		description: "Import / export settings, reset confirmation",
	},
});


async function getStoredData(): Promise<string> {
	const data = toTypedJSON(await storage.getAll()) as { [name: string]: any };
	for (const key in data) {
		if (key.startsWith("large-")) {
			delete data[key];
		}
	}

	return JSON.stringify(data);
}

async function handleImport(file: File) {
	const json = new TextDecoder("utf-8").decode(await file.arrayBuffer());
	const data = JSON.parse(json);
	for (const [key, value] of Object.entries(data)) {
		await storage.set(key, value);
	}

	location.reload();
}

function encode(str: string) {
	// Escapes needed to fix `#` in data.
	return btoa(unescape(encodeURIComponent(str)));
}


export default function ImportExport() {
	const ref = useRef<HTMLInputElement>(null);
	const [data, error] = usePromise(() => getStoredData(), []);
	const intl = useIntl();

	async function handleReset() {
		const confirmReset = intl.formatMessage(messages.confirmReset);
		if (confirm(confirmReset)) {
			await storage.clear();
			location.reload();
		}
	}

	return (
		<div className="modal-body">
			<p>
				<FormattedMessage
						defaultMessage="Warning: this may contain personal data,
							if any was entered into widget settings." />
			</p>
			<textarea className="fullwidth" readOnly
				value={data ?? (error ? error.toString() : intl.formatMessage(miscMessages.loading))} />
			<input ref={ref} type="file" className="display-none"
				accept=".json,application/json" name="import-file"
				onChange={(e) => handleImport(e.target.files![0]).catch(console.error)} />
			<p className="buttons mt-4">
				<Button id="reset" variant={ButtonVariant.Danger} onClick={handleReset} label={messages.reset} />
				<Button id="import" onClick={() => ref.current?.click()} label={messages.import} />
				<Button id="export" href={`data:text/plain;base64,${encode(data ?? "")}`}
						download="renewedtab.json" label={messages.export} />
			</p>
		</div>);
}
