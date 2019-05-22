
// import the component you want to test
import React from 'react';
import CryptoCompare, { emptyResult } from '../../src/index.tsx';
import fixReactDomScope from '../support/fixReactDomScope';

const apikey = "9dbe3a144881f49682bf50733db69eb57b2aaa07f6e71f1fb03fb3dbea257695";
const url = "**/data/price**";

describe('CryptoCompare component', () => {
  beforeEach(function() {
    // see https://github.com/bahmutov/cypress-react-unit-test/issues/51
    cy.server();
    fixReactDomScope(window);
  });

  describe('Integration tests', () => {
    it('Should covert convert the currency', function() {
      const amount = 10;
      const to = "BTC";
      const response = {[to]: 0.0002 };
      cy.route(url, response).as("cryptocompare");

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} apikey={apikey} />)
      cy.wait("@cryptocompare");

      cy.contains(amount * response[to]);
      cy.contains(to);
      cy.get(".react-crypto-compare").should("be.visible");
    })

    it('Should manage a service response error', function() {
      const amount = 10;
      const to = "BTC";
      const response = { Message: "fsym param is empty or null." };
      cy.route(url, response).as("cryptocompare");

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} apikey={apikey} />)
      cy.wait("@cryptocompare");

      cy.contains(emptyResult);
      cy.contains(to);
      cy.get(".react-crypto-compare-error").should("be.visible");
    })

    it('Should manage silently a network error', function() {
      const amount = 10;
      const to = "BTC";
      cy.route({url, response: "", status: 400}).as("cryptocompare");

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} apikey={apikey} />)
      cy.wait("@cryptocompare");

      cy.contains(emptyResult);
      cy.contains(to);
      cy.get(".react-crypto-compare-error").should("be.visible");
    })
  })

  describe('E2E tests', () => {
    it('Should covert convert the currency', function() {
      const amount = 10;
      const to = "BTC";
      cy.route(url).as("cryptocompare");

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} apikey={apikey} />)
      cy.wait("@cryptocompare").its(`response.body.${to}`).then(conversion => cy.contains(amount * conversion));
      cy.contains(to);
    })
  })
})
