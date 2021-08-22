import React from "react";
import Form, { FormProps } from "./Form";
import { FieldProps } from ".";
import uuid from "app/utils/uuid";
import Schema from "app/utils/Schema";
import { useForceUpdate } from "app/hooks";
import { FormattedMessage } from "react-intl";
import Button, { ButtonVariant } from "../Button";
import { miscMessages } from "app/locale/common";

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
						<Button small={true} variant={ButtonVariant.None}
							icon="fas fa-caret-up" onClick={() => props.onMove!(true)} />}

					{!props.isLast &&
						<Button small={true} variant={ButtonVariant.None}
							icon="fas fa-caret-down" onClick={() => props.onMove!(false)} />}
				</td>)}

			<Form {...props} table={true} />

			<td>
				<Button small={true} variant={ButtonVariant.Danger}
					icon="fas fa-trash" onClick={props.onDelete} />
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
			<div className="header"><FormattedMessage {...type.label} /></div>
			<div className="hint text-muted">{type.hint && <FormattedMessage {...type.hint} />}</div>
		</th>));

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
					<Button small={true} variant={ButtonVariant.Secondary}
						icon="fas fa-plus" className="float-right"
						label={miscMessages.add} onClick={() => handleAdd(true)} />

					<div className="clear-both" />
				</>)}

			<table className="table">
				<thead>
					<tr>
						{isOrdered && <th />}
						{headers}
						<th />
					</tr>
				</thead>
				<tbody>
					{rows}

					{rows.length == 0 && (
						<tr>
							<td className="text-muted text-center" colSpan={headers.length + (isOrdered ? 2 : 1)}>
								<FormattedMessage
									defaultMessage="Nothing here"
									description="Shown when array table form field has no rows" />
							</td>
						</tr>
					)}
				</tbody>
			</table>

			{(rows.length > 0 || !isOrdered) &&
				<Button small={true}  variant={ButtonVariant.Secondary}
					icon="fas fa-plus" className="float-right"
					label={miscMessages.add} onClick={() => handleAdd(false)} />}

			<div className="clear-both" />
		</>);
}
