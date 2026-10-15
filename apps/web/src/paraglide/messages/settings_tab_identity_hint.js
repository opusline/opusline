/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Identity_HintInputs */

const en_settings_tab_identity_hint = /** @type {(inputs: Settings_Tab_Identity_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contact details, address`)
};

const fr_settings_tab_identity_hint = /** @type {(inputs: Settings_Tab_Identity_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coordonnées, adresse`)
};

/**
* | output |
* | --- |
* | "Contact details, address" |
*
* @param {Settings_Tab_Identity_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tab_identity_hint = /** @type {((inputs?: Settings_Tab_Identity_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tab_Identity_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_tab_identity_hint(inputs)
	return en_settings_tab_identity_hint(inputs)
});