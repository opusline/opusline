/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Address_Street_PlaceholderInputs */

const en_address_street_placeholder = /** @type {(inputs: Address_Street_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`12 Example Street`)
};

const fr_address_street_placeholder = /** @type {(inputs: Address_Street_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`12 rue de l'Exemple`)
};

/**
* | output |
* | --- |
* | "12 Example Street" |
*
* @param {Address_Street_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const address_street_placeholder = /** @type {((inputs?: Address_Street_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Address_Street_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_address_street_placeholder(inputs)
	return en_address_street_placeholder(inputs)
});