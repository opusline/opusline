/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Import_ButtonInputs */

const en_bank_import_button = /** @type {(inputs: Bank_Import_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import a statement`)
};

const fr_bank_import_button = /** @type {(inputs: Bank_Import_ButtonInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importer un relevé`)
};

/**
* | output |
* | --- |
* | "Import a statement" |
*
* @param {Bank_Import_ButtonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_import_button = /** @type {((inputs?: Bank_Import_ButtonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Import_ButtonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_import_button(inputs)
	return en_bank_import_button(inputs)
});