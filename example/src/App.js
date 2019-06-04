import React, { Component } from "react";
import CryptoCompare from "react-crypto-compare";

export default class App extends Component {
  constructor() {
    super();
    this.setRandom = this.setRandom.bind(this);
    this.state = {
      random: this.getRandom()
    };
  }

  render() {
    return (
      <div>
        <CryptoCompare
          from="EUR"
          to="BTC"
          amount={this.state.random}
          apikey="9dbe3a144881f49682bf50733db69eb57b2aaa07f6e71f1fb03fb3dbea257695"
        />
        <button onClick={this.setRandom}>Randomize value</button>
      </div>
    );
  }

  getRandom() {
    return (1000 * Math.random()).toFixed(2);
  }

  setRandom() {
    this.setState({
      random: this.getRandom()
    });
  }
}
