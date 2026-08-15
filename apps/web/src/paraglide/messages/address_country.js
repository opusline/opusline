/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Address_CountryInputs */

const en_address_country = /** @type {(inputs: Address_CountryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Country`)
};

const fr_address_country = /** @type {(inputs: Address_CountryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pays`)
};

/**
* | output |
* | --- |
* | "Country" |
*
* @param {Address_CountryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const address_country = /** @type {((inputs?: Address_CountryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Address_CountryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_address_country(inputs)
	return en_address_country(inputs)
});