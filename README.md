# react-crypto-compare

A simple cryptocurrencies converter component based on
[https://min-api.cryptocompare.com](https://min-api.cryptocompare.com). Min React version: 16.8.

[![Build Status](https://travis-ci.com/NoriSte/react-crypto-compare.svg?branch=master)](https://travis-ci.com/NoriSte/react-crypto-compare)
[![Build Cron](https://img.shields.io/badge/build%20cron-weekly-44cc11.svg)](https://travis-ci.com/NoriSte/react-crypto-compare)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![Cypress Dashboard](https://img.shields.io/static/v1?label=Cypress&message=Dashboard&color=00BF88)](https://dashboard.cypress.io/#/projects/zc8g3j/runs)
<br />
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FNoriSte%2Freact-crypto-compare.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FNoriSte%2Freact-crypto-compare?ref=badge_shield)
[![Open Source
Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![TypeScript](https://badges.frapsoft.com/typescript/love/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

- [react-crypto-compare](#react-crypto-compare)
  - [What this component does](#what-this-component-does)
  - [Install](#install)
  - [How to use](#how-to-use)
  - [CSS Classes](#css-classes)
  - [Working example](#working-example)
  - [Possible improvements](#possible-improvements)
  - [Why](#why)
  - [Contributing](#contributing)
  - [Contributors](#contributors)

## What this component does

- it calls the [cryptocompare.com "Single Symbol Price"
  API](https://min-api.cryptocompare.com/documentation?key=Price&cat=SingleSymbolPriceEndpoint) and
  shows the result
- it allows to set the [cryptocompare.com apikey](https://www.cryptocompare.com/cryptopian/api-keys) once and reuse it
- it comes unstyled, you can customize it using its [global classes](#css-classes)
- it manages silently every network error (it logs errors into the console)

## Install

`npm install --save react-crypto-compare`

## How to use

First of all, you need a [cryptocompare.com api
key](https://www.cryptocompare.com/cryptopian/api-keys).

Then

```jsx
import CryptoCompare from "react-crypto-compare";
// ...
<CryptoCompare from="EUR" to="BTC" amount={10} apikey="<YOUR_CRYPTOCOMPARE.COM_APIKEY>" />;
```

it renders

```html
<div class="react-crypto-compare">
  <span class="react-crypto-compare-amount">0.001408</span>
  <span class="react-crypto-compare-currency">BTC</span>
</div>
```

You can set the api key just once to avoid passing it to the component

```jsx
import CryptoCompare, { setApikey } from "react-crypto-compare";
setApikey("<YOUR_CRYPTOCOMPARE.COM_APIKEY>");
// ...
<CryptoCompare from="EUR" to="BTC" amount={10} />;
```

please note that the `apikey` prop, if passed, takes the precedence over the global api key set
though `setApikey`.

## CSS Classes

You can customize the look&feel of the component using its classes

```
.react-crypto-compare
.react-crypto-compare-error
.react-crypto-compare-loading
```

and its children ones

```
.react-crypto-compare-amount
.react-crypto-compare-currency
```

## Working example

Run

```bash
cd example && npm run start
```

## Possible improvements

- managing the decimals for every cryptocurrency (at the moment fixed at eight thinking about Bitcoin)
- passing the CSS classes from the parent component
- adding an interval-based refresh to have always the most updated conversion
- managing multiple currencies conversion in a single component
- adding a render prop to manage the rendered markup from the outside

## Why

I've developed it because I'd some spare time (more less 4 hours) and I'd like to play with:

- [create-react-library](https://www.npmjs.com/package/create-react-library)
- [cypress-react-unit-test](https://github.com/bahmutov/cypress-react-unit-test)

## Contributing

PR or issues are welcome 👋

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://twitter.com/NoriSte"><img src="https://avatars0.githubusercontent.com/u/173663?v=4" width="100px;" alt="Stefano Magni"/><br /><sub><b>Stefano Magni</b></sub></a><br /><a href="https://github.com/NoriSte/react-crypto-compare/commits?author=NoriSte" title="Code">💻</a> <a href="https://github.com/NoriSte/react-crypto-compare/commits?author=NoriSte" title="Documentation">📖</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
