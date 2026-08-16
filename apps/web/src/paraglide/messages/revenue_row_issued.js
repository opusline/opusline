/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Revenue_Row_IssuedInputs */

const en_revenue_row_issued = /** @type {(inputs: Revenue_Row_IssuedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`issued on ${i?.date}`)
};

const fr_revenue_row_issued = /** @type {(inputs: Revenue_Row_IssuedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`émise le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "issued on {date}" |
*
* @param {Revenue_Row_IssuedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_row_issued = /** @type {((inputs: Revenue_Row_IssuedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Row_IssuedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_row_issued(inputs)
	return en_revenue_row_issued(inputs)
});