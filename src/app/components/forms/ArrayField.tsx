import React from "react";
import Form, { FormProps } from "./Form";
import { FieldProps } from ".";
import uuid from "app/utils/uuid";
import { UncheckedSchema } from "app/utils/Schema";
import useForceUpdate from "app/hooks/useForceUpdate";
import { FormattedMessage } from "react-intl";
import Button, { ButtonVariant } from "../Button";
import { miscMessages } from "app/locale/common";
import { MyFormattedMessage } from "app/locale/MyMessageDescriptor";


interface RowProps<T extends { id: string }> extends FormProps<T> {
	idx: number;
	isLast: boolean;
	onDelete: () => void;
	onMove?: (up: boolean) => void;
}

function ArrayRow<T extends { id: string }>(props: RowProps<T>) {
	return (
		<tr>
			{props.onMove && (
				<td>
					{props.idx > 0 &&
						<Button small={true} variant={ButtonVariant.None}
							title={miscMessages.moveUp}
							icon="fas fa-caret-up" onClick={() => props.onMove!(true)} />}

					{!props.isLast &&
						<Button small={true} variant={ButtonVariant.None}
							title={miscMessages.moveDown}
							icon="fas fa-caret-down" onClick={() => props.onMove!(false)} />}
				</td>)}

			<Form {...props} table={true} />

			<td>
				<Button small={true} variant={ButtonVariant.Danger}
					title={miscMessages.delete}
					icon="fas fa-trash" onClick={props.onDelete} />
			</td>
		</tr>);
}


function createFromSchema(schema: UncheckedSchema): any {
	const retval: any = { id: uuid() };
	Object.entries(schema)
		.filter(([,entry]) => entry)
		.forEach(([key, entry]) => {
			if (entry!.type == "string" || entry!.type == "url") {
				retval[key] = "";
			} else if (entry!.type == "number" || entry!.type == "unit_number") {
				retval[key] = 0;
			}
		});
	return retval;
}


export default function ArrayField<T extends { id: string }>(props: FieldProps<T[]>) {
	const forceUpdate = useForceUpdate();

	function handleChange() {
		props.onChange(props.value);
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

	const headers = Object.entries(props.schemaEntry.subschema! as UncheckedSchema)
		.filter(([,type]) => type)
		.map(([key, type]) => (
			<th key={key}>
				<div className="header">
					<MyFormattedMessage message={type!.label} />
				</div>
				<div className="hint text-muted">
					{type!.hint && <MyFormattedMessage message={type!.hint} />}
				</div>
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
			{(rows.length > 0 && isOrdered) && (
				<>
					<Button small={true} variant={ButtonVariant.Secondary}
						icon="fas fa-plus" className="float-right mr-0"
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

			<Button small={true}  variant={ButtonVariant.Secondary}
				icon="fas fa-plus" className="float-right mr-0" data-cy="add-row"
				label={miscMessages.add} onClick={() => handleAdd(false)} />

			<div className="clear-both" />
		</>);
}
