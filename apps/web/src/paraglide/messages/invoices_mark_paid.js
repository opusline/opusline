/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Mark_PaidInputs */

const en_invoices_mark_paid = /** @type {(inputs: Invoices_Mark_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as collected`)
};

const fr_invoices_mark_paid = /** @type {(inputs: Invoices_Mark_PaidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer encaissée`)
};

/**
* | output |
* | --- |
* | "Mark as collected" |
*
* @param {Invoices_Mark_PaidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_mark_paid = /** @type {((inputs?: Invoices_Mark_PaidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Mark_PaidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_mark_paid(inputs)
	return en_invoices_mark_paid(inputs)
});