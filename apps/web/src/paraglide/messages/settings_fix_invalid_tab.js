/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ tab: NonNullable<unknown> }} Settings_Fix_Invalid_TabInputs */

const en_settings_fix_invalid_tab = /** @type {(inputs: Settings_Fix_Invalid_TabInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fix the invalid field in the ${i?.tab} tab.`)
};

const fr_settings_fix_invalid_tab = /** @type {(inputs: Settings_Fix_Invalid_TabInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Corrigez le champ en erreur dans l'onglet ${i?.tab}.`)
};

/**
* | output |
* | --- |
* | "Fix the invalid field in the {tab} tab." |
*
* @param {Settings_Fix_Invalid_TabInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_fix_invalid_tab = /** @type {((inputs: Settings_Fix_Invalid_TabInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Fix_Invalid_TabInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_fix_invalid_tab(inputs)
	return en_settings_fix_invalid_tab(inputs)
});