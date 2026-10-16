/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Logo_TitleInputs */

const en_settings_logo_title = /** @type {(inputs: Settings_Logo_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Logo`)
};

const fr_settings_logo_title = /** @type {(inputs: Settings_Logo_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Logo`)
};

/**
* | output |
* | --- |
* | "Logo" |
*
* @param {Settings_Logo_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_logo_title = /** @type {((inputs?: Settings_Logo_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Logo_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_logo_title(inputs)
	return en_settings_logo_title(inputs)
});