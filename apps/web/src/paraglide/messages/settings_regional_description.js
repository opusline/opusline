/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Regional_DescriptionInputs */

const en_settings_regional_description = /** @type {(inputs: Settings_Regional_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Country of business, the currency Opusline counts your activity in, and the interface language.`)
};

const fr_settings_regional_description = /** @type {(inputs: Settings_Regional_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pays d'exercice, monnaie dans laquelle Opusline compte votre activité, et langue de l'interface.`)
};

/**
* | output |
* | --- |
* | "Country of business, the currency Opusline counts your activity in, and the interface language." |
*
* @param {Settings_Regional_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_regional_description = /** @type {((inputs?: Settings_Regional_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Regional_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_regional_description(inputs)
	return en_settings_regional_description(inputs)
});