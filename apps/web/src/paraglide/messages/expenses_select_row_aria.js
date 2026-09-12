/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Expenses_Select_Row_AriaInputs */

const en_expenses_select_row_aria = /** @type {(inputs: Expenses_Select_Row_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Select ${i?.supplier}`)
};

const fr_expenses_select_row_aria = /** @type {(inputs: Expenses_Select_Row_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sélectionner ${i?.supplier}`)
};

/**
* | output |
* | --- |
* | "Select {supplier}" |
*
* @param {Expenses_Select_Row_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_select_row_aria = /** @type {((inputs: Expenses_Select_Row_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Select_Row_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_select_row_aria(inputs)
	return en_expenses_select_row_aria(inputs)
});