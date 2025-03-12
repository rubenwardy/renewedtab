# Widget API

## Creating a widget

You need to:

* Create a file for it in `src/app/widgets` and define a React component.
* Assign members to implement the WidgetFactory interface.
* Add it to the WidgetTypes in `src/app/widgets/index.tsx`

## Hello World Example

Create the file: `src/app/widgets/HelloWorld.tsx`.

Widgets are defined as an object that implements the `WidgetType` interface.
The interface contains the component and various meta information.

After adding implementing the interface, you should export it and then add it
to `WidgetTypes` in `src/app/widgets/index.tsx`.


```ts
import Panel from 'app/components/Panel';
import { type } from 'app/utils/Schema';
import { Vector2 } from 'app/utils/Vector2';
import { WidgetProps, WidgetType } from 'app/Widget';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';


const messages = defineMessages({
	title: {
		defaultMessage: "Hello World",
		description: "Hello World widget",
	},

	description: {
		defaultMessage: "A helpful description shown in the create widget dialog",
		description: "Hello World widget description",
	},

	yourName: {
		defaultMessage: "Your name",
		description: "Hello World: label",
	},
});


interface HelloWorldProps {
	name: string;
}


function HelloWorld(props: WidgetProps<HelloWorldProps>) {
	return (
		<Panel {...props.theme} className="vertical-middle">
			<FormattedMessage
					defaultMessage="Hello {name}!"
					values={{ name: props.props.name }}>
		</Panel>);
}


const widget: WidgetType<HelloWorldProps> = {
	Component: HelloWorld,
	title: messages.title,
	description: messages.description,
	defaultSize: new Vector2(5, 1),
	initialProps: {
		name: "",
	},
	schema: {
		name: type.string(messages.yourName),
	},
};
export default widget;
```

## Schema

Schema is a key-value object used to define the types that are expected.

It's used to provide automatic forms to edit widgets.

See the `type` namespace in Schema.ts for the types, these functions should be
used when defining Schemas.
