/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Business_Started_LabelInputs */

const en_settings_business_started_label = /** @type {(inputs: Settings_Business_Started_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business start date`)
};

const fr_settings_business_started_label = /** @type {(inputs: Settings_Business_Started_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Début d'activité`)
};

/**
* | output |
* | --- |
* | "Business start date" |
*
* @param {Settings_Business_Started_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_business_started_label = /** @type {((inputs?: Settings_Business_Started_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Business_Started_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_business_started_label(inputs)
	return en_settings_business_started_label(inputs)
});