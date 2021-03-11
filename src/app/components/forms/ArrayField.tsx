import React, { useState } from "react";
import Form, { FormProps } from "./Form";
import { FieldProps } from ".";
import uuid from "app/utils/uuid";
import Schema, { SchemaEntry } from "app/utils/Schema";

interface RowProps extends FormProps {
	idx: number;
	onDelete: () => void;
}

function ArrayRow(props: RowProps) {
	return (
		<div className="row">
			<a className="float-right btn btn-sm btn-danger"
					onClick={props.onDelete}>
				<i className="fas fa-trash" />
			</a>
			<h3>{ props.idx + 1 }</h3>
			<Form {...props} />
		</div>);
}


function createFromSchema(schema: Schema): any {
	const retval: any = { id: uuid() };
	Object.entries(schema).forEach(([key, entry]) => {
		if (entry.type == "string") {
			retval[key] = "";
		} else if (entry.type == "number") {
			retval[key] = 0;
		}
	})
	return retval;
}


export default function ArrayField(props: FieldProps<any[]>) {
	const [_, setState] = useState({});

	function handleChange() {
		if (props.onChange) {
			props.onChange(props.value);
		}
	}

	function handleAdd(front: boolean) {
		const row = createFromSchema(props.schemaEntry.subschema!);
		if (front)  {
			props.value.unshift(row);
		} else {
			props.value.push(row);
		}

		handleChange();
		setState({});
	}

	function handleDelete(idx: number) {
		props.value.splice(idx, 1);
		handleChange();
		setState({});
	}

	const rows = props.value.map((row, idx) => (
		<ArrayRow key={row.id} idx={idx} values={row}
			schema={props.schemaEntry.subschema!}
			onChange={() => handleChange()}
			onDelete={() => handleDelete(idx)} />));

	return (
		<div className="field field-array">

			<label htmlFor={props.name}>{props.schemaEntry.label ?? props.name}</label>

			<a className="btn btn-sm btn-primary"
					onClick={() => handleAdd(true)}>
				<i className="fas fa-plus mr-2" />
				Add
			</a>

			{rows}

			{rows.length > 0 &&
				<a className="btn btn-sm btn-primary"
						onClick={() => handleAdd(false)}>
					<i className="fas fa-plus mr-2" />
					Add
				</a>}

			{props.schemaEntry.hint &&
				<p className="text-muted">{props.schemaEntry.hint}</p>}

		</div>);
}
