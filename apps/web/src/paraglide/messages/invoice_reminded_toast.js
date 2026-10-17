/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ recipients: NonNullable<unknown> }} Invoice_Reminded_ToastInputs */

const en_invoice_reminded_toast = /** @type {(inputs: Invoice_Reminded_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reminder sent to ${i?.recipients}`)
};

const fr_invoice_reminded_toast = /** @type {(inputs: Invoice_Reminded_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Relance envoyée à ${i?.recipients}`)
};

/**
* | output |
* | --- |
* | "Reminder sent to {recipients}" |
*
* @param {Invoice_Reminded_ToastInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_reminded_toast = /** @type {((inputs: Invoice_Reminded_ToastInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Reminded_ToastInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_reminded_toast(inputs)
	return en_invoice_reminded_toast(inputs)
});