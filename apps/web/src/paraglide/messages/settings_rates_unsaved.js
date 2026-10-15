/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rates_UnsavedInputs */

const en_settings_rates_unsaved = /** @type {(inputs: Settings_Rates_UnsavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save to apply the scale to this situation.`)
};

const fr_settings_rates_unsaved = /** @type {(inputs: Settings_Rates_UnsavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrez pour appliquer le barème à cette situation.`)
};

/**
* | output |
* | --- |
* | "Save to apply the scale to this situation." |
*
* @param {Settings_Rates_UnsavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_rates_unsaved = /** @type {((inputs?: Settings_Rates_UnsavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rates_UnsavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_rates_unsaved(inputs)
	return en_settings_rates_unsaved(inputs)
});