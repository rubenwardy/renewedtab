import Panel from 'app/components/Panel';
import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps } from 'app/Widget';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

const messages = defineMessages({
	title: {
		defaultMessage: "HelpAbout",
		description: "HelpAbout Widget",
	},

	heading: {
		defaultMessage: "Renewed Tab Help and Tips",
		description: "HelpAbout widget heading",
	},

	description: {
		defaultMessage: "Help for new users of Renewed Tab",
		description: "HelpAbout widget description",
	},
});

export default function HelpAbout(widget: WidgetProps<any>) {
	return (
		<Panel {...widget.theme}>
			<h2>
				<FormattedMessage {...messages.heading} />
			</h2>
			<p>
				<FormattedMessage
					defaultMessage="Welcome to <a>Renewed Tab</a>: a customisable New Tab page, with widgets and beautiful backgrounds."
					values={{
						a: (chunk: any) => (<a href="https://renewedtab.com">{chunk}</a>)
					}} />
			</p>
			<p>
				<FormattedMessage
					defaultMessage={"Click \"Add widget\" in the bottom of the screen to add a widget."} />
				&nbsp;
				<FormattedMessage
					defaultMessage="Also take a look at settings (the cog)." />
			</p>
			<p>
				<FormattedMessage
					defaultMessage=
						"To move, edit, or delete a widget, use the handle that appears in the top-right of the widget. To resize, use the drag handle in the bottom-right." />
			</p>
			<p>
				<FormattedMessage
					defaultMessage="Need help?" />
				&nbsp;
				<FormattedMessage
					defaultMessage="Found a bug, or have a request?" />
				&nbsp;
				<FormattedMessage
					defaultMessage="Check out the <a>Help and FAQ page</a> to see common questions and to get in contact."
					values={{
						a: (chunk: any) => (<a href="https://renewedtab.com/help/">{chunk}</a>)
					}} />
			</p>
		</Panel>);
}

HelpAbout.title = messages.title;
HelpAbout.description = messages.description;

HelpAbout.initialProps = {};

HelpAbout.schema = {} as Schema;

HelpAbout.defaultSize = new Vector2(5, 6);
