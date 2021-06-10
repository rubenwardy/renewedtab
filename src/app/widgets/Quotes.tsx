import ErrorView from "app/components/ErrorView";
import Panel from "app/components/Panel";
import { useAPI } from "app/hooks";
import Schema from "app/utils/Schema";
import { Vector2 } from "app/utils/Vector2";
import { WidgetProps, WidgetTheme } from "app/Widget";
import { Quote } from "common/api/quotes";
import React from "react";
import { defineMessages } from "react-intl";


const messages = defineMessages({
	title: {
		defaultMessage: "Quotes",
		description: "Quotes Widget",
	},

	description: {
		defaultMessage: "Shows a random inspirational or famous",
		description: "Quotes Widget description",
	},

	editHint: {
		defaultMessage: "Quotes are sourced from external sources, and are not reviewed by Renewed Tab.",
		description: "Daily Goal widget: edit modal hint",
	},
});


export default function Quotes(widget: WidgetProps<any>) {
	const [quotes, error] = useAPI<Quote[]>("quotes/", {}, []);
	if (!quotes) {
		return (<ErrorView error={error} loading={false} />);
	}

	const quote = quotes[0];
	if (!quote) {
		return (<></>);
	}

	return (
		<Panel {...widget.theme} scrolling={true}>
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

Quotes.title = messages.title;
Quotes.description = messages.description;
Quotes.editHint = messages.editHint;
Quotes.initialProps = {};
Quotes.schema = {} as Schema;
Quotes.defaultSize = new Vector2(15, 1);

Quotes.initialTheme = {
	showPanelBG: false,
} as WidgetTheme;
