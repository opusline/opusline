/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Address_Complement_ShortInputs */

const en_address_complement_short = /** @type {(inputs: Address_Complement_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Address line 2`)
};

const fr_address_complement_short = /** @type {(inputs: Address_Complement_ShortInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Complément`)
};

/**
* | output |
* | --- |
* | "Address line 2" |
*
* @param {Address_Complement_ShortInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const address_complement_short = /** @type {((inputs?: Address_Complement_ShortInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Address_Complement_ShortInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_address_complement_short(inputs)
	return en_address_complement_short(inputs)
});