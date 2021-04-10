import AutoWidthInput from "app/components/AutoWidthInput";
import { useWidgetProp } from "app/hooks/widget";
import Schema from "app/utils/Schema";
import uuid from "app/utils/uuid";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps } from "app/Widget";
import React, { ChangeEvent, useState } from "react";


interface TodoItemData {
	id: string;
	text: string;
	completed: boolean;
}

interface TodoListProps {
	list: TodoItemData[];
}



function TodoItem(props: { item: TodoItemData, onChange: () => void, delete: () => void }) {
	function onChecked(e: ChangeEvent<HTMLInputElement>) {
		props.item.completed = e.target.checked;
		props.onChange();
	}

	function onTextChanged(e: ChangeEvent<HTMLInputElement>) {
		props.item.text = e.target.value;
		props.onChange();
	}

	function onFinished() {
		if (props.item.text == "") {
			props.delete();
		}
	}

	return (<li className="text-shadow-hard">
		<input type="checkbox" checked={props.item.completed} onChange={onChecked} />
		<AutoWidthInput onChange={onTextChanged} value={props.item.text ?? ""}
				onFinished={onFinished} minWidth="50%" />
		<a onClick={() => props.delete()} className="btn btn-sm">
			<i className="fas fa-times" />
		</a>
	</li>)
}


export default function TodoList(widget: WidgetProps<TodoListProps>) {
	const [list, setList] = useWidgetProp<TodoItemData[]>(widget, "list");
	const [newItemText, setNewItemText] = useState<string>("");

	function createItem() {
		if (newItemText.trim() == "") {
			return;
		}

		list.push({
			id: uuid(),
			text: newItemText,
			completed: false
		});
		setList(list);
		setNewItemText("");
	}

	function onDelete(item: TodoItemData) {
		const idx = list.indexOf(item);
		list.splice(idx, 1);
		setList(list);
	}

	return (
		<ul className="todolist">
			{list.map(item => (
				<TodoItem key={item.id} item={item}
						delete={() => onDelete(item)}
						onChange={() => setList(list)} />))}

			<li className="text-shadow-hard">
				<input type="checkbox" disabled />
				<AutoWidthInput onChange={(e) => setNewItemText(e.target.value)}
						value={newItemText} onFinished={createItem}
						minWidth="50%"
						placeholder={list.length == 0 ? "Create a new todo item" : undefined} />
			</li>
		</ul>);
}


TodoList.description = "Track to do list items";

TodoList.editHint = "Click items to edit them";

TodoList.initialProps = {
	list: [],
} as TodoListProps;

TodoList.schema = {} as Schema;

TodoList.defaultSize = new Vector2(5, 4);
