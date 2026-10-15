/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_Pad_Mode_ToggleInputs */

const en_settings_signature_pad_mode_toggle = /** @type {(inputs: Settings_Signature_Pad_Mode_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signature method`)
};

const fr_settings_signature_pad_mode_toggle = /** @type {(inputs: Settings_Signature_Pad_Mode_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Méthode de signature`)
};

/**
* | output |
* | --- |
* | "Signature method" |
*
* @param {Settings_Signature_Pad_Mode_ToggleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_pad_mode_toggle = /** @type {((inputs?: Settings_Signature_Pad_Mode_ToggleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_Pad_Mode_ToggleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_pad_mode_toggle(inputs)
	return en_settings_signature_pad_mode_toggle(inputs)
});