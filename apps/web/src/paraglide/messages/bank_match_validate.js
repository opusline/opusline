/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Match_ValidateInputs */

const en_bank_match_validate = /** @type {(inputs: Bank_Match_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validate`)
};

const fr_bank_match_validate = /** @type {(inputs: Bank_Match_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valider`)
};

/**
* | output |
* | --- |
* | "Validate" |
*
* @param {Bank_Match_ValidateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_match_validate = /** @type {((inputs?: Bank_Match_ValidateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Match_ValidateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_match_validate(inputs)
	return en_bank_match_validate(inputs)
});