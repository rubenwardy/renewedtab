import { usePromise } from "app/hooks";
import { largeStorage } from "app/Storage";
import React, { CSSProperties } from "react";
import { BackgroundProps } from ".";
import { FileInfo } from "../forms/ImageUploadField";


export default function ImageBackground(props: BackgroundProps) {
	const id = props.background!.values.image;
	const [file] = usePromise(() => largeStorage.get<FileInfo>(id), [id]);

	const style: CSSProperties = {};
	if (file) {
		style.backgroundImage = `url('${file.data}')`;
	}

	return (<div id="background" style={style} />);
}
