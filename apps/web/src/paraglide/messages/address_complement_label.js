/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Address_Complement_LabelInputs */

const en_address_complement_label = /** @type {(inputs: Address_Complement_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Address line 2`)
};

const fr_address_complement_label = /** @type {(inputs: Address_Complement_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Complément d'adresse`)
};

/**
* | output |
* | --- |
* | "Address line 2" |
*
* @param {Address_Complement_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const address_complement_label = /** @type {((inputs?: Address_Complement_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Address_Complement_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_address_complement_label(inputs)
	return en_address_complement_label(inputs)
});