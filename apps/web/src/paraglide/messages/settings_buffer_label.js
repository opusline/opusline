/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Buffer_LabelInputs */

const en_settings_buffer_label = /** @type {(inputs: Settings_Buffer_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Treasury buffer`)
};

const fr_settings_buffer_label = /** @type {(inputs: Settings_Buffer_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Matelas de trésorerie`)
};

/**
* | output |
* | --- |
* | "Treasury buffer" |
*
* @param {Settings_Buffer_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_buffer_label = /** @type {((inputs?: Settings_Buffer_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Buffer_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_buffer_label(inputs)
	return en_settings_buffer_label(inputs)
});