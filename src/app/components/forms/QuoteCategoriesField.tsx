import { useAPI } from "app/hooks";
import { QuoteCategory } from "common/api/quotes";
import { compareString } from "common/utils/string";
import React, { ChangeEvent, useState } from "react";
import { FieldProps } from ".";
import ErrorView from "../ErrorView";

type StrToBool = { [key: string]: boolean };

export default function QuoteCategoriesField(props: FieldProps<StrToBool>) {
	const [value, setValue] = useState(props.value ?? {});

	const [options, error] = useAPI<QuoteCategory[]>("quote-categories/", {}, []);
	if (!options) {
		return (<ErrorView error={error} loading={true} panel={false} />);
	}

	function onCheck(e: ChangeEvent<HTMLInputElement>) {
		const nextValue = {
			...value,
			[e.target.value]: e.target.checked,
		};

		setValue(nextValue);
		props.onChange(nextValue);
	}

	const selectboxes = options
		.sort((a, b) => compareString(a.text, b.text))
		.map(category => (
			<li key={category.id} className="field">
				<input type="checkbox" name="category" value={category.id}
					checked={value[category.id] ?? false} onChange={onCheck} />
				<label htmlFor="category" className="inline ml-2">
					{category.text}
				</label>
			</li>));

	return (
		<ul className="no-list">
			{selectboxes}
		</ul>);
}
