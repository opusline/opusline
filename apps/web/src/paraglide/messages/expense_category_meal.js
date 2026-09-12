/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_MealInputs */

const en_expense_category_meal = /** @type {(inputs: Expense_Category_MealInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Meals`)
};

const fr_expense_category_meal = /** @type {(inputs: Expense_Category_MealInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Repas`)
};

/**
* | output |
* | --- |
* | "Meals" |
*
* @param {Expense_Category_MealInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_meal = /** @type {((inputs?: Expense_Category_MealInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_MealInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_meal(inputs)
	return en_expense_category_meal(inputs)
});