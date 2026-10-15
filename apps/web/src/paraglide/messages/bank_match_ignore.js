/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Match_IgnoreInputs */

const en_bank_match_ignore = /** @type {(inputs: Bank_Match_IgnoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ignore`)
};

const fr_bank_match_ignore = /** @type {(inputs: Bank_Match_IgnoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ignorer`)
};

/**
* | output |
* | --- |
* | "Ignore" |
*
* @param {Bank_Match_IgnoreInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_match_ignore = /** @type {((inputs?: Bank_Match_IgnoreInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Match_IgnoreInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_match_ignore(inputs)
	return en_bank_match_ignore(inputs)
});