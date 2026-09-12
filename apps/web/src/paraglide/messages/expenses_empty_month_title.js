/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown> }} Expenses_Empty_Month_TitleInputs */

const en_expenses_empty_month_title = /** @type {(inputs: Expenses_Empty_Month_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`No expense in ${i?.month}`)
};

const fr_expenses_empty_month_title = /** @type {(inputs: Expenses_Empty_Month_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Aucune dépense en ${i?.month}`)
};

/**
* | output |
* | --- |
* | "No expense in {month}" |
*
* @param {Expenses_Empty_Month_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_empty_month_title = /** @type {((inputs: Expenses_Empty_Month_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Empty_Month_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_empty_month_title(inputs)
	return en_expenses_empty_month_title(inputs)
});