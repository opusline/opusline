/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Revenue_Basis_CollectedInputs */

const en_revenue_basis_collected = /** @type {(inputs: Revenue_Basis_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collected`)
};

const fr_revenue_basis_collected = /** @type {(inputs: Revenue_Basis_CollectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Encaissé`)
};

/**
* | output |
* | --- |
* | "Collected" |
*
* @param {Revenue_Basis_CollectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const revenue_basis_collected = /** @type {((inputs?: Revenue_Basis_CollectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Revenue_Basis_CollectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_revenue_basis_collected(inputs)
	return en_revenue_basis_collected(inputs)
});