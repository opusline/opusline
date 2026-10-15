/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Regional_LabelInputs */

const en_settings_tab_regional_label = /** @type {(inputs: Settings_Tab_Regional_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Localisation`)
};

const fr_settings_tab_regional_label = /** @type {(inputs: Settings_Tab_Regional_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Localisation`)
};

/**
* | output |
* | --- |
* | "Localisation" |
*
* @param {Settings_Tab_Regional_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tab_regional_label = /** @type {((inputs?: Settings_Tab_Regional_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tab_Regional_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_tab_regional_label(inputs)
	return en_settings_tab_regional_label(inputs)
});