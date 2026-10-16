/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Billing_NoneInputs */

const en_quote_billing_none = /** @type {(inputs: Quote_Billing_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing invoiced yet.`)
};

const fr_quote_billing_none = /** @type {(inputs: Quote_Billing_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien de facturé pour l'instant.`)
};

/**
* | output |
* | --- |
* | "Nothing invoiced yet." |
*
* @param {Quote_Billing_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_billing_none = /** @type {((inputs?: Quote_Billing_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Billing_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_billing_none(inputs)
	return en_quote_billing_none(inputs)
});