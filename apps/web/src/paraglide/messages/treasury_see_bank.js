/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_See_BankInputs */

const en_treasury_see_bank = /** @type {(inputs: Treasury_See_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`See the business account`)
};

const fr_treasury_see_bank = /** @type {(inputs: Treasury_See_BankInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Voir le compte pro`)
};

/**
* | output |
* | --- |
* | "See the business account" |
*
* @param {Treasury_See_BankInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_see_bank = /** @type {((inputs?: Treasury_See_BankInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_See_BankInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_see_bank(inputs)
	return en_treasury_see_bank(inputs)
});