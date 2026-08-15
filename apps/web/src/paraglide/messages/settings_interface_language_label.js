/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Interface_Language_LabelInputs */

const en_settings_interface_language_label = /** @type {(inputs: Settings_Interface_Language_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Interface language`)
};

const fr_settings_interface_language_label = /** @type {(inputs: Settings_Interface_Language_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue de l'interface`)
};

/**
* | output |
* | --- |
* | "Interface language" |
*
* @param {Settings_Interface_Language_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_interface_language_label = /** @type {((inputs?: Settings_Interface_Language_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Interface_Language_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_interface_language_label(inputs)
	return en_settings_interface_language_label(inputs)
});