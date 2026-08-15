/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Acre_Switch_LabelInputs */

const en_settings_acre_switch_label = /** @type {(inputs: Settings_Acre_Switch_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I benefit from the ACRE`)
};

const fr_settings_acre_switch_label = /** @type {(inputs: Settings_Acre_Switch_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Je bénéficie de l'ACRE`)
};

/**
* | output |
* | --- |
* | "I benefit from the ACRE" |
*
* @param {Settings_Acre_Switch_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_acre_switch_label = /** @type {((inputs?: Settings_Acre_Switch_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Acre_Switch_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_acre_switch_label(inputs)
	return en_settings_acre_switch_label(inputs)
});