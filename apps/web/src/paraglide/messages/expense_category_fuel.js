/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_FuelInputs */

const en_expense_category_fuel = /** @type {(inputs: Expense_Category_FuelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fuel`)
};

const fr_expense_category_fuel = /** @type {(inputs: Expense_Category_FuelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Carburant`)
};

/**
* | output |
* | --- |
* | "Fuel" |
*
* @param {Expense_Category_FuelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_fuel = /** @type {((inputs?: Expense_Category_FuelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_FuelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_fuel(inputs)
	return en_expense_category_fuel(inputs)
});