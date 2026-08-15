/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_City_PlaceholderInputs */

const en_settings_city_placeholder = /** @type {(inputs: Settings_City_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`City`)
};

const fr_settings_city_placeholder = /** @type {(inputs: Settings_City_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ville`)
};

/**
* | output |
* | --- |
* | "City" |
*
* @param {Settings_City_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_city_placeholder = /** @type {((inputs?: Settings_City_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_City_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_city_placeholder(inputs)
	return en_settings_city_placeholder(inputs)
});