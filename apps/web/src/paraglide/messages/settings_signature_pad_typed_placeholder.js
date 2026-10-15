/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_Pad_Typed_PlaceholderInputs */

const en_settings_signature_pad_typed_placeholder = /** @type {(inputs: Settings_Signature_Pad_Typed_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your name`)
};

const fr_settings_signature_pad_typed_placeholder = /** @type {(inputs: Settings_Signature_Pad_Typed_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre nom`)
};

/**
* | output |
* | --- |
* | "Your name" |
*
* @param {Settings_Signature_Pad_Typed_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_pad_typed_placeholder = /** @type {((inputs?: Settings_Signature_Pad_Typed_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_Pad_Typed_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_pad_typed_placeholder(inputs)
	return en_settings_signature_pad_typed_placeholder(inputs)
});