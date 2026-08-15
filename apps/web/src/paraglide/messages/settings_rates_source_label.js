/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rates_Source_LabelInputs */

const en_settings_rates_source_label = /** @type {(inputs: Settings_Rates_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rate source`)
};

const fr_settings_rates_source_label = /** @type {(inputs: Settings_Rates_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source des taux`)
};

/**
* | output |
* | --- |
* | "Rate source" |
*
* @param {Settings_Rates_Source_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_rates_source_label = /** @type {((inputs?: Settings_Rates_Source_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rates_Source_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_rates_source_label(inputs)
	return en_settings_rates_source_label(inputs)
});