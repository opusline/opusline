/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Balance_DerivedInputs */

const en_bank_balance_derived = /** @type {(inputs: Bank_Balance_DerivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`computed from the imported statements`)
};

const fr_bank_balance_derived = /** @type {(inputs: Bank_Balance_DerivedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`calculé des relevés importés`)
};

/**
* | output |
* | --- |
* | "computed from the imported statements" |
*
* @param {Bank_Balance_DerivedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_derived = /** @type {((inputs?: Bank_Balance_DerivedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_DerivedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_balance_derived(inputs)
	return en_bank_balance_derived(inputs)
});