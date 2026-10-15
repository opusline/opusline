/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_TitleInputs */

const en_bank_import_title = /** @type {(inputs: Bank_Import_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import a statement`)
};

const fr_bank_import_title = /** @type {(inputs: Bank_Import_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importer un relevé`)
};

/**
* | output |
* | --- |
* | "Import a statement" |
*
* @param {Bank_Import_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_title = /** @type {((inputs?: Bank_Import_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_title(inputs)
	return en_bank_import_title(inputs)
});