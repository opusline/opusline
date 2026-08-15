/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Address_Postal_CodeInputs */

const en_address_postal_code = /** @type {(inputs: Address_Postal_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Postal code`)
};

const fr_address_postal_code = /** @type {(inputs: Address_Postal_CodeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Code postal`)
};

/**
* | output |
* | --- |
* | "Postal code" |
*
* @param {Address_Postal_CodeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const address_postal_code = /** @type {((inputs?: Address_Postal_CodeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Address_Postal_CodeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_address_postal_code(inputs)
	return en_address_postal_code(inputs)
});