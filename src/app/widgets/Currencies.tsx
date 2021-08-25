import ErrorView from 'app/components/ErrorView';
import Panel from 'app/components/Panel';
import { buildAPIURL, useAPI } from 'app/hooks';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import { calculateExchangeRate, CurrencyInfo } from 'common/api/currencies';
import { compareString } from 'common/utils/string';
import React, { useMemo } from 'react';
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
		defaultMessage: "Unknown currency ''{currency}''",
		description: "Currencies widget: error",
	},
});


interface CurrenciesProps {
	rates: { from: string, to: string }[];
}


export default function Currencies(widget: WidgetProps<CurrenciesProps>) {
	const rates = useMemo(
		() => widget.props.rates.filter(rate => rate.from != "" && rate.to != ""),
		[ widget.props.rates.length ]);

	const intl = useIntl();
	const [ currencies, error ] = useAPI<Record<string, CurrencyInfo>>(`/currencies/`, {}, []);
	if (!currencies) {
		return (<ErrorView error={error} loading={true} />)
	}

	for (const { from, to } of rates) {
		if (!currencies[from]) {
			const msg = intl.formatMessage(messages.unknownCurrency, { currency: from });
			return (<ErrorView error={msg} />);
		}

		if (!currencies[to]) {
			const msg = intl.formatMessage(messages.unknownCurrency, { currency: to });
			return (<ErrorView error={msg} />);
		}
	}

	function renderExchangeRate(from: string, to: string) {
		const rate = calculateExchangeRate(currencies!, from.toUpperCase(), to.toUpperCase());
		return rate.toFixed(rate > 1 ? 2 : 6);
	}

	return (
		<Panel {...widget.theme}>
			<div className="stats">
				{rates.map(({from, to}) => (
					<div className="singlestat" key={`${from}-${to}`}>
						<span className="title">
							{`${from} 🠒 ${to}`}
						</span>
						<span className="value">
							{renderExchangeRate(from, to)}
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


Currencies.schema = async () => {
	const url = buildAPIURL("/currencies/");
	const response = await fetch(new Request(url.toString(), {
		method: "GET",
		headers: {
			"Accept": "application/json",
		},
	}));

	const json = await response.json() as Record<string, CurrencyInfo>;
	const currencyOptions: Record<string, string> = {};
	currencyOptions[""] = "";
	Object.entries(json)
		.sort((a, b) => compareString(a[0], b[0]))
		.forEach(([key, value]) => {
			currencyOptions[key] = `${value.code}: ${value.description}`;
		});

	const rateSchema: Schema = {
		from: type.select(currencyOptions, undefined, messages.from),
		to: type.select(currencyOptions, undefined, messages.to),
	};

	return {
		rates: type.array(rateSchema, messages.rates),
	};
}


Currencies.defaultSize = new Vector2(5, 3);
