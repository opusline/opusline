/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rates_Never_ReadInputs */

const en_settings_rates_never_read = /** @type {(inputs: Settings_Rates_Never_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scale never read`)
};

const fr_settings_rates_never_read = /** @type {(inputs: Settings_Rates_Never_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Barème jamais lu`)
};

/**
* | output |
* | --- |
* | "Scale never read" |
*
* @param {Settings_Rates_Never_ReadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_rates_never_read = /** @type {((inputs?: Settings_Rates_Never_ReadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rates_Never_ReadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_rates_never_read(inputs)
	return en_settings_rates_never_read(inputs)
});