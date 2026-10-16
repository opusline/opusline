/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Logo_Reject_SizeInputs */

const en_settings_logo_reject_size = /** @type {(inputs: Settings_Logo_Reject_SizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`too heavy (max 1.5 MB)`)
};

const fr_settings_logo_reject_size = /** @type {(inputs: Settings_Logo_Reject_SizeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`trop lourd (max 1,5 Mo)`)
};

/**
* | output |
* | --- |
* | "too heavy (max 1.5 MB)" |
*
* @param {Settings_Logo_Reject_SizeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_logo_reject_size = /** @type {((inputs?: Settings_Logo_Reject_SizeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Logo_Reject_SizeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_logo_reject_size(inputs)
	return en_settings_logo_reject_size(inputs)
});