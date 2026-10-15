/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Dismiss_FailedInputs */

const en_bank_dismiss_failed = /** @type {(inputs: Bank_Dismiss_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The suggestion could not be dismissed.`)
};

const fr_bank_dismiss_failed = /** @type {(inputs: Bank_Dismiss_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La suggestion n'a pas pu être écartée.`)
};

/**
* | output |
* | --- |
* | "The suggestion could not be dismissed." |
*
* @param {Bank_Dismiss_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_dismiss_failed = /** @type {((inputs?: Bank_Dismiss_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Dismiss_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_dismiss_failed(inputs)
	return en_bank_dismiss_failed(inputs)
});