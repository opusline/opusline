/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Currency_LabelInputs */

const en_settings_currency_label = /** @type {(inputs: Settings_Currency_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business currency`)
};

const fr_settings_currency_label = /** @type {(inputs: Settings_Currency_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Devise de l'activité`)
};

/**
* | output |
* | --- |
* | "Business currency" |
*
* @param {Settings_Currency_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_currency_label = /** @type {((inputs?: Settings_Currency_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Currency_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_currency_label(inputs)
	return en_settings_currency_label(inputs)
});