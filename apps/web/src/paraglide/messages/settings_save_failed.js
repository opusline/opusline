/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Save_FailedInputs */

const en_settings_save_failed = /** @type {(inputs: Settings_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The save failed. Try again in a moment.`)
};

const fr_settings_save_failed = /** @type {(inputs: Settings_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'enregistrement a échoué. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The save failed. Try again in a moment." |
*
* @param {Settings_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_save_failed = /** @type {((inputs?: Settings_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_save_failed(inputs)
	return en_settings_save_failed(inputs)
});