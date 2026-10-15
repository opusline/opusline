/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Status_Receipt_LinkedInputs */



/**
* | output |
* | --- |
* | "Receipt linked" |
*
* @param {Expense_Status_Receipt_LinkedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_status_receipt_linked = /** @type {((inputs?: Expense_Status_Receipt_LinkedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Status_Receipt_LinkedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Facture liée")
	return /** @type {LocalizedString} */ ("Receipt linked")
});