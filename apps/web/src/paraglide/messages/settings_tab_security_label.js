/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Security_LabelInputs */

const en_settings_tab_security_label = /** @type {(inputs: Settings_Tab_Security_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Security`)
};

const fr_settings_tab_security_label = /** @type {(inputs: Settings_Tab_Security_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sécurité`)
};

/**
* | output |
* | --- |
* | "Security" |
*
* @param {Settings_Tab_Security_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tab_security_label = /** @type {((inputs?: Settings_Tab_Security_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tab_Security_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_tab_security_label(inputs)
	return en_settings_tab_security_label(inputs)
});