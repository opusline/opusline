/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Logo_Reject_TypeInputs */

const en_settings_logo_reject_type = /** @type {(inputs: Settings_Logo_Reject_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PNG, JPG or SVG only`)
};

const fr_settings_logo_reject_type = /** @type {(inputs: Settings_Logo_Reject_TypeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`PNG, JPG ou SVG uniquement`)
};

/**
* | output |
* | --- |
* | "PNG, JPG or SVG only" |
*
* @param {Settings_Logo_Reject_TypeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_logo_reject_type = /** @type {((inputs?: Settings_Logo_Reject_TypeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Logo_Reject_TypeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_logo_reject_type(inputs)
	return en_settings_logo_reject_type(inputs)
});