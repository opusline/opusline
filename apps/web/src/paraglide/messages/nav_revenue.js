/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_RevenueInputs */

const en_nav_revenue = /** @type {(inputs: Nav_RevenueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenue`)
};

const fr_nav_revenue = /** @type {(inputs: Nav_RevenueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenus`)
};

/**
* | output |
* | --- |
* | "Revenue" |
*
* @param {Nav_RevenueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_revenue = /** @type {((inputs?: Nav_RevenueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_RevenueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_revenue(inputs)
	return en_nav_revenue(inputs)
});