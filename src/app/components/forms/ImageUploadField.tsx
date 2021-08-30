import { useLargeStorage } from "app/hooks";
import { miscMessages } from "app/locale/common";
import { largeStorage } from "app/Storage";
import { readBlobAsDataURL } from "app/utils/blob";
import { ImageHandle } from "app/utils/Schema";
import uuid from "app/utils/uuid";
import React, { useRef } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { FieldProps } from ".";
import Button from "../Button";


const messages = defineMessages({
	imageTooLarge: {
		defaultMessage: "Image is larger than 2MB ({dataSizeMB}MB). To achieve better load times, you should use a smaller image.",
		description: "Image upload error message",
	}
});


export interface FileInfo {
	filename: string;
	data: string;
}


export default function ImageUploadField(props: FieldProps<ImageHandle>) {
	const [file] = useLargeStorage<FileInfo>(props.value?.key);
	const ref = useRef<HTMLInputElement>(null);
	const intl = useIntl();
	const key: (string | undefined) = typeof props.value == "object" ? props.value?.key : props.value;

	async function handleFile(file: File) {
		if (key) {
			await largeStorage.remove(key);
		}

		const dataSizeMB = file.size / 1024 / 1024;
		if (dataSizeMB > 2) {
			alert(intl.formatMessage(messages.imageTooLarge, {
				dataSizeMB: dataSizeMB.toFixed(1),
			}));
			return;
		}

		const id = key ?? `image-${uuid()}`;
		const data = await readBlobAsDataURL(file);

		await largeStorage.set(id, {
			filename: file.name,
			data: data,
		});

		props.onChange({ key: id });
	}

	return (
		<>
			<input type="file" className="display-none" ref={ref}
				accept=".png,.jpg,image/png,image/jpeg"
				onChange={(e) => handleFile(e.target.files![0]).catch(console.error)} />

			{file &&
				<p className="text-muted">
					<FormattedMessage
							defaultMessage="Image: {filename}"
							values={{ filename: file.filename }} />
				</p>}

			<Button onClick={() => ref.current?.click()}
				label={miscMessages.chooseAFile} />
		</>);
}
