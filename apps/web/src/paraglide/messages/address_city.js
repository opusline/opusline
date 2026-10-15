/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Address_CityInputs */

const en_address_city = /** @type {(inputs: Address_CityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`City`)
};

const fr_address_city = /** @type {(inputs: Address_CityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ville`)
};

/**
* | output |
* | --- |
* | "City" |
*
* @param {Address_CityInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const address_city = /** @type {((inputs?: Address_CityInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Address_CityInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_address_city(inputs)
	return en_address_city(inputs)
});