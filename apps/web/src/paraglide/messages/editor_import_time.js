/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Import_TimeInputs */

const en_editor_import_time = /** @type {(inputs: Editor_Import_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import tracked time`)
};

const fr_editor_import_time = /** @type {(inputs: Editor_Import_TimeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importer le temps saisi`)
};

/**
* | output |
* | --- |
* | "Import tracked time" |
*
* @param {Editor_Import_TimeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_import_time = /** @type {((inputs?: Editor_Import_TimeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Import_TimeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_import_time(inputs)
	return en_editor_import_time(inputs)
});