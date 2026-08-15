/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Payment_Terms_LabelInputs */

const en_clients_payment_terms_label = /** @type {(inputs: Clients_Payment_Terms_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Payment terms`)
};

const fr_clients_payment_terms_label = /** @type {(inputs: Clients_Payment_Terms_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délai de paiement`)
};

/**
* | output |
* | --- |
* | "Payment terms" |
*
* @param {Clients_Payment_Terms_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_payment_terms_label = /** @type {((inputs?: Clients_Payment_Terms_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Payment_Terms_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_payment_terms_label(inputs)
	return en_clients_payment_terms_label(inputs)
});