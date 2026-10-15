/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_Warning_MealInputs */



/**
* | output |
* | --- |
* | "Invoice in the business's name required." |
*
* @param {Expense_Category_Warning_MealInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_warning_meal = /** @type {((inputs?: Expense_Category_Warning_MealInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_Warning_MealInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Facture au nom de l'entreprise requise.")
	return /** @type {LocalizedString} */ ("Invoice in the business's name required.")
});