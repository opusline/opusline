/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_RemoveInputs */

const en_expenses_receipt_remove = /** @type {(inputs: Expenses_Receipt_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

const fr_expenses_receipt_remove = /** @type {(inputs: Expenses_Receipt_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer`)
};

/**
* | output |
* | --- |
* | "Remove" |
*
* @param {Expenses_Receipt_RemoveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_remove = /** @type {((inputs?: Expenses_Receipt_RemoveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_RemoveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_remove(inputs)
	return en_expenses_receipt_remove(inputs)
});