/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_Pad_Type_ModeInputs */

const en_settings_signature_pad_type_mode = /** @type {(inputs: Settings_Signature_Pad_Type_ModeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type on the keyboard`)
};

const fr_settings_signature_pad_type_mode = /** @type {(inputs: Settings_Signature_Pad_Type_ModeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisir au clavier`)
};

/**
* | output |
* | --- |
* | "Type on the keyboard" |
*
* @param {Settings_Signature_Pad_Type_ModeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_pad_type_mode = /** @type {((inputs?: Settings_Signature_Pad_Type_ModeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_Pad_Type_ModeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_pad_type_mode(inputs)
	return en_settings_signature_pad_type_mode(inputs)
});