/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_SaveInputs */

const en_settings_signature_save = /** @type {(inputs: Settings_Signature_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save the signature`)
};

const fr_settings_signature_save = /** @type {(inputs: Settings_Signature_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer la signature`)
};

/**
* | output |
* | --- |
* | "Save the signature" |
*
* @param {Settings_Signature_SaveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_save = /** @type {((inputs?: Settings_Signature_SaveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_SaveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_save(inputs)
	return en_settings_signature_save(inputs)
});