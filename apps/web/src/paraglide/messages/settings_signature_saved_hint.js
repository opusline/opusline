/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_Saved_HintInputs */

const en_settings_signature_saved_hint = /** @type {(inputs: Settings_Signature_Saved_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Applied automatically to generated documents.`)
};

const fr_settings_signature_saved_hint = /** @type {(inputs: Settings_Signature_Saved_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apposée automatiquement sur les documents générés.`)
};

/**
* | output |
* | --- |
* | "Applied automatically to generated documents." |
*
* @param {Settings_Signature_Saved_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_saved_hint = /** @type {((inputs?: Settings_Signature_Saved_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_Saved_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_saved_hint(inputs)
	return en_settings_signature_saved_hint(inputs)
});