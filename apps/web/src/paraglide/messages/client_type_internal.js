/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Client_Type_InternalInputs */

const en_client_type_internal = /** @type {(inputs: Client_Type_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Internal`)
};

const fr_client_type_internal = /** @type {(inputs: Client_Type_InternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Interne`)
};

/**
* | output |
* | --- |
* | "Internal" |
*
* @param {Client_Type_InternalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const client_type_internal = /** @type {((inputs?: Client_Type_InternalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Client_Type_InternalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_client_type_internal(inputs)
	return en_client_type_internal(inputs)
});