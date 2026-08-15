/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rate_InvalidInputs */

const en_settings_rate_invalid = /** @type {(inputs: Settings_Rate_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter a rate between 0 and 100.`)
};

const fr_settings_rate_invalid = /** @type {(inputs: Settings_Rate_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez un taux entre 0 et 100.`)
};

/**
* | output |
* | --- |
* | "Enter a rate between 0 and 100." |
*
* @param {Settings_Rate_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_rate_invalid = /** @type {((inputs?: Settings_Rate_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rate_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_rate_invalid(inputs)
	return en_settings_rate_invalid(inputs)
});