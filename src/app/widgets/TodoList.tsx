import AutoWidthInput from "app/components/AutoWidthInput";
import Button, { ButtonVariant } from "app/components/Button";
import Panel from "app/components/Panel";
import { useGlobalSearch } from "app/hooks/globalSearch";
import { useWidgetProp } from "app/hooks/widget";
import { miscMessages } from "app/locale/common";
import { queryMatchesAny } from "app/utils";
import uuid from "app/utils/uuid";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetType } from "app/Widget";
import React, { ChangeEvent, useState } from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";


const messages = defineMessages({
	title: {
		defaultMessage: "Todo List",
		description: "Todo List Widget",
	},

	description: {
		defaultMessage: "Track to do list items",
		description: "Todo List widget: description",
	},

	editHint: {
		defaultMessage: "Click items to edit them.",
		description: "Todo List widget: edit modal hint",
	},

	placeholder: {
		defaultMessage: "Create a new todo item",
		description: "Todo List widget: prompt",
	},
});


export interface TodoItemData {
	id: string;
	text: string;
	completed: boolean;
}


export interface TodoListProps {
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

	return (
		<li>
			<input type="checkbox" checked={props.item.completed} onChange={onChecked} />
			<AutoWidthInput onChange={onTextChanged} value={props.item.text ?? ""}
					onFinished={onFinished} minWidth="50%" />
			<Button small={true} icon="fas fa-times" data-cf="todo-delete"
					variant={ButtonVariant.None}
					title={miscMessages.delete}
					onClick={props.delete} />
		</li>);
}


function TodoList(widget: WidgetProps<TodoListProps>) {
	const { query } = useGlobalSearch();
	const [list, setList] = useWidgetProp<TodoItemData[]>(widget, "list");
	const [newItemText, setNewItemText] = useState<string>("");
	const intl = useIntl();

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

	const filteredList = list.filter(item => queryMatchesAny(query, item.text));

	return (
		<Panel {...widget.theme}>
			<ul className="todolist">
				{filteredList.map(item => (
					<TodoItem key={item.id} item={item}
							delete={() => onDelete(item)}
							onChange={() => setList(list)} />))}
				{filteredList.length == 0 && list.length > 0 && (
					<li className="text-muted">
						<FormattedMessage {...miscMessages.noResults} />
					</li>)}

				<li>
					<input type="checkbox" disabled />
					<AutoWidthInput onChange={(e) => setNewItemText(e.target.value)}
							value={newItemText} onFinished={createItem}
							minWidth="50%" name="todo-new-item"
							placeholder={list.length == 0 ? intl.formatMessage(messages.placeholder) : undefined} />
				</li>
			</ul>
		</Panel>);
}


const widget: WidgetType<TodoListProps> = {
	Component: TodoList,
	title: messages.title,
	description: messages.description,
	editHint: [messages.editHint, miscMessages.globalSearchEditHint],
	defaultSize: new Vector2(5, 4),
	initialProps: {
		list: [],
	},
	schema: {},
};
export default widget;
