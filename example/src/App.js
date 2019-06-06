import React, { Component } from "react";
import CryptoCompare from "react-crypto-compare";

export default class App extends Component {
  currencies = ["EUR", "USD"];
  constructor() {
    super();
    this.setRandom = this.setRandom.bind(this);
    this.toggleComponent = this.toggleComponent.bind(this);
    this.toggleCurrency = this.toggleCurrency.bind(this);
    this.state = {
      currency: this.currencies[0],
      random: this.getRandom(),
      mountComponent: true
    };
  }

  render() {
    return (
      <div style={{ padding: "1em", fontSize: "1.4em" }}>
        <h1>React Crypto Compare</h1>
        <p>
          A simple cryptocurrencies converter component based on{" "}
          <a href="https://min-api.cryptocompare.com" target="_blank" rel="noopener noreferrer">
            cryptocompare.com
          </a>
          .
        </p>
        <button onClick={this.toggleComponent}>Mount/Unmount component</button>
        {this.state.mountComponent && (
          <div style={{ marginTop: "1em" }}>
            <CryptoCompare
              from={this.state.currency}
              to="BTC"
              amount={this.state.random}
              apikey="9dbe3a144881f49682bf50733db69eb57b2aaa07f6e71f1fb03fb3dbea257695"
            />
            <button onClick={this.setRandom}>Randomize value</button>
            <button onClick={this.toggleCurrency}>Toggle {this.currencies.join("/")}</button>
          </div>
        )}
      </div>
    );
  }

  getRandom() {
    return Math.round(1000 * Math.random());
  }

  setRandom() {
    this.setState({
      random: this.getRandom()
    });
  }
  toggleCurrency() {
    this.setState({
      currency: this.currencies[this.currencies.indexOf(this.state.currency) ? 0 : 1]
    });
  }
  toggleComponent() {
    this.setState({
      mountComponent: !this.state.mountComponent
    });
  }
}
