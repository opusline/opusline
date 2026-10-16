/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_New_QuoteInputs */

const en_invoicing_new_quote = /** @type {(inputs: Invoicing_New_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote`)
};

const fr_invoicing_new_quote = /** @type {(inputs: Invoicing_New_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Devis`)
};

/**
* | output |
* | --- |
* | "Quote" |
*
* @param {Invoicing_New_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_new_quote = /** @type {((inputs?: Invoicing_New_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_New_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_new_quote(inputs)
	return en_invoicing_new_quote(inputs)
});