/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_Pad_AreaInputs */

const en_settings_signature_pad_area = /** @type {(inputs: Settings_Signature_Pad_AreaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signature area`)
};

const fr_settings_signature_pad_area = /** @type {(inputs: Settings_Signature_Pad_AreaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zone de signature`)
};

/**
* | output |
* | --- |
* | "Signature area" |
*
* @param {Settings_Signature_Pad_AreaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_pad_area = /** @type {((inputs?: Settings_Signature_Pad_AreaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_Pad_AreaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_pad_area(inputs)
	return en_settings_signature_pad_area(inputs)
});