
// import the component you want to test
import React from 'react';
import CryptoCompare, { emptyResult, getApikeyAuthorizationHeader, setApikey } from '../../src/index.tsx';
import fixReactDomScope from '../support/fixReactDomScope';

const apikey = "9dbe3a144881f49682bf50733db69eb57b2aaa07f6e71f1fb03fb3dbea257695";
const url = "**/data/price**";

const checkComponent = (amount, currency, selector = ".react-crypto-compare") => {
  cy.contains(amount);
  cy.contains(currency);
  cy.get(selector).should("be.visible");
}
const checkAuthorizationHeader = (alias = "@cryptocompare", key = apikey) => {
  cy.wait(alias).its("request.headers.Authorization").should("eq", getApikeyAuthorizationHeader(key));
}

describe('CryptoCompare component', () => {
  beforeEach(function() {
    // see https://github.com/bahmutov/cypress-react-unit-test/issues/51
    cy.server();
    fixReactDomScope(window);
  });

  describe('Integration tests', () => {
    it('Should convert the currency', function() {
      const amount = 10;
      const to = "BTC";
      const response = {[to]: 0.0002 };
      cy.route(url, response).as("cryptocompare");

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} apikey={apikey} />)

      checkAuthorizationHeader();
      checkComponent(amount * response[to], to);
    })

    it('Should manage a service response error', function() {
      const amount = 10;
      const to = "BTC";
      const response = { Message: "fsym param is empty or null." };
      cy.route(url, response).as("cryptocompare");

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} apikey={apikey} />)

      checkAuthorizationHeader();
      checkComponent(emptyResult, to, ".react-crypto-compare-error");
    })

    it('Should manage silently a network error', function() {
      const amount = 10;
      const to = "BTC";
      cy.route({url, response: "", status: 400}).as("cryptocompare");

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} apikey={apikey} />)

      checkAuthorizationHeader();
      checkComponent(emptyResult, to, ".react-crypto-compare-error");
    })

    it('Should allow to set the apikey in advance', function() {
      const amount = 10;
      const to = "BTC";
      const response = {[to]: 0.0002 };
      cy.route(url, response).as("cryptocompare");

      setApikey(apikey);

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} />)

      checkAuthorizationHeader();
      checkComponent(amount * response[to], to);
    })
  })

  describe('E2E tests', () => {
    it('Should convert the currency', function() {
      const amount = 10;
      const to = "BTC";
      cy.route(url).as("cryptocompare");

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} apikey={apikey} />)
      cy.wait("@cryptocompare").its(`response.body.${to}`).then(conversion => checkComponent(amount * conversion, to, ".react-crypto-compare"));
    })
  })
})
