# @knappi/addon-storyshots-selenium

[![NPM version](https://img.shields.io/npm/v/@knappi/addon-storyshots-selenium.svg)](https://npmjs.com/package/@knappi/addon-storyshots-selenium)
[![Node.js CI](https://github.com//workflows/Node.js%20CI/badge.svg)](https://github.com//actions?query=workflow%3A%22Node.js+CI%22)
[![PayPal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GB656ZSAEQEXN&source=url)
[![Liberapay](https://img.shields.io/badge/liberapay-donate-yellow.svg)](https://liberapay.com/nils.knappmeier/donate)

> Compare screenshots of your storybook with multiple browsers and
> multiple screen sizes

TODO

- docs
  - [ ] Mention mechanism of viewport setup and why the actual size of
        a screenshot maybe lower than the selenium screen size
    - Browser decorations
  - [ ] describe storybook configuration when trying to use IE in
        browserstack ('@storybook/preset-typescript' and custom
        babel-config in .storybook
  - [ ] describe the problem with multiple browser-stack-tunnels in
        parallel build jobs
    - https://www.browserstack.com/local-testing/automate#multiple-local-testing-connections

# Installation

```
npm install @knappi/addon-storyshots-selenium
```

# Usage

The following example demonstrates how to use this module:

```js
```

This will generate the following output

```

```

# API documentation

The API-docs are generated with TypeDoc. The main entrypoints is

- The [imageSnapshot](./apidocs/README.md#imagesnapshot)-function

Some utilities can be used as well to facilitate configuration:

- [doNothing](README.md#donothing)
- [waitMillis](README.md#waitmillis)

# License

`@knappi/addon-storyshots-selenium` is published under the
MIT-license.

See [LICENSE.md](LICENSE.md) for details.

# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).
