/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Bank_TitleInputs */

const en_settings_bank_title = /** @type {(inputs: Settings_Bank_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank details`)
};

const fr_settings_bank_title = /** @type {(inputs: Settings_Bank_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coordonnées bancaires`)
};

/**
* | output |
* | --- |
* | "Bank details" |
*
* @param {Settings_Bank_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_bank_title = /** @type {((inputs?: Settings_Bank_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Bank_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_bank_title(inputs)
	return en_settings_bank_title(inputs)
});