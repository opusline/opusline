/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Buffer_InvalidInputs */

const en_settings_buffer_invalid = /** @type {(inputs: Settings_Buffer_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter an amount, or leave it empty.`)
};

const fr_settings_buffer_invalid = /** @type {(inputs: Settings_Buffer_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez un montant, ou laissez vide.`)
};

/**
* | output |
* | --- |
* | "Enter an amount, or leave it empty." |
*
* @param {Settings_Buffer_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_buffer_invalid = /** @type {((inputs?: Settings_Buffer_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Buffer_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_buffer_invalid(inputs)
	return en_settings_buffer_invalid(inputs)
});