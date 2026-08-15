/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown>, date: NonNullable<unknown> }} Settings_Rates_StatusInputs */

const en_settings_rates_status = /** @type {(inputs: Settings_Rates_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.year} scale · last checked on ${i?.date}`)
};

const fr_settings_rates_status = /** @type {(inputs: Settings_Rates_StatusInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Barème ${i?.year} · dernière vérification le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "{year} scale · last checked on {date}" |
*
* @param {Settings_Rates_StatusInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_rates_status = /** @type {((inputs: Settings_Rates_StatusInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rates_StatusInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_rates_status(inputs)
	return en_settings_rates_status(inputs)
});