/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_ClearInputs */

const en_settings_signature_clear = /** @type {(inputs: Settings_Signature_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear`)
};

const fr_settings_signature_clear = /** @type {(inputs: Settings_Signature_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Effacer`)
};

/**
* | output |
* | --- |
* | "Clear" |
*
* @param {Settings_Signature_ClearInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_clear = /** @type {((inputs?: Settings_Signature_ClearInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_ClearInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_clear(inputs)
	return en_settings_signature_clear(inputs)
});