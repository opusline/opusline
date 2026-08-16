/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ period: NonNullable<unknown> }} Revenue_Empty_CtaInputs */

const en_revenue_empty_cta = /** @type {(inputs: Revenue_Empty_CtaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`See ${i?.period}`)
};

const fr_revenue_empty_cta = /** @type {(inputs: Revenue_Empty_CtaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Voir ${i?.period}`)
};

/**
* | output |
* | --- |
* | "See {period}" |
*
* @param {Revenue_Empty_CtaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_empty_cta = /** @type {((inputs: Revenue_Empty_CtaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Empty_CtaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_empty_cta(inputs)
	return en_revenue_empty_cta(inputs)
});