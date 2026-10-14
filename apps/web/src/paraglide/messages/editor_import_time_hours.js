/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ quantity: NonNullable<unknown> }} Editor_Import_Time_HoursInputs */

const en_editor_import_time_hours = /** @type {(inputs: Editor_Import_Time_HoursInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.quantity} h not invoiced yet`)
};

const fr_editor_import_time_hours = /** @type {(inputs: Editor_Import_Time_HoursInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.quantity} h pas encore facturées`)
};

/**
* | output |
* | --- |
* | "{quantity} h not invoiced yet" |
*
* @param {Editor_Import_Time_HoursInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_import_time_hours = /** @type {((inputs: Editor_Import_Time_HoursInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Import_Time_HoursInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_import_time_hours(inputs)
	return en_editor_import_time_hours(inputs)
});