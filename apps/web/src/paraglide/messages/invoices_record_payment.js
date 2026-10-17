/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Record_PaymentInputs */

const en_invoices_record_payment = /** @type {(inputs: Invoices_Record_PaymentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Record the payment`)
};

const fr_invoices_record_payment = /** @type {(inputs: Invoices_Record_PaymentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer le paiement`)
};

/**
* | output |
* | --- |
* | "Record the payment" |
*
* @param {Invoices_Record_PaymentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_record_payment = /** @type {((inputs?: Invoices_Record_PaymentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Record_PaymentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_record_payment(inputs)
	return en_invoices_record_payment(inputs)
});