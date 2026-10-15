/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Address_Suggestions_UnavailableInputs */

const en_address_suggestions_unavailable = /** @type {(inputs: Address_Suggestions_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suggestions unavailable — type the address in by hand.`)
};

const fr_address_suggestions_unavailable = /** @type {(inputs: Address_Suggestions_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suggestions indisponibles — saisissez l'adresse manuellement.`)
};

/**
* | output |
* | --- |
* | "Suggestions unavailable — type the address in by hand." |
*
* @param {Address_Suggestions_UnavailableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const address_suggestions_unavailable = /** @type {((inputs?: Address_Suggestions_UnavailableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Address_Suggestions_UnavailableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_address_suggestions_unavailable(inputs)
	return en_address_suggestions_unavailable(inputs)
});