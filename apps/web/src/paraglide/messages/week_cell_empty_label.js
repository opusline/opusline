/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ mission: NonNullable<unknown>, day: NonNullable<unknown> }} Week_Cell_Empty_LabelInputs */

const en_week_cell_empty_label = /** @type {(inputs: Week_Cell_Empty_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.mission}, ${i?.day}: no entries`)
};

const fr_week_cell_empty_label = /** @type {(inputs: Week_Cell_Empty_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.mission}, ${i?.day} : aucune entrée`)
};

/**
* | output |
* | --- |
* | "{mission}, {day}: no entries" |
*
* @param {Week_Cell_Empty_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_cell_empty_label = /** @type {((inputs: Week_Cell_Empty_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Cell_Empty_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_cell_empty_label(inputs)
	return en_week_cell_empty_label(inputs)
});