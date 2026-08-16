/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_FailedInputs */

const en_bank_import_failed = /** @type {(inputs: Bank_Import_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The statement could not be analysed.`)
};

const fr_bank_import_failed = /** @type {(inputs: Bank_Import_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le relevé n'a pas pu être analysé.`)
};

/**
* | output |
* | --- |
* | "The statement could not be analysed." |
*
* @param {Bank_Import_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_failed = /** @type {((inputs?: Bank_Import_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_failed(inputs)
	return en_bank_import_failed(inputs)
});