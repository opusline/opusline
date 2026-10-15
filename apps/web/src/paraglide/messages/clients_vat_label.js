/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Vat_LabelInputs */

const en_clients_vat_label = /** @type {(inputs: Clients_Vat_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Intra-community VAT`)
};

const fr_clients_vat_label = /** @type {(inputs: Clients_Vat_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA intracommunautaire`)
};

/**
* | output |
* | --- |
* | "Intra-community VAT" |
*
* @param {Clients_Vat_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_vat_label = /** @type {((inputs?: Clients_Vat_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Vat_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_vat_label(inputs)
	return en_clients_vat_label(inputs)
});