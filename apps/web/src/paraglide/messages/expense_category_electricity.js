/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_ElectricityInputs */

const en_expense_category_electricity = /** @type {(inputs: Expense_Category_ElectricityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Electricity`)
};

const fr_expense_category_electricity = /** @type {(inputs: Expense_Category_ElectricityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Électricité`)
};

/**
* | output |
* | --- |
* | "Electricity" |
*
* @param {Expense_Category_ElectricityInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_electricity = /** @type {((inputs?: Expense_Category_ElectricityInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_ElectricityInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_electricity(inputs)
	return en_expense_category_electricity(inputs)
});