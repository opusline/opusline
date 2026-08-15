/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_Pad_TypedInputs */

const en_settings_signature_pad_typed = /** @type {(inputs: Settings_Signature_Pad_TypedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name applied as signature`)
};

const fr_settings_signature_pad_typed = /** @type {(inputs: Settings_Signature_Pad_TypedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom apposé comme signature`)
};

/**
* | output |
* | --- |
* | "Name applied as signature" |
*
* @param {Settings_Signature_Pad_TypedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_pad_typed = /** @type {((inputs?: Settings_Signature_Pad_TypedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_Pad_TypedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_pad_typed(inputs)
	return en_settings_signature_pad_typed(inputs)
});