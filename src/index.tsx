import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
import { is } from 'typescript-is-type';


export type CryptoCompareValues = {
  [key: string]: number
}
export type CryptoCompareError = {
  Message: string
}
export type CryptoCompareResponse = CryptoCompareValues|CryptoCompareError;

/**
* @typedef {Object} Props
* @property {string} apikey - (optional) the refresh interval (in ms)
* @property {string} from - the origin cryptocurrency/currency symbol of interest
* @property {string} to - the destination cryptocurrency/currency symbol of interest
* @property {number} amount - the amount to be converted
* @property {number} refreshInterval - (optional) the refresh interval (in ms)
*/
export type Props = {
  apikey?: string,
  from: string,
  to: string,
  amount: number,
  refreshInterval?: number,
}

let globalApikey:string = '';

/**
* Set the API key for every future call
* @param {string} apikey
*/
export const setApikey = (apikey:string) => globalApikey = apikey;


export const emptyResult = "---";

/**
* @param props
* @param props.apikey (optional) the refresh interval (in ms)
* @param props.from The email of the user.
* @param props.to The email of the user.
* @param props.amount The email of the user.
* @param props.refreshInterval The email of the user.
*/
const CryptoCompare = ({
  apikey,
  from,
  to,
  amount,
  refreshInterval
}:Props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string|undefined>(undefined);
  const [data, setData] = React.useState<CryptoCompareValues|undefined>(undefined);

  if(!apikey && !globalApikey) {
    throw(new Error("'apikey' (or a global apikey set with 'setApikey') is required"));
  }
  if(!from) {
    throw(new Error("'from' is required"));
  }
  if(!to) {
    throw(new Error("'to' is required"));
  }
  if(isNaN(amount)) {
    throw(new Error("'amount' must be a number"));
  }

  React.useEffect(() => {
    const fetchData = async () => {

      const headers = {
        Authorization: `Apikey ${apikey || globalApikey}`,
        "Content-Type": "application/json"
      };

      setLoading(true);
      let response: AxiosResponse<CryptoCompareResponse>;
      try {
        response = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`, {headers});
      } catch(e){
        response = e.response;
      }

      if(response && response.data && is<CryptoCompareError>(response.data, "Message")) {
        setError((response.data as CryptoCompareError).Message);
      } else {
        setError("Error");
      }

      setLoading(false);
      if(response && response.data && is<CryptoCompareValues>(response.data, to)) {
        setData(response.data)
      }
    };
    fetchData();
  }, []);

  const printResult = !!data && is<CryptoCompareValues>(data, to);

  return (
    <div className={`react-crypto-compare ${error && 'react-crypto-compare-error'} ${loading && 'react-crypto-compare-loading'}`}>
      <pre>{JSON.stringify({
        apikey,
        from,
        to,
        amount,
        refreshInterval,
        loading,
        error,
        data,
      }, null, 2)}</pre>
      <span className="react-crypto-compare-amount">
        {printResult ? is<CryptoCompareValues>(data, to) && data[to] * amount : emptyResult}
      </span>{" "}
      <span className="react-crypto-compare-currency">{to}</span>
    </div>
    )
  }

  export default CryptoCompare;
