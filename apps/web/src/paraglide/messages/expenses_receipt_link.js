/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_LinkInputs */

const en_expenses_receipt_link = /** @type {(inputs: Expenses_Receipt_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Link the receipt`)
};

const fr_expenses_receipt_link = /** @type {(inputs: Expenses_Receipt_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lier la facture`)
};

/**
* | output |
* | --- |
* | "Link the receipt" |
*
* @param {Expenses_Receipt_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_link = /** @type {((inputs?: Expenses_Receipt_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_link(inputs)
	return en_expenses_receipt_link(inputs)
});