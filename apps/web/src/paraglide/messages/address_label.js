/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Address_LabelInputs */

const en_address_label = /** @type {(inputs: Address_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Address`)
};

const fr_address_label = /** @type {(inputs: Address_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adresse`)
};

/**
* | output |
* | --- |
* | "Address" |
*
* @param {Address_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const address_label = /** @type {((inputs?: Address_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Address_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_address_label(inputs)
	return en_address_label(inputs)
});