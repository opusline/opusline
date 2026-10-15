/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_EquipmentInputs */

const en_expense_category_equipment = /** @type {(inputs: Expense_Category_EquipmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Equipment`)
};

const fr_expense_category_equipment = /** @type {(inputs: Expense_Category_EquipmentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Matériel`)
};

/**
* | output |
* | --- |
* | "Equipment" |
*
* @param {Expense_Category_EquipmentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_equipment = /** @type {((inputs?: Expense_Category_EquipmentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_EquipmentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_equipment(inputs)
	return en_expense_category_equipment(inputs)
});