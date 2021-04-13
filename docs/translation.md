# Translating Renewed Tab

**Warning:** text will change, meaning that translations likely need to be
continuously maintained.

## Overview

This is currently done by editing JSON files and making a Merge Request.
In the future, a website for community translations will be set up.

You'll need to look up the two letter
[639-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)
for your language, referred to as `LANG` below.
For example, `en` is English and `fr` is French.

## Creating a new language

1. Go to `src/app/locale/`.
2. Copy `en.json` to `LANG.json`.
3. Add `LANG.json` to `locales` in `src/app/locale/index.tsx`.
4. See editing a language

## Editing a language

1. Open up `src/app/locale/LANG.json` in a text editor.
2. Edit the values of `defaultMessage` keys.

## Contributing

Changes should be contributed back as a Pull/Merge Request on GitLab.

If you don't know how to use Git, you can instead send the `LANG.json` file to
me via email: rw@rubenwardy.com.
