/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Logo_Input_AriaInputs */

const en_settings_logo_input_aria = /** @type {(inputs: Settings_Logo_Input_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Company logo`)
};

const fr_settings_logo_input_aria = /** @type {(inputs: Settings_Logo_Input_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Logo de l'entreprise`)
};

/**
* | output |
* | --- |
* | "Company logo" |
*
* @param {Settings_Logo_Input_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_logo_input_aria = /** @type {((inputs?: Settings_Logo_Input_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Logo_Input_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_logo_input_aria(inputs)
	return en_settings_logo_input_aria(inputs)
});