/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Revenue_Row_CollectedInputs */

const en_revenue_row_collected = /** @type {(inputs: Revenue_Row_CollectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`collected on ${i?.date}`)
};

const fr_revenue_row_collected = /** @type {(inputs: Revenue_Row_CollectedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`encaissée le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "collected on {date}" |
*
* @param {Revenue_Row_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_row_collected = /** @type {((inputs: Revenue_Row_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Row_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_row_collected(inputs)
	return en_revenue_row_collected(inputs)
});