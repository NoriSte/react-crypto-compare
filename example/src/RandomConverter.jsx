import React from "react";
import CryptoCompare from "react-crypto-compare";

const Counter = () => {
  const [random, setRandom] = React.useState(1000);
  const changeRandom = () => {
    setRandom((1000 * Math.random()).toFixed(2));
  };

  return (
    <div>
      <button onClick={changeRandom}>Random</button>
      <CryptoCompare
        from="EUR"
        to="BTC"
        amount={random}
        apikey="9dbe3a144881f49682bf50733db69eb57b2aaa07f6e71f1fb03fb3dbea257695"
      />
    </div>
  );
};

export default Counter;
