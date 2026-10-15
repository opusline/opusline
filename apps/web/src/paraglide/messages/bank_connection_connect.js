/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_ConnectInputs */

const en_bank_connection_connect = /** @type {(inputs: Bank_Connection_ConnectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connect my bank`)
};

const fr_bank_connection_connect = /** @type {(inputs: Bank_Connection_ConnectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connecter ma banque`)
};

/**
* | output |
* | --- |
* | "Connect my bank" |
*
* @param {Bank_Connection_ConnectInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_connect = /** @type {((inputs?: Bank_Connection_ConnectInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_ConnectInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_connect(inputs)
	return en_bank_connection_connect(inputs)
});