/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Revenue_Unbilled_TotalInputs */

const en_revenue_unbilled_total = /** @type {(inputs: Revenue_Unbilled_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`That is ${i?.amount} HT not on any invoice.`)
};

const fr_revenue_unbilled_total = /** @type {(inputs: Revenue_Unbilled_TotalInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Soit ${i?.amount} HT qui ne figurent sur aucune facture.`)
};

/**
* | output |
* | --- |
* | "That is {amount} HT not on any invoice." |
*
* @param {Revenue_Unbilled_TotalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_unbilled_total = /** @type {((inputs: Revenue_Unbilled_TotalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Unbilled_TotalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_unbilled_total(inputs)
	return en_revenue_unbilled_total(inputs)
});