/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Validate_FailedInputs */

const en_bank_validate_failed = /** @type {(inputs: Bank_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The match could not be validated.`)
};

const fr_bank_validate_failed = /** @type {(inputs: Bank_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le rapprochement n'a pas pu être validé.`)
};

/**
* | output |
* | --- |
* | "The match could not be validated." |
*
* @param {Bank_Validate_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_validate_failed = /** @type {((inputs?: Bank_Validate_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Validate_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_validate_failed(inputs)
	return en_bank_validate_failed(inputs)
});