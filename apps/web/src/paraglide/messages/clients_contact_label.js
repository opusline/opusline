/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Contact_LabelInputs */

const en_clients_contact_label = /** @type {(inputs: Clients_Contact_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billing contact`)
};

const fr_clients_contact_label = /** @type {(inputs: Clients_Contact_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contact facturation`)
};

/**
* | output |
* | --- |
* | "Billing contact" |
*
* @param {Clients_Contact_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_contact_label = /** @type {((inputs?: Clients_Contact_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Contact_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_contact_label(inputs)
	return en_clients_contact_label(inputs)
});