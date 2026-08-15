/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ terms: NonNullable<unknown> }} Clients_Payment_AtInputs */

const en_clients_payment_at = /** @type {(inputs: Clients_Payment_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Payment within ${i?.terms}`)
};

const fr_clients_payment_at = /** @type {(inputs: Clients_Payment_AtInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Paiement à ${i?.terms}`)
};

/**
* | output |
* | --- |
* | "Payment within {terms}" |
*
* @param {Clients_Payment_AtInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_payment_at = /** @type {((inputs: Clients_Payment_AtInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Payment_AtInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_payment_at(inputs)
	return en_clients_payment_at(inputs)
});