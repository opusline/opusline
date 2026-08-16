/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Basis_AriaInputs */

const en_revenue_basis_aria = /** @type {(inputs: Revenue_Basis_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenue basis`)
};

const fr_revenue_basis_aria = /** @type {(inputs: Revenue_Basis_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base de calcul`)
};

/**
* | output |
* | --- |
* | "Revenue basis" |
*
* @param {Revenue_Basis_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_basis_aria = /** @type {((inputs?: Revenue_Basis_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Basis_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_basis_aria(inputs)
	return en_revenue_basis_aria(inputs)
});