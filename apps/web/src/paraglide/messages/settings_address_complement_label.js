/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Address_Complement_LabelInputs */

const en_settings_address_complement_label = /** @type {(inputs: Settings_Address_Complement_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Address line 2`)
};

const fr_settings_address_complement_label = /** @type {(inputs: Settings_Address_Complement_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Complément d'adresse`)
};

/**
* | output |
* | --- |
* | "Address line 2" |
*
* @param {Settings_Address_Complement_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_address_complement_label = /** @type {((inputs?: Settings_Address_Complement_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Address_Complement_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_address_complement_label(inputs)
	return en_settings_address_complement_label(inputs)
});