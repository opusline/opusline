/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Send_Heading_InvoiceInputs */

const en_send_heading_invoice = /** @type {(inputs: Send_Heading_InvoiceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Send invoice ${i?.number}`)
};

const fr_send_heading_invoice = /** @type {(inputs: Send_Heading_InvoiceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Envoyer la facture ${i?.number}`)
};

/**
* | output |
* | --- |
* | "Send invoice {number}" |
*
* @param {Send_Heading_InvoiceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_heading_invoice = /** @type {((inputs: Send_Heading_InvoiceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Heading_InvoiceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_heading_invoice(inputs)
	return en_send_heading_invoice(inputs)
});