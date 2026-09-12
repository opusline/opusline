/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Expense_Vat_Kept_RateInputs */

const en_expense_vat_kept_rate = /** @type {(inputs: Expense_Vat_Kept_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The row keeps its invoice rate, ${i?.rate}, until you pick one.`)
};

const fr_expense_vat_kept_rate = /** @type {(inputs: Expense_Vat_Kept_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`La ligne garde le taux de sa facture, ${i?.rate}, tant que vous n'en choisissez pas un.`)
};

/**
* | output |
* | --- |
* | "The row keeps its invoice rate, {rate}, until you pick one." |
*
* @param {Expense_Vat_Kept_RateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_kept_rate = /** @type {((inputs: Expense_Vat_Kept_RateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Kept_RateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_kept_rate(inputs)
	return en_expense_vat_kept_rate(inputs)
});