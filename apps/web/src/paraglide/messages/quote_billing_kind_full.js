/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Billing_Kind_FullInputs */

const en_quote_billing_kind_full = /** @type {(inputs: Quote_Billing_Kind_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Whole quote`)
};

const fr_quote_billing_kind_full = /** @type {(inputs: Quote_Billing_Kind_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Totalité`)
};

/**
* | output |
* | --- |
* | "Whole quote" |
*
* @param {Quote_Billing_Kind_FullInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_billing_kind_full = /** @type {((inputs?: Quote_Billing_Kind_FullInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Billing_Kind_FullInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_billing_kind_full(inputs)
	return en_quote_billing_kind_full(inputs)
});