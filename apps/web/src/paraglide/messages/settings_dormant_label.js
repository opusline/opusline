/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Dormant_LabelInputs */

const en_settings_dormant_label = /** @type {(inputs: Settings_Dormant_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retire work left untouched`)
};

const fr_settings_dormant_label = /** @type {(inputs: Settings_Dormant_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clôturer ce qui n'a pas bougé`)
};

/**
* | output |
* | --- |
* | "Retire work left untouched" |
*
* @param {Settings_Dormant_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_dormant_label = /** @type {((inputs?: Settings_Dormant_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Dormant_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_dormant_label(inputs)
	return en_settings_dormant_label(inputs)
});