/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Client_Type_IntermediaryInputs */

const en_client_type_intermediary = /** @type {(inputs: Client_Type_IntermediaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Intermediary`)
};

const fr_client_type_intermediary = /** @type {(inputs: Client_Type_IntermediaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Intermédiaire`)
};

/**
* | output |
* | --- |
* | "Intermediary" |
*
* @param {Client_Type_IntermediaryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const client_type_intermediary = /** @type {((inputs?: Client_Type_IntermediaryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Client_Type_IntermediaryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_client_type_intermediary(inputs)
	return en_client_type_intermediary(inputs)
});