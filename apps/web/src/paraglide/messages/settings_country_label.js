/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Country_LabelInputs */

const en_settings_country_label = /** @type {(inputs: Settings_Country_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Country of business`)
};

const fr_settings_country_label = /** @type {(inputs: Settings_Country_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pays d'exercice`)
};

/**
* | output |
* | --- |
* | "Country of business" |
*
* @param {Settings_Country_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_country_label = /** @type {((inputs?: Settings_Country_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Country_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_country_label(inputs)
	return en_settings_country_label(inputs)
});