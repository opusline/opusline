/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Descriptor_InternalInputs */

const en_clients_descriptor_internal = /** @type {(inputs: Clients_Descriptor_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Internal projects`)
};

const fr_clients_descriptor_internal = /** @type {(inputs: Clients_Descriptor_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Projets internes`)
};

/**
* | output |
* | --- |
* | "Internal projects" |
*
* @param {Clients_Descriptor_InternalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_descriptor_internal = /** @type {((inputs?: Clients_Descriptor_InternalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Descriptor_InternalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_descriptor_internal(inputs)
	return en_clients_descriptor_internal(inputs)
});