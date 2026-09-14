/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown> }} Expenses_Receipt_AttachedInputs */

const en_expenses_receipt_attached = /** @type {(inputs: Expenses_Receipt_AttachedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Receipt linked · ${i?.name}`)
};

const fr_expenses_receipt_attached = /** @type {(inputs: Expenses_Receipt_AttachedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Facture liée · ${i?.name}`)
};

/**
* | output |
* | --- |
* | "Receipt linked · {name}" |
*
* @param {Expenses_Receipt_AttachedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_attached = /** @type {((inputs: Expenses_Receipt_AttachedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_AttachedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_attached(inputs)
	return en_expenses_receipt_attached(inputs)
});