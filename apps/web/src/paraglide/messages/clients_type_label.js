/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Type_LabelInputs */

const en_clients_type_label = /** @type {(inputs: Clients_Type_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Relationship type`)
};

const fr_clients_type_label = /** @type {(inputs: Clients_Type_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type de relation`)
};

/**
* | output |
* | --- |
* | "Relationship type" |
*
* @param {Clients_Type_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_type_label = /** @type {((inputs?: Clients_Type_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Type_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_type_label(inputs)
	return en_clients_type_label(inputs)
});