/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Liberating_Settings_LinkInputs */

const en_declarations_liberating_settings_link = /** @type {(inputs: Declarations_Liberating_Settings_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tax settings`)
};

const fr_declarations_liberating_settings_link = /** @type {(inputs: Declarations_Liberating_Settings_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réglages fiscaux`)
};

/**
* | output |
* | --- |
* | "Tax settings" |
*
* @param {Declarations_Liberating_Settings_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_liberating_settings_link = /** @type {((inputs?: Declarations_Liberating_Settings_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Liberating_Settings_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_liberating_settings_link(inputs)
	return en_declarations_liberating_settings_link(inputs)
});