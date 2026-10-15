/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_Detach_FailedInputs */

const en_expenses_receipt_detach_failed = /** @type {(inputs: Expenses_Receipt_Detach_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The receipt could not be detached. Try again in a moment.`)
};

const fr_expenses_receipt_detach_failed = /** @type {(inputs: Expenses_Receipt_Detach_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La facture n'a pas pu être détachée. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The receipt could not be detached. Try again in a moment." |
*
* @param {Expenses_Receipt_Detach_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_detach_failed = /** @type {((inputs?: Expenses_Receipt_Detach_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_Detach_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_detach_failed(inputs)
	return en_expenses_receipt_detach_failed(inputs)
});