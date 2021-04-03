import { usePromise } from "app/hooks";
import { storage } from "app/Storage";
import { toTypedJSON } from "app/utils/TypedJSON";
import React, { useRef } from "react";

export default function ImportExport(_props: any) {
	async function handleReset() {
		await storage.clear();
		location.reload();
	}

	async function getStoredData(): Promise<string> {
		const data = toTypedJSON(await storage.getAll()) as { [name: string]: any };
		for (let key in data) {
			if (key.startsWith("large-")) {
				data[key] = undefined;
			}
		}

		return JSON.stringify(data);
	}

	async function handleImport(file: File) {
		const json = new TextDecoder("utf-8").decode(await file.arrayBuffer());
		const data = JSON.parse(json);
		for (let [key, value] of Object.entries(data)) {
			await storage.set(key, value);
		}

		location.reload();
	}

	function encode(str: string) {
		// Escapes needed to fix `#` in data.
		return btoa(unescape(encodeURIComponent(str)));
	}

	const ref = useRef<HTMLInputElement>(null);
	const [data, error] = usePromise(() => getStoredData(), []);

	return (
		<div className="modal-body">
			<h3>Import / Export</h3>
			<p>
				Warning: this may contain personal data, if any was entered into
				widget settings.
			</p>
			<textarea className="stored" readOnly
				value={data ?? (error && error.toString()) ?? "Loading..."} />
			<input ref={ref} type="file" className="display-none"
				onChange={(e) => handleImport(e.target.files![0]).catch(console.error)} />
			<p>
				<a className="btn btn-danger" onClick={handleReset}>Reset everything</a>
				<a className="btn btn-primary ml-2" onClick={() => ref.current?.click()}>Import</a>
				<a className="btn btn-primary ml-2"
						href={`data:text/plain;base64,${encode(data ?? "")}`}
						download="renewedtab.json">
					Export
				</a>
			</p>
		</div>);
}
