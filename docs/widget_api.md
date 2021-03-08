# Widget API

## Creating a widget

You need to:

* Create a file for it in `src/app/widgets` and define a React component.
* Assign members to implement the WidgetFactory interface.
* Add it to the WidgetTypes in `src/app/widgets/index.tsx`

## Hello World Example

Widgets are React components and must implement the `WidgetFactory` interface.
This is done by assigning properties to the function, as seen below.

Here's an example:

```ts
import Schema from 'app/utils/Schema';
import React from 'react';

interface HelloWorldProps {
	name: string;
}

export default function HelloWorld(props: HelloWorldProps) {
	return (
		<div className="panel">
			<p>Hello {props.name}</p>
		</div>);
}

// Default values for props
HelloWorld.defaultProps = {
	name: "",
};

// Schema for props, see below
HelloWorld.schema = {
	name: "string",
} as Schema;

// Default size on grid when created
HelloWorld.defaultSize = new Vector2(5, 1);
```

## Schema

Schema is a key-value object used to define the types that are expected.

It's used to provide automatic forms to edit widgets.

Valid values:

* Any JavaScript type name, as returned by `typeof`.
* A class.
* One of:
	* `perm_url`: URL, but will ask the user to grant permission
	  to the host when using as an extension and the URL is blocked
	  by CORS.