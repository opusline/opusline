/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Client_Type_DirectInputs */

const en_client_type_direct = /** @type {(inputs: Client_Type_DirectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Direct`)
};

const fr_client_type_direct = /** @type {(inputs: Client_Type_DirectInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Direct`)
};

/**
* | output |
* | --- |
* | "Direct" |
*
* @param {Client_Type_DirectInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const client_type_direct = /** @type {((inputs?: Client_Type_DirectInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Client_Type_DirectInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_client_type_direct(inputs)
	return en_client_type_direct(inputs)
});