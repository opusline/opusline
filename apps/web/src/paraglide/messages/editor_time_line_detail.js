/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ from: NonNullable<unknown>, to: NonNullable<unknown> }} Editor_Time_Line_DetailInputs */

const en_editor_time_line_detail = /** @type {(inputs: Editor_Time_Line_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tracked from ${i?.from} to ${i?.to}`)
};

const fr_editor_time_line_detail = /** @type {(inputs: Editor_Time_Line_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Temps saisi du ${i?.from} au ${i?.to}`)
};

/**
* | output |
* | --- |
* | "Tracked from {from} to {to}" |
*
* @param {Editor_Time_Line_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_time_line_detail = /** @type {((inputs: Editor_Time_Line_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Time_Line_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_time_line_detail(inputs)
	return en_editor_time_line_detail(inputs)
});