/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Bulk_CategoryInputs */

const en_expenses_bulk_category = /** @type {(inputs: Expenses_Bulk_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Category`)
};

const fr_expenses_bulk_category = /** @type {(inputs: Expenses_Bulk_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Catégorie`)
};

/**
* | output |
* | --- |
* | "Category" |
*
* @param {Expenses_Bulk_CategoryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_bulk_category = /** @type {((inputs?: Expenses_Bulk_CategoryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Bulk_CategoryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_bulk_category(inputs)
	return en_expenses_bulk_category(inputs)
});