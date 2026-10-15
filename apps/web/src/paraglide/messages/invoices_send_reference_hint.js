/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Send_Reference_HintInputs */

const en_invoices_send_reference_hint = /** @type {(inputs: Invoices_Send_Reference_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The one on the document sent to the client. An issued invoice carries one.`)
};

const fr_invoices_send_reference_hint = /** @type {(inputs: Invoices_Send_Reference_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Celle du document envoyé au client. Une facture émise en porte une.`)
};

/**
* | output |
* | --- |
* | "The one on the document sent to the client. An issued invoice carries one." |
*
* @param {Invoices_Send_Reference_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_send_reference_hint = /** @type {((inputs?: Invoices_Send_Reference_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Send_Reference_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_send_reference_hint(inputs)
	return en_invoices_send_reference_hint(inputs)
});