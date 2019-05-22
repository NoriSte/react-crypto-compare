
// import the component you want to test
import React from 'react';
import CryptoCompare from '../../src/index.tsx';
import fixReactDomScope from '../support/fixReactDomScope';


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
      cy.route('**/data/price**', response).as("cryptocompare");

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} apikey="9dbe3a144881f49682bf50733db69eb57b2aaa07f6e71f1fb03fb3dbea257695" />)
      cy.wait("@cryptocompare");

      cy.contains(amount * response[to]);
      cy.contains(to);
    })
  })

  describe('E2E tests', () => {
    it('Should covert convert the currency', function() {
      const amount = 10;
      const to = "BTC";
      cy.route('**/data/price**').as("cryptocompare");

      cy.mount(<CryptoCompare from="EUR" to={to} amount={amount} apikey="9dbe3a144881f49682bf50733db69eb57b2aaa07f6e71f1fb03fb3dbea257695" />)
      cy.wait("@cryptocompare").its(`response.body.${to}`).then(conversion => cy.contains(amount * conversion));
      cy.contains(to);
    })
  })
})
