/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Language_HintInputs */

const en_settings_language_hint = /** @type {(inputs: Settings_Language_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sets the interface language and the format of amounts and numbers. CRA documents stay in French.`)
};

const fr_settings_language_hint = /** @type {(inputs: Settings_Language_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Détermine la langue de l'interface et le format des montants et des nombres. Les CRA restent en français.`)
};

/**
* | output |
* | --- |
* | "Sets the interface language and the format of amounts and numbers. CRA documents stay in French." |
*
* @param {Settings_Language_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_language_hint = /** @type {((inputs?: Settings_Language_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Language_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_language_hint(inputs)
	return en_settings_language_hint(inputs)
});