/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Receipt_Reject_SizeInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Ce fichier est trop lourd (20 Mo maximum).")
	return /** @type {LocalizedString} */ ("This file is too heavy (max 20 MB).")
});