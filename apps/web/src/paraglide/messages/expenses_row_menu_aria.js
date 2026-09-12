/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Expenses_Row_Menu_AriaInputs */

const en_expenses_row_menu_aria = /** @type {(inputs: Expenses_Row_Menu_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Actions for ${i?.supplier}`)
};

const fr_expenses_row_menu_aria = /** @type {(inputs: Expenses_Row_Menu_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Actions pour ${i?.supplier}`)
};

/**
* | output |
* | --- |
* | "Actions for {supplier}" |
*
* @param {Expenses_Row_Menu_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_row_menu_aria = /** @type {((inputs: Expenses_Row_Menu_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Row_Menu_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_row_menu_aria(inputs)
	return en_expenses_row_menu_aria(inputs)
});