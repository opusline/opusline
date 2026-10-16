/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Beta_HintInputs */

const en_settings_tab_beta_hint = /** @type {(inputs: Settings_Tab_Beta_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Features being tested`)
};

const fr_settings_tab_beta_hint = /** @type {(inputs: Settings_Tab_Beta_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fonctionnalités en test`)
};

/**
* | output |
* | --- |
* | "Features being tested" |
*
* @param {Settings_Tab_Beta_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tab_beta_hint = /** @type {((inputs?: Settings_Tab_Beta_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tab_Beta_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_tab_beta_hint(inputs)
	return en_settings_tab_beta_hint(inputs)
});