/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Bic_PlaceholderInputs */

const en_settings_bic_placeholder = /** @type {(inputs: Settings_Bic_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AAAAFRPP`)
};

const fr_settings_bic_placeholder = /** @type {(inputs: Settings_Bic_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AAAAFRPP`)
};

/**
* | output |
* | --- |
* | "AAAAFRPP" |
*
* @param {Settings_Bic_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_bic_placeholder = /** @type {((inputs?: Settings_Bic_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Bic_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_bic_placeholder(inputs)
	return en_settings_bic_placeholder(inputs)
});