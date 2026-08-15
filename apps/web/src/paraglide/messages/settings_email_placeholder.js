/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Email_PlaceholderInputs */

const en_settings_email_placeholder = /** @type {(inputs: Settings_Email_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`contact@example.com`)
};

const fr_settings_email_placeholder = /** @type {(inputs: Settings_Email_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`contact@exemple.fr`)
};

/**
* | output |
* | --- |
* | "contact@example.com" |
*
* @param {Settings_Email_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_email_placeholder = /** @type {((inputs?: Settings_Email_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Email_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_email_placeholder(inputs)
	return en_settings_email_placeholder(inputs)
});