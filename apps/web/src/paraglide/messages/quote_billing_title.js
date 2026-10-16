/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Billing_TitleInputs */

const en_quote_billing_title = /** @type {(inputs: Quote_Billing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Linked invoices`)
};

const fr_quote_billing_title = /** @type {(inputs: Quote_Billing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Factures liées`)
};

/**
* | output |
* | --- |
* | "Linked invoices" |
*
* @param {Quote_Billing_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_billing_title = /** @type {((inputs?: Quote_Billing_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Billing_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_billing_title(inputs)
	return en_quote_billing_title(inputs)
});