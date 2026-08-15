/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rates_FailedInputs */

const en_settings_rates_failed = /** @type {(inputs: Settings_Rates_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The URSSAF scale could not be read. Your current rates are unchanged.`)
};

const fr_settings_rates_failed = /** @type {(inputs: Settings_Rates_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le barème de l'URSSAF n'a pas pu être lu. Vos taux actuels sont conservés.`)
};

/**
* | output |
* | --- |
* | "The URSSAF scale could not be read. Your current rates are unchanged." |
*
* @param {Settings_Rates_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_rates_failed = /** @type {((inputs?: Settings_Rates_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rates_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_rates_failed(inputs)
	return en_settings_rates_failed(inputs)
});