/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Logo_Remove_AriaInputs */

const en_settings_logo_remove_aria = /** @type {(inputs: Settings_Logo_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove the logo`)
};

const fr_settings_logo_remove_aria = /** @type {(inputs: Settings_Logo_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retirer le logo`)
};

/**
* | output |
* | --- |
* | "Remove the logo" |
*
* @param {Settings_Logo_Remove_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_logo_remove_aria = /** @type {((inputs?: Settings_Logo_Remove_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Logo_Remove_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_logo_remove_aria(inputs)
	return en_settings_logo_remove_aria(inputs)
});