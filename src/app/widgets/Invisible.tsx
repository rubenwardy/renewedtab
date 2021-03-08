import Schema from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import React from 'react';

export default function Invisible(_props: any) {
	return (<></>);
}

Invisible.defaultProps = {};

Invisible.schema = {} as Schema;

Invisible.defaultSize = new Vector2(5, 5);
