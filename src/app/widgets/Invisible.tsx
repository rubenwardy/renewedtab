import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import React from 'react';

export default function Invisible(_props: any): (JSX.Element | null) {
	return null;
}


Invisible.description = "Shows nothing, useful for layouting purposes";

Invisible.initialProps = {};

Invisible.schema = {} as Schema;

Invisible.defaultSize = new Vector2(5, 5);
