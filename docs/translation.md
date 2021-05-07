# Translating Renewed Tab

Please note that the source text will change over time, meaning that
translations will break and need to be updated. You're under no obligation
to do this, just don't get upset if translations become incomplete.


## Overview

Translations are currently done by editing JSON and HTML files, and making a
Merge Request. In the future, a website for community translations will
be set up.

You'll need to look up the
[language code](http://www.lingoes.net/en/translator/langcode.htm)
for your language, referred to as `LANG` below.
For example, `en` is English and `fr` is French.

You should prefer the two letter codes, but you may also translate for a
specific dialect such as Mexican Spanish (`es-MX`).


## Language files

### App text: `LANG.json`

Translations for in-app text can be found at `src/app/locale`.

`en.json` is the source template. You should copy this file when creating a new
language.

### Store text: `store/LANG.html`

Translations for the Firefox and Chrome stores can be found at
`src/app/locale/store`.

`en.html` is the source template. You should copy this file when creating a new
language.


## Guides

### Creating a new language

0. Find your [language code](http://www.lingoes.net/en/translator/langcode.htm).
1. Go to `src/app/locale/`.
2. Copy `en.json` to `LANG.json`.
3. Copy `store/en.html` to `store/LANG.html`.
4. Add `LANG.json` to `locales` in `src/app/locale/index.tsx`.
3. See Editing a language.

### Editing a language

In-app text:

1. Open up `src/app/locale/LANG.json` in a text editor.
2. Edit the values of `defaultMessage` keys.

Firefox/Chrome text:

1. Open up `src/app/locale/store/LANG.md` in a text editor.
2. Edit entire content, making sure to keep HTML tags.

### Contributing

Changes should be contributed back as a Pull/Merge Request on GitLab.

If you don't know how or want to use Git, you can instead send the `LANG.json` /
`LANG.html` file(s) to me via email: rw@rubenwardy.com.

If sending via email, make sure to say how you want to be credited on Git.
This requires:

1. A name to show
2. An email, or a GitHub or GitLab account. Emails are public.

You may also wish to update the `translation_credits` string to include your name.

Also make sure to include the name of the language to be shown in
the dropdown in Settings > General.
