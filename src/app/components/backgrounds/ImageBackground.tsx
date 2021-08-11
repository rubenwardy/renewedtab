import { usePromise } from "app/hooks";
import { largeStorage } from "app/Storage";
import React from "react";
import { BackgroundProps } from ".";
import { FileInfo } from "../forms/ImageUploadField";
import ActualBackground from "./ActualBackground";


export default function ImageBackground(props: BackgroundProps) {
	const values = props.background!.values;
	const id: (string | undefined) =
		typeof values.image == "object" ? values.image?.key : values.image;
	const [file] = usePromise(() => largeStorage.get<FileInfo>(id ?? ""), [values.image]);

	return (
		<ActualBackground {...values} image={file?.data ?? ""} />
	);
}
