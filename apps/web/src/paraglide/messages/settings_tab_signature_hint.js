/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Signature_HintInputs */

const en_settings_tab_signature_hint = /** @type {(inputs: Settings_Tab_Signature_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark applied to documents`)
};

const fr_settings_tab_signature_hint = /** @type {(inputs: Settings_Tab_Signature_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tracé apposé aux documents`)
};

/**
* | output |
* | --- |
* | "Mark applied to documents" |
*
* @param {Settings_Tab_Signature_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tab_signature_hint = /** @type {((inputs?: Settings_Tab_Signature_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tab_Signature_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_tab_signature_hint(inputs)
	return en_settings_tab_signature_hint(inputs)
});