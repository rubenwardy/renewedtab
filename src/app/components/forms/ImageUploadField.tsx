import { useLargeStorage } from "app/hooks";
import { largeStorage } from "app/Storage";
import uuid from "app/utils/uuid";
import React from "react";
import { FieldProps } from ".";


function readFileAsDataURL(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", function () {
			if (reader.result) {
				if (reader.result instanceof ArrayBuffer) {
					const chars = new Uint16Array(reader.result as ArrayBuffer);
					resolve(String.fromCharCode.apply(null, chars as any));
				} else {
					resolve(reader.result);
				}
			} else {
				reject("No result");
			}
		}, false);

		reader.readAsDataURL(file);
	});
}


export interface FileInfo {
	filename: string;
	data: string;
}


export default function ImageUploadField(props: FieldProps<string>) {
	const [file] = useLargeStorage<FileInfo>(props.value);

	async function handleFile(file: File) {
		if (props.value) {
			await largeStorage.remove(props.value);
		}

		let id = `image-${uuid()}`;
		const data = await readFileAsDataURL(file);
		await largeStorage.set(id, {
			filename: file.name,
			data: data,
		});

		if (props.onChange) {
			console.log("On change");
			props.onChange(id);
		}
	}

	return (
		<>
			<input type="file" accept=".png,.jpg,image/png,image/jpeg"
				onChange={(e) => handleFile(e.target.files![0]).catch(console.error)} />
			{file &&
				<p className="text-muted">
					Selected {file.filename}
				</p>}
		</>);
}
