/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Send_FailedInputs */

const en_invoices_send_failed = /** @type {(inputs: Invoices_Send_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoice could not be marked as sent.`)
};

const fr_invoices_send_failed = /** @type {(inputs: Invoices_Send_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La facture n'a pas pu être marquée envoyée.`)
};

/**
* | output |
* | --- |
* | "The invoice could not be marked as sent." |
*
* @param {Invoices_Send_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_send_failed = /** @type {((inputs?: Invoices_Send_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Send_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_send_failed(inputs)
	return en_invoices_send_failed(inputs)
});