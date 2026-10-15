/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Payment_Terms_ReceiptInputs */

const en_clients_payment_terms_receipt = /** @type {(inputs: Clients_Payment_Terms_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`on receipt`)
};

const fr_clients_payment_terms_receipt = /** @type {(inputs: Clients_Payment_Terms_ReceiptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`réception`)
};

/**
* | output |
* | --- |
* | "on receipt" |
*
* @param {Clients_Payment_Terms_ReceiptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_payment_terms_receipt = /** @type {((inputs?: Clients_Payment_Terms_ReceiptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Payment_Terms_ReceiptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_payment_terms_receipt(inputs)
	return en_clients_payment_terms_receipt(inputs)
});