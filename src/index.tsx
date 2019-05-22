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
* @property {string} apikey - the cryptocompare.com api key
* @property {string} from - the origin cryptocurrency/currency symbol of interest
* @property {string} to - the destination cryptocurrency/currency symbol of interest
* @property {number} amount - the amount to be converted
*/
export type Props = {
  apikey?: string,
  from: string,
  to: string,
  amount: number,
}

let globalApikey:string = '';

/**
* Set the API key for every future call
* @param {string} apikey
*/
export const setApikey = (apikey:string) => globalApikey = apikey;
/**
* Get the authorization header for the cryptocompare.com API
* @param {string} apikey
* @return {string}
*/
export const getApikeyAuthorizationHeader = (apikey:string) => `Apikey ${apikey}`;
/**
* Get the cryptocompare.com API URL
* @param {string} from
* @param {string} to
* @return {string}
*/
export const getApiUrl = (from:string, to:string) => `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;


export const emptyResult = "---";
export const defaultClassName = "react-crypto-compare";
export const errorClassName = "react-crypto-compare-error";
export const loadingClassName = "react-crypto-compare-loading";
export const amountClassName = "react-crypto-compare-amount";
export const currencyClassName = "react-crypto-compare-currency";

/**
* @param props
* @param props.apikey the cryptocompare.com api key
* @param props.from The email of the user.
* @param props.to The email of the user.
* @param props.amount The email of the user.
*/
const CryptoCompare = ({
  apikey,
  from,
  to,
  amount
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

  if(from.includes(",")) {
    console.info("Multiple currencies aren't supported yet");
    from = from.split(",")[0];
  }
  if(to.includes(",")) {
    console.info("Multiple currencies aren't supported yet");
    to = to.split(",")[0];
  }

  React.useEffect(() => {
    const fetchData = async () => {

      const headers = {
        Authorization: getApikeyAuthorizationHeader(apikey || globalApikey)
      };

      setLoading(true);
      let response: AxiosResponse<CryptoCompareResponse>;
      try {
        response = await axios.get(getApiUrl(from, to), {headers});
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

  React.useEffect(() => {
    if(error) {
      console.log("react-crypto-compare", error);
    }
  }, [error]);

  const printResult = !!data && is<CryptoCompareValues>(data, to);

  return (
    <div className={`${defaultClassName} ${error ? errorClassName : ''} ${loading ? loadingClassName : ''}`}>
      <span className={amountClassName}>
        {printResult ? is<CryptoCompareValues>(data, to) && data[to] * amount : emptyResult}
      </span>{" "}
      <span className={currencyClassName}>{to}</span>
    </div>
    )
  }

  export default CryptoCompare;
