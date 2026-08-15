/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Type_Option_InternalInputs */

const en_clients_type_option_internal = /** @type {(inputs: Clients_Type_Option_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Internal / personal`)
};

const fr_clients_type_option_internal = /** @type {(inputs: Clients_Type_Option_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Interne / perso`)
};

/**
* | output |
* | --- |
* | "Internal / personal" |
*
* @param {Clients_Type_Option_InternalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_type_option_internal = /** @type {((inputs?: Clients_Type_Option_InternalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Type_Option_InternalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_type_option_internal(inputs)
	return en_clients_type_option_internal(inputs)
});