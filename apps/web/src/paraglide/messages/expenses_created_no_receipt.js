/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Created_No_ReceiptInputs */



/**
* | output |
* | --- |
* | "Expense added · remember to link the receipt" |
*
* @param {Expenses_Created_No_ReceiptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_created_no_receipt = /** @type {((inputs?: Expenses_Created_No_ReceiptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Created_No_ReceiptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Dépense ajoutée · pensez à lier la facture")
	return /** @type {LocalizedString} */ ("Expense added · remember to link the receipt")
});