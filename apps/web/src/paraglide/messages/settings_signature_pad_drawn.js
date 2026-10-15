/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_Pad_DrawnInputs */

const en_settings_signature_pad_drawn = /** @type {(inputs: Settings_Signature_Pad_DrawnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drawn signature`)
};

const fr_settings_signature_pad_drawn = /** @type {(inputs: Settings_Signature_Pad_DrawnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signature tracée`)
};

/**
* | output |
* | --- |
* | "Drawn signature" |
*
* @param {Settings_Signature_Pad_DrawnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_pad_drawn = /** @type {((inputs?: Settings_Signature_Pad_DrawnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_Pad_DrawnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_pad_drawn(inputs)
	return en_settings_signature_pad_drawn(inputs)
});