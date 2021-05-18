import React from "react";
import Form, { FormProps } from "./Form";
import { FieldProps } from ".";
import uuid from "app/utils/uuid";
import Schema from "app/utils/Schema";
import { useForceUpdate } from "app/hooks";
import { FormattedMessage, useIntl } from "react-intl";

interface RowProps extends FormProps {
	idx: number;
	isLast: boolean;
	onDelete: () => void;
	onMove?: (up: boolean) => void;
}

function ArrayRow(props: RowProps) {
	return (
		<tr>
			{props.onMove && (
				<td>
					{props.idx > 0 &&
						<a className="btn btn-sm"
								onClick={() => props.onMove!(true)}>
							<i className="fas fa-caret-up" />
						</a>}

					{!props.isLast &&
						<a className="btn btn-sm"
								onClick={() => props.onMove!(false)}>
							<i className="fas fa-caret-down" />
						</a>}
				</td>)}

			<Form {...props} table={true} />

			<td>
				<a className="btn btn-sm btn-danger"
						onClick={props.onDelete}>
					<i className="fas fa-trash" />
				</a>
			</td>
		</tr>);
}


function createFromSchema(schema: Schema): any {
	const retval: any = { id: uuid() };
	Object.entries(schema).forEach(([key, entry]) => {
		if (entry.type == "string" || entry.type == "url") {
			retval[key] = "";
		} else if (entry.type == "number") {
			retval[key] = 0;
		}
	})
	return retval;
}


export default function ArrayField(props: FieldProps<any[]>) {
	const forceUpdate = useForceUpdate();

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
		forceUpdate();
	}

	function handleDelete(idx: number) {
		props.value.splice(idx, 1);
		handleChange();
		forceUpdate();
	}

	function handleMove(idx: number, up: boolean) {
		const tmp = props.value[idx];
		if (up) {
			if (idx > 0) {
				props.value[idx] = props.value[idx - 1];
				props.value[idx - 1] = tmp;
			}
		} else {
			if (idx < props.value.length - 1) {
				props.value[idx] = props.value[idx + 1];
				props.value[idx + 1] = tmp;
			}
		}
		handleChange();
		forceUpdate();
	}

	const headers = Object.entries(props.schemaEntry.subschema!).map(([key, type]) => (
		<th key={key}>
			<FormattedMessage {...type.label} />
		</th>));
	const hints = Object.entries(props.schemaEntry.subschema!).map(([key, type]) => (
		<td key={key}>
			{type.hint && <FormattedMessage {...type.hint} />}
		</td>));

	const isOrdered = props.type != "unordered_array";

	const rows = props.value.map((row, idx) => (
		<ArrayRow key={row.id} idx={idx} values={row}
			schema={props.schemaEntry.subschema!}
			isLast={idx >= props.value.length - 1}
			onChange={() => handleChange()}
			onDelete={() => handleDelete(idx)}
			onMove={isOrdered ? ((up) => handleMove(idx, up)) : undefined} />));

	return (
		<>
			{isOrdered && (
				<>
					<a className="float-right btn btn-sm btn-primary"
							onClick={() => handleAdd(true)}>
						<i className="fas fa-plus mr-2" />

						<FormattedMessage
								defaultMessage="Add" />
					</a>
					<div className="clear-both" />
				</>)}

			<table>
				<thead>
					<tr>
						{isOrdered && <td />}
						{headers}
						<td />
					</tr>
					<tr className="hint">
						{isOrdered && <td />}
						{hints}
						<td />
					</tr>
				</thead>
				<tbody>
					{rows}

					{rows.length == 0 && (
						<tr>
							<td className="text-muted text-center" colSpan={headers.length + (isOrdered ? 2 : 1)}>
								<FormattedMessage
									defaultMessage="Nothing here" />
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{(rows.length > 0 || !isOrdered) &&
				<a className="float-right mt-3 btn btn-sm btn-primary"
						onClick={() => handleAdd(false)}>
					<i className="fas fa-plus mr-2" />

					<FormattedMessage
							defaultMessage="Add" />
				</a>}

			<div className="clear-both" />
		</>);
}
