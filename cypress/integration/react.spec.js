/// <reference types="Cypress" />

// import the component you want to test
import React from "react";
import CryptoCompare, {
  amountClassName,
  currencyClassName,
  defaultClassName,
  emptyResult,
  errorClassName,
  getAmount,
  getApikeyAuthorizationHeader,
  getApiUrl,
  loadingClassName,
  setApikey
} from "../../src/index.tsx";
import fixReactDomScope from "../support/fixReactDomScope";

describe("CryptoCompare component", () => {
  const amount = 10;
  const from = "EUR";
  const to = "BTC";
  const apikey = "9dbe3a144881f49682bf50733db69eb57b2aaa07f6e71f1fb03fb3dbea257695";
  const url = "**/data/price**";
  const response = { [to]: 0.0002 };

  const checkComponent = (amount, currency, selector = `.${defaultClassName}`) => {
    cy.contains(amount);
    cy.contains(currency);
    cy.get(selector).should("be.visible");
    cy.get(`.${amountClassName}`).should("be.visible");
    cy.get(`.${currencyClassName}`).should("be.visible");
  };
  const waitAndcheckApikey = (alias = "@cryptocompare", key = apikey) => {
    cy.wait(alias).then(xhr => {
      expect(xhr.url).to.eq(getApiUrl(from, to));
      expect(xhr.request.headers).to.have.property(
        "Authorization",
        getApikeyAuthorizationHeader(key)
      );
    });
  };

  beforeEach(function() {
    cy.server();
    // see https://github.com/bahmutov/cypress-react-unit-test/issues/51
    fixReactDomScope(window);
  });

  describe("Integration tests", () => {
    it("Should convert the currency", function() {
      cy.route(url, response).as("cryptocompare");
      cy.mount(<CryptoCompare from={from} to={to} amount={amount} apikey={apikey} />);
      cy.get(`.${loadingClassName}`).should("be.visible");
      waitAndcheckApikey();
      checkComponent(getAmount(0, response[to]), to);
    });

    it("Should manage a service response error", function() {
      const response = { Message: "fsym param is empty or null." };
      cy.route(url, response).as("cryptocompare");
      cy.mount(<CryptoCompare from={from} to={to} amount={amount} apikey={apikey} />);
      waitAndcheckApikey();
      checkComponent(emptyResult, to, `.${errorClassName}`);
    });

    it("Should manage silently a network error", function() {
      cy.route({ url, response: "", status: 400 }).as("cryptocompare");
      cy.mount(<CryptoCompare from={from} to={to} amount={amount} apikey={apikey} />);
      waitAndcheckApikey();
      checkComponent(emptyResult, to, `.${errorClassName}`);
    });

    it("Should allow to set the api key in advance", function() {
      cy.route(url, response).as("cryptocompare");
      setApikey(apikey);
      cy.mount(<CryptoCompare from={from} to={to} amount={amount} />);
      waitAndcheckApikey();
      checkComponent(getAmount(amount, response[to]), to);
    });

    it("Should give precedence to the passed api key", function() {
      cy.route(url, response).as("cryptocompare");
      setApikey("global-apikey");
      cy.mount(<CryptoCompare from={from} to={to} amount={amount} apikey={apikey} />);
      waitAndcheckApikey();
      checkComponent(getAmount(amount, response[to]), to);
    });

    it("Should manage multiple currencies selecting the first one", function() {
      cy.route(url, response).as("cryptocompare");
      cy.mount(
        <CryptoCompare from={`${from},USD`} to={`${to},BCH`} amount={amount} apikey={apikey} />
      );
      waitAndcheckApikey();
      checkComponent(getAmount(amount, response[to]), to);
    });
  });

  describe("E2E tests", () => {
    it("Should convert the currency", function() {
      cy.route(url).as("cryptocompare");
      cy.mount(<CryptoCompare from={from} to={to} amount={amount} apikey={apikey} />);
      cy.wait("@cryptocompare")
        .its(`response.body.${to}`)
        .then(conversionRate =>
          checkComponent(getAmount(amount, conversionRate), to, `.${defaultClassName}`)
        );
    });
  });
});
