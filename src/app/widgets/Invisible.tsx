import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { defineMessages } from 'react-intl';


const messages = defineMessages({
	description: {
		defaultMessage: "Shows nothing, useful for layouting purposes",
	},
})


export default function Invisible(): (JSX.Element | null) {
	return null;
}


Invisible.description = messages.description;

Invisible.initialProps = {};

Invisible.schema = {} as Schema;

Invisible.defaultSize = new Vector2(5, 5);
