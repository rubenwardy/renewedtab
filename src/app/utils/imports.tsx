import { Link } from "app/components/LinkBox";
import { TodoItemData } from "app/widgets/TodoList";
import uuid from "./uuid";

interface InfinityData {
	links: Link[];
	todo: TodoItemData[];
}


export function parseInfinityLinks(links: any[]): Link[] {
	links = links.filter(item =>
			item.name && (!item.target || !item.target.startsWith("infinity://")));
	links = [
		...links.filter(link => link.target),
		...links.filter(item => !item.target),
	];

	return links
		.flatMap((item: any) => {
			if (item.target) {
				return [
					{
						id: uuid(),
						title: item.name,
						url: item.target,
					}
				];
			} else if (Array.isArray(item.children)) {
				const children = parseInfinityLinks(item.children);
				if (children.length == 0) {
					return [];
				}

				return [
					{
						id: uuid(),
						title: item.name,
						url: "",
					},

					...children,
				];
			} else {
				return [];
			}
		});
}


export function parseInfinity(json: any): InfinityData {
	if (typeof json != "object") {
		throw new SyntaxError("Invalid infinity file, expected JSON object");
	}

	if (typeof json.version != "string") {
		throw new SyntaxError("Invalid infinity file, missing version");
	}

	if (typeof json.data != "object") {
		throw new SyntaxError("Invalid infinity file, missing data");
	}

	const ret: InfinityData = {
		links: [],
		todo: [],
	};

	if (typeof json.data.site == "object" && Array.isArray(json.data.site.sites)) {
		const sites = json.data.site.sites.flatMap((x: any) => x);
		ret.links = parseInfinityLinks(sites);
	}

	if (typeof json.data.todo == "object" && Array.isArray(json.data.todo.todoList)) {
		ret.todo = json.data.todo.todoList
			.filter((item: any) => item.text && !item.text.includes("Infinity New Tab"))
			.map((item: any) => ({
				id: item.todoId,
				text: item.text,
				completed: item.done,
			} as TodoItemData));
	}

	return ret;
}


export function parseLinksJson(json: any): Link[] {
	if (Array.isArray(json)) {
		return json.map(x => {
			if (typeof x.title != "string") {
				throw new SyntaxError("Missing title");
			}
			if (typeof x.url != "string") {
				throw new SyntaxError("Missing url");
			}

			return {
				id: x.id ?? uuid(),
				title: x.title,
				url: x.url,
			}
		});
	} else if (typeof json == "object" && Array.isArray(json.widgets)) {
		const linkData = json.widgets.find((x: any) => x.type == "Links");
		if (linkData && typeof linkData.props == "object") {
			return parseLinksJson(linkData.props.links);
		}
	}

	return [];
}
