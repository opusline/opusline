/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_SavedInputs */

const en_settings_signature_saved = /** @type {(inputs: Settings_Signature_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saved signature`)
};

const fr_settings_signature_saved = /** @type {(inputs: Settings_Signature_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signature enregistrée`)
};

/**
* | output |
* | --- |
* | "Saved signature" |
*
* @param {Settings_Signature_SavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_saved = /** @type {((inputs?: Settings_Signature_SavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_SavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_saved(inputs)
	return en_settings_signature_saved(inputs)
});