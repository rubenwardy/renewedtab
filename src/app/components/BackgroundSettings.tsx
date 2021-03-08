import { Schema } from "app/utils/schema";
import { fromTypedJSON, toTypedJSON } from "app/utils/TypedJSON";
import React, { useState } from "react";
import { Radio, RadioGroup } from "react-radio-group";
import { makeField } from "./Field";


enum BackgroundMode {
	Auto,
	Color,
	ImageUrl,
	// ImageUpload,
	// Reddit
}

function getSchemaForMode(mode: BackgroundMode): Schema {
	switch (mode) {
	case BackgroundMode.Auto:
		return {};
	case BackgroundMode.Color:
		return {
			color: "string"
		};
	case BackgroundMode.ImageUrl:
		return {
			url: "string"
		};
	}
}

function getDescriptionForMode(mode: BackgroundMode): string {
	switch (mode) {
	case BackgroundMode.Auto:
		return "Random backgrounds";
	case BackgroundMode.Color:
		return "A single color";
	case BackgroundMode.ImageUrl:
		return "An image from a URL";
	}
}

function getValue(key: string): any {
	const str = localStorage.getItem("bg_" + key);
	return str ? fromTypedJSON(JSON.parse(str)) : null;
}

function setValue(key: string, v: any) {
	const str = toTypedJSON(v);
	localStorage.setItem("bg_" + key, JSON.stringify(str));
}

declare type BackgroundModeType = keyof typeof BackgroundMode;

function getStoredMode(): (BackgroundMode | undefined) {
	const type = (localStorage.getItem("bg_mode")) as BackgroundModeType;
	return BackgroundMode[type];
}

export default function BackgroundSettings(_props: any) {
	const [mode, setMode] = useState(getStoredMode() ?? BackgroundMode.Auto);

	const radioModes =
		Object.keys(BackgroundMode)
			.filter(value => isNaN(Number(value)))
			.map(x => (
				<div className="field" key={x}>
					<Radio value={x} />
					{x}:&nbsp;
					<span className="text-muted">
						{getDescriptionForMode(BackgroundMode[x as BackgroundModeType])}
					</span>
				</div>));

	function handleModeChanged(newMode: string) {
		setMode(BackgroundMode[newMode as BackgroundModeType]);
		localStorage.setItem("bg_mode", newMode);
	}

	const schema = getSchemaForMode(mode);
	const inner = Object.entries(schema).map(([key, type]) => {
		const value = getValue(key);
		const Field = makeField(type);
		return (
			<Field key={key} name={key} value={value}
				onChange={(val) => setValue(key, val)} />);
	});

	if (inner.length == 0) {
		inner.push(
			<p className="text-muted" key="none">
				No options.
			</p>);
	}

	return (
		<div className="modal-body">
			<h3>Background Type</h3>
			<RadioGroup name="mode" selectedValue={BackgroundMode[mode]} onChange={handleModeChanged}>
				{radioModes}
			</RadioGroup>
			<h3>{`${BackgroundMode[mode]} Options`}</h3>
			{inner}
		</div>);
}
