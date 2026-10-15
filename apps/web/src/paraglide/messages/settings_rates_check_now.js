/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rates_Check_NowInputs */

const en_settings_rates_check_now = /** @type {(inputs: Settings_Rates_Check_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check now`)
};

const fr_settings_rates_check_now = /** @type {(inputs: Settings_Rates_Check_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vérifier maintenant`)
};

/**
* | output |
* | --- |
* | "Check now" |
*
* @param {Settings_Rates_Check_NowInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_rates_check_now = /** @type {((inputs?: Settings_Rates_Check_NowInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rates_Check_NowInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_rates_check_now(inputs)
	return en_settings_rates_check_now(inputs)
});