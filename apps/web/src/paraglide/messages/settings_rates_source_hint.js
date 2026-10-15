/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rates_Source_HintInputs */

const en_settings_rates_source_hint = /** @type {(inputs: Settings_Rates_Source_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline reads the scales published by the URSSAF and applies the current rate.`)
};

const fr_settings_rates_source_hint = /** @type {(inputs: Settings_Rates_Source_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opusline lit les barèmes publiés par l'URSSAF et applique le taux en vigueur.`)
};

/**
* | output |
* | --- |
* | "Opusline reads the scales published by the URSSAF and applies the current rate." |
*
* @param {Settings_Rates_Source_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_rates_source_hint = /** @type {((inputs?: Settings_Rates_Source_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rates_Source_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_rates_source_hint(inputs)
	return en_settings_rates_source_hint(inputs)
});