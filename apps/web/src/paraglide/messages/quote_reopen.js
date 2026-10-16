/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_ReopenInputs */

const en_quote_reopen = /** @type {(inputs: Quote_ReopenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reopen the quote`)
};

const fr_quote_reopen = /** @type {(inputs: Quote_ReopenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rouvrir le devis`)
};

/**
* | output |
* | --- |
* | "Reopen the quote" |
*
* @param {Quote_ReopenInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_reopen = /** @type {((inputs?: Quote_ReopenInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_ReopenInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_reopen(inputs)
	return en_quote_reopen(inputs)
});