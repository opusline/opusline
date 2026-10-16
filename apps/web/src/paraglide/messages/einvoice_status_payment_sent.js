/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoice_Status_Payment_SentInputs */

const en_einvoice_status_payment_sent = /** @type {(inputs: Einvoice_Status_Payment_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment sent`)
};

const fr_einvoice_status_payment_sent = /** @type {(inputs: Einvoice_Status_Payment_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paiement transmis`)
};

/**
* | output |
* | --- |
* | "Payment sent" |
*
* @param {Einvoice_Status_Payment_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoice_status_payment_sent = /** @type {((inputs?: Einvoice_Status_Payment_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoice_Status_Payment_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoice_status_payment_sent(inputs)
	return en_einvoice_status_payment_sent(inputs)
});