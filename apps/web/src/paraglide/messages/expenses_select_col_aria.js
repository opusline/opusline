/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Select_Col_AriaInputs */

const en_expenses_select_col_aria = /** @type {(inputs: Expenses_Select_Col_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Select`)
};

const fr_expenses_select_col_aria = /** @type {(inputs: Expenses_Select_Col_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sélection`)
};

/**
* | output |
* | --- |
* | "Select" |
*
* @param {Expenses_Select_Col_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_select_col_aria = /** @type {((inputs?: Expenses_Select_Col_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Select_Col_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_select_col_aria(inputs)
	return en_expenses_select_col_aria(inputs)
});