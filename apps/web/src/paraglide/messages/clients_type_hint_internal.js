/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Type_Hint_InternalInputs */

const en_clients_type_hint_internal = /** @type {(inputs: Clients_Type_Hint_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non-billable projects, tracked for the record.`)
};

const fr_clients_type_hint_internal = /** @type {(inputs: Clients_Type_Hint_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Projets non facturables, suivis pour mémoire.`)
};

/**
* | output |
* | --- |
* | "Non-billable projects, tracked for the record." |
*
* @param {Clients_Type_Hint_InternalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_type_hint_internal = /** @type {((inputs?: Clients_Type_Hint_InternalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Type_Hint_InternalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_type_hint_internal(inputs)
	return en_clients_type_hint_internal(inputs)
});