/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ cell: NonNullable<unknown> }} Week_Duration_Cell_LabelInputs */

const en_week_duration_cell_label = /** @type {(inputs: Week_Duration_Cell_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Duration — ${i?.cell}`)
};

const fr_week_duration_cell_label = /** @type {(inputs: Week_Duration_Cell_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Durée — ${i?.cell}`)
};

/**
* | output |
* | --- |
* | "Duration — {cell}" |
*
* @param {Week_Duration_Cell_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_duration_cell_label = /** @type {((inputs: Week_Duration_Cell_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Duration_Cell_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_duration_cell_label(inputs)
	return en_week_duration_cell_label(inputs)
});