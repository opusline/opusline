/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Address_Complement_PlaceholderInputs */

const en_address_complement_placeholder = /** @type {(inputs: Address_Complement_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Building, floor, unit…`)
};

const fr_address_complement_placeholder = /** @type {(inputs: Address_Complement_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bâtiment, étage, boîte…`)
};

/**
* | output |
* | --- |
* | "Building, floor, unit…" |
*
* @param {Address_Complement_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const address_complement_placeholder = /** @type {((inputs?: Address_Complement_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Address_Complement_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_address_complement_placeholder(inputs)
	return en_address_complement_placeholder(inputs)
});