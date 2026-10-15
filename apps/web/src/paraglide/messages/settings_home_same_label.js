/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Home_Same_LabelInputs */

const en_settings_home_same_label = /** @type {(inputs: Settings_Home_Same_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Same as the company`)
};

const fr_settings_home_same_label = /** @type {(inputs: Settings_Home_Same_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identique à la société`)
};

/**
* | output |
* | --- |
* | "Same as the company" |
*
* @param {Settings_Home_Same_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_home_same_label = /** @type {((inputs?: Settings_Home_Same_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Home_Same_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_home_same_label(inputs)
	return en_settings_home_same_label(inputs)
});