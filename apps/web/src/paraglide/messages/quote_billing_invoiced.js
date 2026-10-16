/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ invoiced: NonNullable<unknown>, total: NonNullable<unknown> }} Quote_Billing_InvoicedInputs */

const en_quote_billing_invoiced = /** @type {(inputs: Quote_Billing_InvoicedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.invoiced} invoiced of ${i?.total}`)
};

const fr_quote_billing_invoiced = /** @type {(inputs: Quote_Billing_InvoicedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.invoiced} facturés sur ${i?.total}`)
};

/**
* | output |
* | --- |
* | "{invoiced} invoiced of {total}" |
*
* @param {Quote_Billing_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_billing_invoiced = /** @type {((inputs: Quote_Billing_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Billing_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_billing_invoiced(inputs)
	return en_quote_billing_invoiced(inputs)
});