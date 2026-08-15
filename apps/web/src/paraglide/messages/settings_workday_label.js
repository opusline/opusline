/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Workday_LabelInputs */

const en_settings_workday_label = /** @type {(inputs: Settings_Workday_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Length of a workday`)
};

const fr_settings_workday_label = /** @type {(inputs: Settings_Workday_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Durée d'une journée de travail`)
};

/**
* | output |
* | --- |
* | "Length of a workday" |
*
* @param {Settings_Workday_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_workday_label = /** @type {((inputs?: Settings_Workday_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Workday_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_workday_label(inputs)
	return en_settings_workday_label(inputs)
});