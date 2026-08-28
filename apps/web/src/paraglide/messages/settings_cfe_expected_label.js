/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Cfe_Expected_LabelInputs */

const en_settings_cfe_expected_label = /** @type {(inputs: Settings_Cfe_Expected_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected annual CFE`)
};

const fr_settings_cfe_expected_label = /** @type {(inputs: Settings_Cfe_Expected_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CFE annuelle attendue`)
};

/**
* | output |
* | --- |
* | "Expected annual CFE" |
*
* @param {Settings_Cfe_Expected_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_cfe_expected_label = /** @type {((inputs?: Settings_Cfe_Expected_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Cfe_Expected_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_cfe_expected_label(inputs)
	return en_settings_cfe_expected_label(inputs)
});