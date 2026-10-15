/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Bulk_Clear_AriaInputs */

const en_expenses_bulk_clear_aria = /** @type {(inputs: Expenses_Bulk_Clear_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear the selection`)
};

const fr_expenses_bulk_clear_aria = /** @type {(inputs: Expenses_Bulk_Clear_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Désélectionner`)
};

/**
* | output |
* | --- |
* | "Clear the selection" |
*
* @param {Expenses_Bulk_Clear_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_bulk_clear_aria = /** @type {((inputs?: Expenses_Bulk_Clear_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Bulk_Clear_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_bulk_clear_aria(inputs)
	return en_expenses_bulk_clear_aria(inputs)
});