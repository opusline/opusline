/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ unit: NonNullable<unknown> }} Expenses_Categories_TitleInputs */

const en_expenses_categories_title = /** @type {(inputs: Expenses_Categories_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`By category · ${i?.unit}`)
};

const fr_expenses_categories_title = /** @type {(inputs: Expenses_Categories_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Par catégorie · ${i?.unit}`)
};

/**
* | output |
* | --- |
* | "By category · {unit}" |
*
* @param {Expenses_Categories_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_categories_title = /** @type {((inputs: Expenses_Categories_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Categories_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_categories_title(inputs)
	return en_expenses_categories_title(inputs)
});