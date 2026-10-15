/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_City_LabelInputs */

const en_settings_signature_city_label = /** @type {(inputs: Settings_Signature_City_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signing location`)
};

const fr_settings_signature_city_label = /** @type {(inputs: Settings_Signature_City_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lieu de signature`)
};

/**
* | output |
* | --- |
* | "Signing location" |
*
* @param {Settings_Signature_City_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_city_label = /** @type {((inputs?: Settings_Signature_City_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_City_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_city_label(inputs)
	return en_settings_signature_city_label(inputs)
});