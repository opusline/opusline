/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Reopen_FailedInputs */

const en_quote_reopen_failed = /** @type {(inputs: Quote_Reopen_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The quote could not be reopened.`)
};

const fr_quote_reopen_failed = /** @type {(inputs: Quote_Reopen_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le devis n'a pas pu être rouvert.`)
};

/**
* | output |
* | --- |
* | "The quote could not be reopened." |
*
* @param {Quote_Reopen_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_reopen_failed = /** @type {((inputs?: Quote_Reopen_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Reopen_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_reopen_failed(inputs)
	return en_quote_reopen_failed(inputs)
});