/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_ReconnectInputs */

const en_bank_connection_reconnect = /** @type {(inputs: Bank_Connection_ReconnectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reconnect`)
};

const fr_bank_connection_reconnect = /** @type {(inputs: Bank_Connection_ReconnectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reconnecter`)
};

/**
* | output |
* | --- |
* | "Reconnect" |
*
* @param {Bank_Connection_ReconnectInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_reconnect = /** @type {((inputs?: Bank_Connection_ReconnectInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_ReconnectInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_reconnect(inputs)
	return en_bank_connection_reconnect(inputs)
});