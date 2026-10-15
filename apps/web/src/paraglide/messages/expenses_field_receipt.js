/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Field_ReceiptInputs */

const en_expenses_field_receipt = /** @type {(inputs: Expenses_Field_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Receipt`)
};

const fr_expenses_field_receipt = /** @type {(inputs: Expenses_Field_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture`)
};

/**
* | output |
* | --- |
* | "Receipt" |
*
* @param {Expenses_Field_ReceiptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_field_receipt = /** @type {((inputs?: Expenses_Field_ReceiptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Field_ReceiptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_field_receipt(inputs)
	return en_expenses_field_receipt(inputs)
});