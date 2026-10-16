/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Iban_PlaceholderInputs */

const en_settings_iban_placeholder = /** @type {(inputs: Settings_Iban_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FR76 0000 0000 0000 0000 0000 000`)
};

const fr_settings_iban_placeholder = /** @type {(inputs: Settings_Iban_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FR76 0000 0000 0000 0000 0000 000`)
};

/**
* | output |
* | --- |
* | "FR76 0000 0000 0000 0000 0000 000" |
*
* @param {Settings_Iban_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_iban_placeholder = /** @type {((inputs?: Settings_Iban_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Iban_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_iban_placeholder(inputs)
	return en_settings_iban_placeholder(inputs)
});