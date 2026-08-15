/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ mission: NonNullable<unknown> }} Week_Row_Total_LabelInputs */

const en_week_row_total_label = /** @type {(inputs: Week_Row_Total_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Total for ${i?.mission}`)
};

const fr_week_row_total_label = /** @type {(inputs: Week_Row_Total_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Total ${i?.mission}`)
};

/**
* | output |
* | --- |
* | "Total for {mission}" |
*
* @param {Week_Row_Total_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_row_total_label = /** @type {((inputs: Week_Row_Total_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Row_Total_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_row_total_label(inputs)
	return en_week_row_total_label(inputs)
});