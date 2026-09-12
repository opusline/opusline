/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Expenses_Receipt_Link_AriaInputs */

const en_expenses_receipt_link_aria = /** @type {(inputs: Expenses_Receipt_Link_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Link the receipt of ${i?.supplier}`)
};

const fr_expenses_receipt_link_aria = /** @type {(inputs: Expenses_Receipt_Link_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lier la facture de ${i?.supplier}`)
};

/**
* | output |
* | --- |
* | "Link the receipt of {supplier}" |
*
* @param {Expenses_Receipt_Link_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_link_aria = /** @type {((inputs: Expenses_Receipt_Link_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_Link_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_link_aria(inputs)
	return en_expenses_receipt_link_aria(inputs)
});