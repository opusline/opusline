/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_SetupInputs */

const en_bank_connection_setup = /** @type {(inputs: Bank_Connection_SetupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set up`)
};

const fr_bank_connection_setup = /** @type {(inputs: Bank_Connection_SetupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configurer`)
};

/**
* | output |
* | --- |
* | "Set up" |
*
* @param {Bank_Connection_SetupInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_setup = /** @type {((inputs?: Bank_Connection_SetupInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_SetupInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_setup(inputs)
	return en_bank_connection_setup(inputs)
});