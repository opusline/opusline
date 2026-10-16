/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ quantity: NonNullable<unknown> }} Editor_Import_Time_DaysInputs */

const en_editor_import_time_days = /** @type {(inputs: Editor_Import_Time_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.quantity} d not invoiced yet`)
};

const fr_editor_import_time_days = /** @type {(inputs: Editor_Import_Time_DaysInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.quantity} j pas encore facturés`)
};

/**
* | output |
* | --- |
* | "{quantity} d not invoiced yet" |
*
* @param {Editor_Import_Time_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_import_time_days = /** @type {((inputs: Editor_Import_Time_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Import_Time_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_import_time_days(inputs)
	return en_editor_import_time_days(inputs)
});