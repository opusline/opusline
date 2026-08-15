/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Billing_Address_LabelInputs */

const en_clients_billing_address_label = /** @type {(inputs: Clients_Billing_Address_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billing address`)
};

const fr_clients_billing_address_label = /** @type {(inputs: Clients_Billing_Address_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adresse de facturation`)
};

/**
* | output |
* | --- |
* | "Billing address" |
*
* @param {Clients_Billing_Address_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_billing_address_label = /** @type {((inputs?: Clients_Billing_Address_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Billing_Address_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_billing_address_label(inputs)
	return en_clients_billing_address_label(inputs)
});