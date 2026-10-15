/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Name_LabelInputs */

const en_clients_name_label = /** @type {(inputs: Clients_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Company name`)
};

const fr_clients_name_label = /** @type {(inputs: Clients_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Raison sociale`)
};

/**
* | output |
* | --- |
* | "Company name" |
*
* @param {Clients_Name_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_name_label = /** @type {((inputs?: Clients_Name_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Name_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_name_label(inputs)
	return en_clients_name_label(inputs)
});