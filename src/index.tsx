import axios, { AxiosResponse } from "axios";
import c from "classnames";
import * as PropTypes from "prop-types";
import * as React from "react";
import { is } from "typescript-is-type";

// cryptocompare.com success response
export type CryptoCompareValues = {
  [key: string]: number;
};
// cryptocompare.com error response (the only fields we care about)
export type CryptoCompareError = {
  Message: string;
};
export type CryptoCompareResponse = CryptoCompareValues | CryptoCompareError;

/**
 * @typedef {Object} Props
 * @property {string} apikey - the cryptocompare.com api key
 * @property {string} from - the origin cryptocurrency/currency symbol of interest
 * @property {string} to - the destination cryptocurrency/currency symbol of interest
 * @property {number} amount - the amount to be converted
 */
export type Props = {
  apikey?: string;
  from: string;
  to: string;
  amount: number;
};

let globalApikey: string = "";

/**
 * Set the API key for every future call
 * @param {string} apikey
 */
export const setApikey = (apikey: string) => (globalApikey = apikey);
/**
 * Get the authorization header for the cryptocompare.com API
 * @param {string} apikey
 * @return {string}
 */
export const getApikeyAuthorizationHeader = (apikey: string) => `Apikey ${apikey}`;
/**
 * Get the cryptocompare.com API URL
 * @param {string} from
 * @param {string} to
 * @return {string}
 */
export const getApiUrl = (from: string, to: string) =>
  `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`;
/**
 * Get the currency amount to be printed
 * @param {number} conversionRate
 * @param {number} amount
 * @return {string}
 */
export const getAmount = (amount: number, conversionRate: number) =>
  (conversionRate * amount).toFixed(8);

// what the user sees when the result isn't available
export const emptyResult = "---";

// the default CSS classes applied to the component
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
const CryptoCompare: React.FunctionComponent<Props> = ({ apikey, from, to, amount }: Props) => {
  // required props checks
  if (!apikey && !globalApikey) {
    throw new Error("'apikey' (or a global apikey set with 'setApikey') is required");
  }
  if (!from) {
    throw new Error("'from' is required");
  }
  if (!to) {
    throw new Error("'to' is required");
  }
  if (isNaN(amount)) {
    throw new Error("'amount' must be a number");
  }

  // soft props checks
  if (from.includes(",")) {
    console.info("Multiple currencies aren't supported yet");
    from = from.split(",")[0];
  }
  if (to.includes(",")) {
    console.info("Multiple currencies aren't supported yet");
    to = to.split(",")[0];
  }

  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [data, setData] = React.useState<CryptoCompareValues | undefined>(undefined);

  // see https://medium.com/@pshrmn/react-hook-gotchas-e6ca52f49328
  const mounted = React.useRef(true);
  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const setStateIfMounted = (setStateFunction, value) => {
    if (mounted.current) {
      setStateFunction(value);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const headers = {
        Authorization: getApikeyAuthorizationHeader(apikey || globalApikey)
      };

      setStateIfMounted(setLoading, true);
      let response: AxiosResponse<CryptoCompareResponse>;
      try {
        response = await axios.get(getApiUrl(from, to), { headers });
      } catch (e) {
        // the component must never fail
        response = e.response;
        setStateIfMounted(setError, "Error");
        console.error(response);
      }

      // error management
      if (response && response.data && is<CryptoCompareError>(response.data, "Message")) {
        setStateIfMounted(setError, response.data.Message);
      }

      setStateIfMounted(setLoading, false);

      // success management
      if (response && response.data && is<CryptoCompareValues>(response.data, to)) {
        setStateIfMounted(setData, response.data);
      }
    };
    fetchData();
  }, []); // calls the effect when the component mounts only

  React.useEffect(() => {
    if (error) {
      console.error("react-crypto-compare", error);
    }
  }, [error]); // calls the effect when the error changes

  let result = emptyResult;
  if (data && is<CryptoCompareValues>(data, to)) {
    result = getAmount(amount, data[to]);
  }

  return (
    <div className={c(defaultClassName, { [errorClassName]: error, [loadingClassName]: loading })}>
      <span className={amountClassName}>{result}</span>{" "}
      <span className={currencyClassName}>{to}</span>
    </div>
  );
};

CryptoCompare.propTypes = {
  apikey: (props: Props, propName: string, componentName: string) => {
    let error: Error | null = null;
    const prop = props[propName];
    if (prop && typeof prop !== "string") {
      error = new Error(`${componentName} - ${propName} must be a string`);
    }
    if (!prop && !globalApikey) {
      error = new Error(
        `${componentName} - ${propName} must be defined, set the component prop or use the 'setApikey' function`
      );
    }
    return error;
  },
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired
};

export default CryptoCompare;
