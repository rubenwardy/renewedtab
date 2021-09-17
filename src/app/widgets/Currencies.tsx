import ErrorView from 'app/components/ErrorView';
import Panel from 'app/components/Panel';
import { getAPI, useAPI } from 'app/hooks';
import Schema, { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetType } from 'app/Widget';
import { calculateExchangeRate, CurrencyInfo } from 'common/api/currencies';
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


function Currencies(widget: WidgetProps<CurrenciesProps>) {
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
			<div className="stats h-100">
				{rates.map(({from, to}) => (
					<div className="singlestat" key={`${from}-${to}`}>
						<span className="title">
							{from}
							<i className="fas fa-long-arrow-alt-right mx-2" />
							{to}
						</span>
						<span className="value">
							{renderExchangeRate(from, to)}
						</span>
					</div>))}
			</div>
		</Panel>);
}


const widget: WidgetType<CurrenciesProps> = {
	Component: Currencies,
	title: messages.title,
	description: messages.description,
	editHint: messages.editHint,
	defaultSize: new Vector2(5, 3),
	initialProps: {
		rates: [
			{ from: "GBP", to: "EUR" },
			{ from: "BTC", to: "USD" },
		]
	},

	async schema() {
		const json = (await getAPI("/currencies/", {})) as Record<string, CurrencyInfo>;

		const currencyOptions: Record<string, string> = {};
		currencyOptions[""] = "";
		Object.entries(json)
			.sort((a, b) => a[0].localeCompare(b[0], undefined, {
					sensitivity: "base" }))
			.forEach(([key, value]) => {
				currencyOptions[key] = `${value.code}: ${value.description}`;
			});

		const rateSchema: Schema<CurrenciesProps["rates"][number]> = {
			from: type.select(currencyOptions, undefined, messages.from),
			to: type.select(currencyOptions, undefined, messages.to),
		};

		return {
			rates: type.array(rateSchema, messages.rates),
		};
	},
};
export default widget;
