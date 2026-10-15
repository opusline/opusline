/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Buffer_HintInputs */

const en_settings_buffer_hint = /** @type {(inputs: Settings_Buffer_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount kept in the business account before any transfer to your personal account.`)
};

const fr_settings_buffer_hint = /** @type {(inputs: Settings_Buffer_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Somme gardée sur le compte pro avant tout virement vers votre compte personnel.`)
};

/**
* | output |
* | --- |
* | "Amount kept in the business account before any transfer to your personal account." |
*
* @param {Settings_Buffer_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_buffer_hint = /** @type {((inputs?: Settings_Buffer_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Buffer_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_buffer_hint(inputs)
	return en_settings_buffer_hint(inputs)
});