/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_HotelInputs */

const en_expense_category_hotel = /** @type {(inputs: Expense_Category_HotelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hotel`)
};

const fr_expense_category_hotel = /** @type {(inputs: Expense_Category_HotelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hôtel`)
};

/**
* | output |
* | --- |
* | "Hotel" |
*
* @param {Expense_Category_HotelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_hotel = /** @type {((inputs?: Expense_Category_HotelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_HotelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_hotel(inputs)
	return en_expense_category_hotel(inputs)
});