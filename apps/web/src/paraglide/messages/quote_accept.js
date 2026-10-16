/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_AcceptInputs */

const en_quote_accept = /** @type {(inputs: Quote_AcceptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as accepted`)
};

const fr_quote_accept = /** @type {(inputs: Quote_AcceptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer accepté`)
};

/**
* | output |
* | --- |
* | "Mark as accepted" |
*
* @param {Quote_AcceptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_accept = /** @type {((inputs?: Quote_AcceptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_AcceptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_accept(inputs)
	return en_quote_accept(inputs)
});