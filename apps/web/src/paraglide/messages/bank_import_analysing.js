/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_AnalysingInputs */

const en_bank_import_analysing = /** @type {(inputs: Bank_Import_AnalysingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Analysing…`)
};

const fr_bank_import_analysing = /** @type {(inputs: Bank_Import_AnalysingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Analyse…`)
};

/**
* | output |
* | --- |
* | "Analysing…" |
*
* @param {Bank_Import_AnalysingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_analysing = /** @type {((inputs?: Bank_Import_AnalysingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_AnalysingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_analysing(inputs)
	return en_bank_import_analysing(inputs)
});