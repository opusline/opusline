/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_New_External_QuoteInputs */

const en_invoicing_new_external_quote = /** @type {(inputs: Invoicing_New_External_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote issued elsewhere`)
};

const fr_invoicing_new_external_quote = /** @type {(inputs: Invoicing_New_External_QuoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Devis émis ailleurs`)
};

/**
* | output |
* | --- |
* | "Quote issued elsewhere" |
*
* @param {Invoicing_New_External_QuoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_new_external_quote = /** @type {((inputs?: Invoicing_New_External_QuoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_New_External_QuoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_new_external_quote(inputs)
	return en_invoicing_new_external_quote(inputs)
});