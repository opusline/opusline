/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Col_ReceiptInputs */

const en_expenses_col_receipt = /** @type {(inputs: Expenses_Col_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipt`)
};

const fr_expenses_col_receipt = /** @type {(inputs: Expenses_Col_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture`)
};

/**
* | output |
* | --- |
* | "Receipt" |
*
* @param {Expenses_Col_ReceiptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_col_receipt = /** @type {((inputs?: Expenses_Col_ReceiptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Col_ReceiptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_col_receipt(inputs)
	return en_expenses_col_receipt(inputs)
});