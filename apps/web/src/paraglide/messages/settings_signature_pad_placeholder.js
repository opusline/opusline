/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_Pad_PlaceholderInputs */

const en_settings_signature_pad_placeholder = /** @type {(inputs: Settings_Signature_Pad_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Draw your signature here`)
};

const fr_settings_signature_pad_placeholder = /** @type {(inputs: Settings_Signature_Pad_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tracez votre signature ici`)
};

/**
* | output |
* | --- |
* | "Draw your signature here" |
*
* @param {Settings_Signature_Pad_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_pad_placeholder = /** @type {((inputs?: Settings_Signature_Pad_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_Pad_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_pad_placeholder(inputs)
	return en_settings_signature_pad_placeholder(inputs)
});