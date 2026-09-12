/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Expenses_Receipt_Open_AriaInputs */

const en_expenses_receipt_open_aria = /** @type {(inputs: Expenses_Receipt_Open_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Open the receipt ${i?.name}`)
};

const fr_expenses_receipt_open_aria = /** @type {(inputs: Expenses_Receipt_Open_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ouvrir la facture ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Open the receipt {name}" |
*
* @param {Expenses_Receipt_Open_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_open_aria = /** @type {((inputs: Expenses_Receipt_Open_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_Open_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_open_aria(inputs)
	return en_expenses_receipt_open_aria(inputs)
});