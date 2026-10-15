/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Mark_SentInputs */

const en_invoices_mark_sent = /** @type {(inputs: Invoices_Mark_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as sent`)
};

const fr_invoices_mark_sent = /** @type {(inputs: Invoices_Mark_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer envoyée`)
};

/**
* | output |
* | --- |
* | "Mark as sent" |
*
* @param {Invoices_Mark_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_mark_sent = /** @type {((inputs?: Invoices_Mark_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Mark_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_mark_sent(inputs)
	return en_invoices_mark_sent(inputs)
});