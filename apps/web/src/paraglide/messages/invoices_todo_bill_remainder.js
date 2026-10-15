/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Todo_Bill_RemainderInputs */



/**
* | output |
* | --- |
* | "Invoice the rest" |
*
* @param {Invoices_Todo_Bill_RemainderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_todo_bill_remainder = /** @type {((inputs?: Invoices_Todo_Bill_RemainderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Todo_Bill_RemainderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Facturer le reste")
	return /** @type {LocalizedString} */ ("Invoice the rest")
});