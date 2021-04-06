import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import React from 'react';

export default function HelpAbout(_props: any) {
	return (
		<div className="panel">
			<h2>Renewed Tab Help and Tips</h2>
			<p>
				Welcome to&nbsp;
				<a href="https://renewedtab.rubenwardy.com">Renewed Tab</a>:
				a customisable New Tab page, with widgets and beautiful
				backgrounds.
			</p>
			<p>
				Click "Add widget" in the bottom of the screen to add a widget.
				Also take a look at settings (the cog).
			</p>
			<p>
				To move, edit, or delete a widget, use the handle that appears
				in the top-right of the widget. To resize, use the drag
				handle in the bottom-right.
			</p>
			<p>
				Need help? Found a bug, or have a request?
				Check out the <a href="https://renewedtab.rubenwardy.com/help/">
				Help and FAQ page</a> to see common questions and to get in
				contact.
			</p>
		</div>);
}


HelpAbout.description = "Help for new users of Renewed Tab";

HelpAbout.initialProps = {};

HelpAbout.schema = {} as Schema;

HelpAbout.defaultSize = new Vector2(5, 6);
