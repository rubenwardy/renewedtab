import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';

export default function Invisible(): (JSX.Element | null) {
	return null;
}


Invisible.description = "Shows nothing, useful for layouting purposes";

Invisible.initialProps = {};

Invisible.schema = {} as Schema;

Invisible.defaultSize = new Vector2(5, 5);
