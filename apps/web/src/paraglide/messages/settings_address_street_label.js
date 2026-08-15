/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Address_Street_LabelInputs */

const en_settings_address_street_label = /** @type {(inputs: Settings_Address_Street_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Address`)
};

const fr_settings_address_street_label = /** @type {(inputs: Settings_Address_Street_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adresse`)
};

/**
* | output |
* | --- |
* | "Address" |
*
* @param {Settings_Address_Street_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_address_street_label = /** @type {((inputs?: Settings_Address_Street_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Address_Street_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_address_street_label(inputs)
	return en_settings_address_street_label(inputs)
});