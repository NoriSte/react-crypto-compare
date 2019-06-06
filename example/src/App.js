import React, { Component } from "react";
import CryptoCompare from "react-crypto-compare";

export default class App extends Component {
  constructor() {
    super();
    this.setRandom = this.setRandom.bind(this);
    this.toggleComponent = this.toggleComponent.bind(this);
    this.state = {
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
              from="EUR"
              to="BTC"
              amount={this.state.random}
              apikey="9dbe3a144881f49682bf50733db69eb57b2aaa07f6e71f1fb03fb3dbea257695"
            />
            <button onClick={this.setRandom}>Randomize value</button>
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
  toggleComponent() {
    this.setState({
      mountComponent: !this.state.mountComponent
    });
  }
}
