/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Editor_Import_Time_EmptyInputs */

const en_editor_import_time_empty = /** @type {(inputs: Editor_Import_Time_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No unbilled time on this mission`)
};

const fr_editor_import_time_empty = /** @type {(inputs: Editor_Import_Time_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun temps à facturer sur cette mission`)
};

/**
* | output |
* | --- |
* | "No unbilled time on this mission" |
*
* @param {Editor_Import_Time_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_import_time_empty = /** @type {((inputs?: Editor_Import_Time_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Import_Time_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_import_time_empty(inputs)
	return en_editor_import_time_empty(inputs)
});