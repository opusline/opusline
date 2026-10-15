/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_SettingsInputs */

const en_nav_settings = /** @type {(inputs: Nav_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings`)
};

const fr_nav_settings = /** @type {(inputs: Nav_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réglages`)
};

/**
* | output |
* | --- |
* | "Settings" |
*
* @param {Nav_SettingsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_settings = /** @type {((inputs?: Nav_SettingsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_SettingsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_settings(inputs)
	return en_nav_settings(inputs)
});