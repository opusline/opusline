/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rates_RefreshingInputs */

const en_settings_rates_refreshing = /** @type {(inputs: Settings_Rates_RefreshingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checking the official rates…`)
};

const fr_settings_rates_refreshing = /** @type {(inputs: Settings_Rates_RefreshingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vérification du barème en cours…`)
};

/**
* | output |
* | --- |
* | "Checking the official rates…" |
*
* @param {Settings_Rates_RefreshingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_rates_refreshing = /** @type {((inputs?: Settings_Rates_RefreshingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rates_RefreshingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_rates_refreshing(inputs)
	return en_settings_rates_refreshing(inputs)
});