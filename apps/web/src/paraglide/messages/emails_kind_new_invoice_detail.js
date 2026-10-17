/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Emails_Kind_New_Invoice_DetailInputs */

const en_emails_kind_new_invoice_detail = /** @type {(inputs: Emails_Kind_New_Invoice_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent with every new invoice`)
};

const fr_emails_kind_new_invoice_detail = /** @type {(inputs: Emails_Kind_New_Invoice_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyé avec chaque nouvelle facture`)
};

/**
* | output |
* | --- |
* | "Sent with every new invoice" |
*
* @param {Emails_Kind_New_Invoice_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const emails_kind_new_invoice_detail = /** @type {((inputs?: Emails_Kind_New_Invoice_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Emails_Kind_New_Invoice_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_emails_kind_new_invoice_detail(inputs)
	return en_emails_kind_new_invoice_detail(inputs)
});