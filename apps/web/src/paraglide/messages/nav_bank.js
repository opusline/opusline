/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_BankInputs */

const en_nav_bank = /** @type {(inputs: Nav_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business account`)
};

const fr_nav_bank = /** @type {(inputs: Nav_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Compte pro`)
};

/**
* | output |
* | --- |
* | "Business account" |
*
* @param {Nav_BankInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_bank = /** @type {((inputs?: Nav_BankInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_BankInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_bank(inputs)
	return en_nav_bank(inputs)
});