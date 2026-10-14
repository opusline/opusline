/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Import_Time_HintInputs */

const en_editor_import_time_hint = /** @type {(inputs: Editor_Import_Time_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a mission to import tracked time.`)
};

const fr_editor_import_time_hint = /** @type {(inputs: Editor_Import_Time_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez une mission pour importer le temps saisi.`)
};

/**
* | output |
* | --- |
* | "Choose a mission to import tracked time." |
*
* @param {Editor_Import_Time_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_import_time_hint = /** @type {((inputs?: Editor_Import_Time_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Import_Time_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_import_time_hint(inputs)
	return en_editor_import_time_hint(inputs)
});