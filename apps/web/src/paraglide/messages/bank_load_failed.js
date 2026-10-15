/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Load_FailedInputs */

const en_bank_load_failed = /** @type {(inputs: Bank_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The account could not be loaded. Try again in a moment.`)
};

const fr_bank_load_failed = /** @type {(inputs: Bank_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le compte n'a pas pu être chargé. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The account could not be loaded. Try again in a moment." |
*
* @param {Bank_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_load_failed = /** @type {((inputs?: Bank_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_load_failed(inputs)
	return en_bank_load_failed(inputs)
});