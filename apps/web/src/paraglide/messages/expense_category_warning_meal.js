/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_Warning_MealInputs */

const en_expense_category_warning_meal = /** @type {(inputs: Expense_Category_Warning_MealInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice in the business's name required`)
};

const fr_expense_category_warning_meal = /** @type {(inputs: Expense_Category_Warning_MealInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture au nom de l'entreprise requise`)
};

/**
* | output |
* | --- |
* | "Invoice in the business's name required" |
*
* @param {Expense_Category_Warning_MealInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_warning_meal = /** @type {((inputs?: Expense_Category_Warning_MealInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_Warning_MealInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_warning_meal(inputs)
	return en_expense_category_warning_meal(inputs)
});