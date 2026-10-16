/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Nav_QuotesInputs */

const en_invoicing_nav_quotes = /** @type {(inputs: Invoicing_Nav_QuotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quotes`)
};

const fr_invoicing_nav_quotes = /** @type {(inputs: Invoicing_Nav_QuotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Devis`)
};

/**
* | output |
* | --- |
* | "Quotes" |
*
* @param {Invoicing_Nav_QuotesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_nav_quotes = /** @type {((inputs?: Invoicing_Nav_QuotesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Nav_QuotesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_nav_quotes(inputs)
	return en_invoicing_nav_quotes(inputs)
});