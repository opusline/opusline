/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Auto_Entrepreneur_HintInputs */

const en_settings_auto_entrepreneur_hint = /** @type {(inputs: Settings_Auto_Entrepreneur_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The only status handled for now. Companies will come later.`)
};

const fr_settings_auto_entrepreneur_hint = /** @type {(inputs: Settings_Auto_Entrepreneur_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Seul statut géré pour l'instant. Les sociétés arriveront plus tard.`)
};

/**
* | output |
* | --- |
* | "The only status handled for now. Companies will come later." |
*
* @param {Settings_Auto_Entrepreneur_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_auto_entrepreneur_hint = /** @type {((inputs?: Settings_Auto_Entrepreneur_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Auto_Entrepreneur_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_auto_entrepreneur_hint(inputs)
	return en_settings_auto_entrepreneur_hint(inputs)
});