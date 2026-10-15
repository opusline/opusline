/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_Reject_SizeInputs */

const en_expenses_receipt_reject_size = /** @type {(inputs: Expenses_Receipt_Reject_SizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This file is too heavy (max 20 MB).`)
};

const fr_expenses_receipt_reject_size = /** @type {(inputs: Expenses_Receipt_Reject_SizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce fichier est trop lourd (20 Mo maximum).`)
};

/**
* | output |
* | --- |
* | "This file is too heavy (max 20 MB)." |
*
* @param {Expenses_Receipt_Reject_SizeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_receipt_reject_size = /** @type {((inputs?: Expenses_Receipt_Reject_SizeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Receipt_Reject_SizeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_receipt_reject_size(inputs)
	return en_expenses_receipt_reject_size(inputs)
});