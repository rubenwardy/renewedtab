import ErrorView from 'app/components/ErrorView';
import Panel from 'app/components/Panel';
import { useAPI } from 'app/hooks';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import { calculateExchangeRate, CurrencyInfo } from 'common/api/currencies';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Currencies",
		description: "Currencies widget",
	},

	description: {
		defaultMessage: "Shows exchange rates, supporting forex currencies and crypto (BitCoin etc)",
		description: "Currencies widget description",
	},

	rates: {
		defaultMessage: "Exchange Rates",
		description: "Currencies widget: form field label",
	},

	editHint: {
		defaultMessage: "Powered by exchangerate.host",
		description: "Currencies widget: credit to data provider",
	},

	from: {
		defaultMessage: "From",
		description: "Currencies widget: form field label",
	},

	to: {
		defaultMessage: "To",
		description: "Currencies widget: form field label",
	},

	unknownCurrency: {
		defaultMessage: "Unknown currency {currency}",
		description: "Currencies widget: error",
	},
});


interface CurrenciesProps {
	rates: { from: string, to: string }[];
}


export default function Currencies(widget: WidgetProps<CurrenciesProps>) {
	const props = widget.props;
	const intl = useIntl();
	const [ currencies, error ] = useAPI<Record<string, CurrencyInfo>>(`/currencies/`, {}, []);
	if (!currencies) {
		return (<ErrorView error={error} loading={true} />)
	}

	for (const { from, to } of props.rates) {
		if (!currencies[from]) {
			const msg = intl.formatMessage(messages.unknownCurrency, { currency: from });
			return (<ErrorView error={msg} />);
		}

		if (!currencies[to]) {
			const msg = intl.formatMessage(messages.unknownCurrency, { currency: from });
			return (<ErrorView error={msg} />);
		}
	}

	return (
		<Panel {...widget.theme}>
			<div className="stats">
				{props.rates.map(({from, to}) => (
					<div className="singlestat" key={`${from}-${to}`}>
						<span className="title">
							{`${from} 🠒 ${to}`}
						</span>
						<span className="value">
							{calculateExchangeRate(currencies, from.toUpperCase(), to.toUpperCase()).toFixed(2)}
						</span>
					</div>))}
			</div>
		</Panel>);
}


Currencies.title = messages.title;
Currencies.description = messages.description;
Currencies.editHint = messages.editHint;

Currencies.initialProps = {
	rates: [
		{ from: "GBP", to: "EUR" },
		{ from: "BTC", to: "USD" },
	]
} as CurrenciesProps;

const rateSchema: Schema = {
	from: type.string(messages.from),
	to: type.string(messages.to),
};

Currencies.schema = {
	rates: type.array(rateSchema, messages.rates),
} as Schema;

Currencies.defaultSize = new Vector2(5, 3);
