/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_SubmitInputs */

const en_bank_import_submit = /** @type {(inputs: Bank_Import_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Analyse the statement`)
};

const fr_bank_import_submit = /** @type {(inputs: Bank_Import_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Analyser le relevé`)
};

/**
* | output |
* | --- |
* | "Analyse the statement" |
*
* @param {Bank_Import_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_submit = /** @type {((inputs?: Bank_Import_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_submit(inputs)
	return en_bank_import_submit(inputs)
});