/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_FillInputs */

const en_expenses_receipt_fill = /** @type {(inputs: Expenses_Receipt_FillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill from the receipt`)
};

const fr_expenses_receipt_fill = /** @type {(inputs: Expenses_Receipt_FillInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remplir depuis la facture`)
};

/**
* | output |
* | --- |
* | "Fill from the receipt" |
*
* @param {Expenses_Receipt_FillInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_fill = /** @type {((inputs?: Expenses_Receipt_FillInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_FillInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_fill(inputs)
	return en_expenses_receipt_fill(inputs)
});