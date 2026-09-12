/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_TravelInputs */

const en_expense_category_travel = /** @type {(inputs: Expense_Category_TravelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Travel`)
};

const fr_expense_category_travel = /** @type {(inputs: Expense_Category_TravelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déplacement`)
};

/**
* | output |
* | --- |
* | "Travel" |
*
* @param {Expense_Category_TravelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_travel = /** @type {((inputs?: Expense_Category_TravelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_TravelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_travel(inputs)
	return en_expense_category_travel(inputs)
});