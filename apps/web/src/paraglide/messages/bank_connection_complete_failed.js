/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Complete_FailedInputs */

const en_bank_connection_complete_failed = /** @type {(inputs: Bank_Connection_Complete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The bank connection did not complete.`)
};

const fr_bank_connection_complete_failed = /** @type {(inputs: Bank_Connection_Complete_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La connexion à la banque n'a pas abouti.`)
};

/**
* | output |
* | --- |
* | "The bank connection did not complete." |
*
* @param {Bank_Connection_Complete_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_complete_failed = /** @type {((inputs?: Bank_Connection_Complete_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Complete_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_complete_failed(inputs)
	return en_bank_connection_complete_failed(inputs)
});