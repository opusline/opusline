/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Signature_FailedInputs */

const en_settings_signature_failed = /** @type {(inputs: Settings_Signature_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The upload failed. Try again in a moment.`)
};

const fr_settings_signature_failed = /** @type {(inputs: Settings_Signature_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'envoi a échoué. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The upload failed. Try again in a moment." |
*
* @param {Settings_Signature_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_signature_failed = /** @type {((inputs?: Settings_Signature_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Signature_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_signature_failed(inputs)
	return en_settings_signature_failed(inputs)
});