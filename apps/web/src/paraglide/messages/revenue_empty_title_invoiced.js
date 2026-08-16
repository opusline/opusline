/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ period: NonNullable<unknown> }} Revenue_Empty_Title_InvoicedInputs */

const en_revenue_empty_title_invoiced = /** @type {(inputs: Revenue_Empty_Title_InvoicedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Nothing invoiced in ${i?.period}`)
};

const fr_revenue_empty_title_invoiced = /** @type {(inputs: Revenue_Empty_Title_InvoicedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Rien de facturé sur ${i?.period}`)
};

/**
* | output |
* | --- |
* | "Nothing invoiced in {period}" |
*
* @param {Revenue_Empty_Title_InvoicedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_empty_title_invoiced = /** @type {((inputs: Revenue_Empty_Title_InvoicedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Empty_Title_InvoicedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_empty_title_invoiced(inputs)
	return en_revenue_empty_title_invoiced(inputs)
});