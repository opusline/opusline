/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_SoftwareInputs */

const en_expense_category_software = /** @type {(inputs: Expense_Category_SoftwareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Software`)
};

const fr_expense_category_software = /** @type {(inputs: Expense_Category_SoftwareInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Logiciel`)
};

/**
* | output |
* | --- |
* | "Software" |
*
* @param {Expense_Category_SoftwareInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_software = /** @type {((inputs?: Expense_Category_SoftwareInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_SoftwareInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_software(inputs)
	return en_expense_category_software(inputs)
});