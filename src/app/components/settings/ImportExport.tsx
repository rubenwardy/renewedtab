import { usePromise } from "app/hooks";
import { miscMessages } from "app/locale/common";
import { storage } from "app/storage";
import { toTypedJSON } from "app/utils/TypedJSON";
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import Button, { ButtonVariant } from "../Button";
import ImportButton from "../ImportButton";


const messages = defineMessages({
	reset: {
		defaultMessage: "Reset everything",
		description: "Import / export settings, reset",
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


function encode(str: string) {
	// Escapes needed to fix `#` in data.
	return btoa(unescape(encodeURIComponent(str)));
}


export default function ImportExport() {
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

			<p className="buttons mt-4">
				<Button id="reset" variant={ButtonVariant.Danger} onClick={handleReset} label={messages.reset} />
				<ImportButton />
				<Button data-cy="export"
					href={`data:text/plain;base64,${encode(data ?? "")}`}
					download="renewedtab.json" label={miscMessages.export} />
			</p>
		</div>);
}
