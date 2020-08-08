# @knappi/addon-storyshots-selenium

[![NPM version](https://img.shields.io/npm/v/@knappi/addon-storyshots-selenium.svg)](https://npmjs.com/package/@knappi/addon-storyshots-selenium)
[![Node.js CI](https://github.com/nknapp/addons-storyshots-selenium/workflows/Node.js%20CI/badge.svg)](https://github.com/nknapp/addons-storyshots-selenium/actions?query=workflow%3A%22Node.js+CI%22)
[![PayPal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GB656ZSAEQEXN&source=url)
[![Liberapay](https://img.shields.io/badge/liberapay-donate-yellow.svg)](https://liberapay.com/nils.knappmeier/donate)

> Compare screenshots of your storybook with multiple browsers and
> multiple screen sizes

# Overview / Purpose

"\$" is a plugin for Storybook's "storyshot" addons that allows you to
visually compare your stories in multiple browsers and multiple screen
sizes. What?

- [Storybook](https://storybook.js.org) helps you structure your UI
  components. You can develop components independently of the whole
  app, and describe them in "stories". Each story is small web-page
  that shows your component in a certain state. It's pretty cool...

- [Storyshots](https://storybook.js.org/docs/testing/structural-testing/)
  is an add-on to storybook. It allows you to take snapshots of each
  of your stories and compare them to old versions. The test ensures
  that they do not change and if they do, you can verify if the change
  is wanted or not.

By default, StoryShots uses
[React Tree Snapshots](https://jestjs.io/blog/2016/07/27/jest-14.html).
Using "", you can take screenshots of your components using browser
remote controlled via [Selenium](https://www.selenium.dev/). Those
screenshots are visually compared to a baseline-screenshot using the
package
[jest-image-snapshot](https://npmjs.com/package/jest-image-snapshot).
Differences lead to a failing test and the difference will be added as
an image-file (which can be added to your CI's artifacts).

"" also allows you to test responsive components by specifying
multiple screen sizes. It also allows you to specify multiple
browsers.

You can setup a Selenium grid yourself, use a
[docker-image](https://github.com/containerize-my-server/docker-image-selenium-with-tunnel)
or rent services like [BrowserStack](https://browserstack.com) or
[SauceLabs](https://saucelabs.com/).

> At this point, I should mention that BrowserStack provided a free
> account to me very quickly, so that I could automated tests for this
> component using BrowserStack. I am not anyhow affiliated with
> BrowserStack however.

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

The integration-tests in this repository are a good example for how to
setup tests using this repository.

- The
  [docker-selenium integration test](integration-tests/docker-selenium.test.ts)
  uses the docker-image
  [docker-image](https://github.com/containerize-my-server/docker-image-selenium-with-tunnel)
  to start a selenium grid. It is based upon
  [elgalu/docker-selenium](https://github.com/elgalu/docker-selenium)
  but includes a "reverse-tunnel" that can be used to access the
  storybook-server on the host, or on the "build-container" in
  Gitlab-CI.
- The
  [BrowerStack integration test](integration-tests/browserstack.test.ts-snapshots)
  uses BrowserStack-Automate to create screenshots. It starts a
  BrowserStackLocal-Tunnel to give BrowserStack access to your local
  server.
- You can also have a look at the
  [Github-Actions](.github/workflows/node.js.yml) configuration for
  running the tests, especially at the artifacts definition, that
  allows you to inspect test-results that have failed in CI.

I am planning to provide real example repositories at some point, also
for "Gitlab-CI".

# API documentation

The API-docs are generated with TypeDoc. The main entrypoints is

- The [imageSnapshot](./apidocs/README.md#imagesnapshot)-function

Some utilities can be used as well to facilitate configuration:

- [doNothing](README.md#donothing)
- [waitMillis](README.md#waitmillis)

# How it works

Taking a screenshot of the correct size is not easy (as I had to find
out), because decorations have different sizes in different browsers,
and some browsers have a minimal window-size.

"" uses an iframe to simulate the browser window. The workflow for
screenshots in multiple window sizes is the following:

- Open `about:blank`
- Insert an iframe, loading the storybook-story.
- Execute hook "beforeFirstScreenshot", which by default waits a
  couple of seconds to let the page load completely.
- Resize the iframe to the first specified width and height, execute
  "beforeEachScreenshot", take a screenshot and compare.
- Resize the iframe to the specified width and height, execute
  "beforeEachScreenshot", take a screenshot and compare.
- and so on...

This process is executed in parallel for each browser. The
selenium-drivers are initialized before all tests and closed
afterwards.

# License

`@knappi/addon-storyshots-selenium` is published under the
MIT-license.

See [LICENSE.md](LICENSE.md) for details.

# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).
