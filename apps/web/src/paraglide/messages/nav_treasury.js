/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_TreasuryInputs */

const en_nav_treasury = /** @type {(inputs: Nav_TreasuryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Transfer`)
};

const fr_nav_treasury = /** @type {(inputs: Nav_TreasuryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Virement`)
};

/**
* | output |
* | --- |
* | "Transfer" |
*
* @param {Nav_TreasuryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_treasury = /** @type {((inputs?: Nav_TreasuryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_TreasuryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_treasury(inputs)
	return en_nav_treasury(inputs)
});