/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Identity_TitleInputs */

const en_settings_identity_title = /** @type {(inputs: Settings_Identity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identity and contact details`)
};

const fr_settings_identity_title = /** @type {(inputs: Settings_Identity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identité et coordonnées`)
};

/**
* | output |
* | --- |
* | "Identity and contact details" |
*
* @param {Settings_Identity_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_identity_title = /** @type {((inputs?: Settings_Identity_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Identity_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_identity_title(inputs)
	return en_settings_identity_title(inputs)
});