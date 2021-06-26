# User Custom CSS

Renewed Tab allows you to provide Custom CSS rules in Settings > Theme.
Please note that this is an **experimental** feature, which means that it may
break without warning.

In order to create your rules, you will need to read up on the CSS language.

## Basics

### Selectors

Key classes and elements:

* Widgets are contained in elements with both the `widget` and
  `widget-$TYPE` classes, where type is the technical type name of the widget
  lowercased. For example: `widget widget-quotes`.
* A `.panel` is a containing element that has a blurred semi-transparent
  background. It is used to hold a widget's contents and also for modal dialogs.
  (In the future, modals will probably use a different class.)
* A `.panel-invis` contains a widget's contents without a panel background.

### Resources

The Inspect element tool is very useful to find out the classes and IDs used to
reference a particular element.

You may also find the
[source SCSS code](https://gitlab.com/renewedtab/renewedtab/-/tree/master/src/app/scss)
useful. (SCSS is a superset language that compiles to CSS.)

## Examples

### Misc examples

```css
/* Hot pink panel backgrounds */
.panel {
    background: rgba(255, 105, 180, 0.6);
}

/* Panels with no background have an outline */
.panel-invis {
    border: 1px solid rgba(0, 0, 0, 0.5);
}

/* Color links pointing to example.com pink */
.links li[data-hostname="example.com"] {
    color: pink;
}

/* Color links containing LGBT in the title rainbow */
.links li[data-title~="LGBT"] .title {
    background-image: linear-gradient(to right, red, orange, yellow, green, indigo, violet);
    color: transparent;

    /* This is non-standard CSS, so may not work in all browsers. */
    -webkit-background-clip: text;
}
```

### Fullwidth images in Links

```css
/* Make icon full width with no right margin */
.links li[data-title=""] .icon {
    margin: 0 !important;
    height: auto;
    width: 100%;
    max-height: none;
}

/* Remove padding from link row */
.links li[data-title=""] a {
    padding: 0 !important;
    font-size: inherit;
    line-height: inherit;
    transition: filter 0.15s ease-in-out;
}

/* Brighten on hover */
.links li[data-title=""] a:hover {
    filter: brightness(1.05);
}
```
