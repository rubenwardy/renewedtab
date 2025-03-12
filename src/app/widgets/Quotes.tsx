import ErrorView from "app/components/ErrorView";
import Panel from "app/components/Panel";
import { useAPI } from "app/hooks";
import { schemaMessages } from "app/locale/common";
import { type } from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetType } from "app/Widget";
import { Quote } from "common/api/quotes";
import React from "react";
import { defineMessages } from "react-intl";


const messages = defineMessages({
	title: {
		defaultMessage: "Quotes",
		description: "Quotes Widget",
	},

	description: {
		defaultMessage: "Shows a random quote, with categories",
		description: "Quotes Widget description",
	},

	editHint: {
		defaultMessage: "Quotes are sourced from external sources, and are not reviewed by Renewed Tab.",
		description: "Daily Goal widget: edit modal hint",
	},
});


interface QuotesProps {
	categories: { [key: string]: boolean };
}


function Quotes(props: WidgetProps<QuotesProps>) {
	const categories = Object.entries(props.props.categories)
		.filter(([, value]) => value)
		.map(([key,]) => key);

	const [quotes, error] = useAPI<Quote[]>("quotes/", { categories }, []);
	if (!quotes) {
		return (<ErrorView error={error} loading={false} />);
	}

	const quote = quotes[0];
	if (!quote) {
		return (<></>);
	}

	return (
		<Panel {...props.theme} scrolling={true}>
			<div className="middle-center quote">
				<div className="quote-text">
					{quote.text}
				</div>
				<div className="quote-info">
					{quote.author}
					{quote.credit && (
						<a href={quote.credit.url}>{quote.credit.text}</a>)}
				</div>
			</div>
		</Panel>);
}


const widget: WidgetType<QuotesProps> = {
	Component: Quotes,
	title: messages.title,
	description: messages.description,
	editHint: messages.editHint,
	defaultSize: new Vector2(15, 2),
	initialProps: {
		categories: {
			"inspire": true,
			"life": true,
			"love": true,
			"funny": true
		}
	},
	schema: {
		categories: type.quoteCategories(schemaMessages.categories),
	},
	initialTheme: {
		showPanelBG: false,
		textColor: "#ffffff",
	},
	themeSchema: {
		showPanelBG: type.boolean(schemaMessages.showPanelBG),
		textColor: type.color(schemaMessages.textColor),
	},
};
export default widget;
