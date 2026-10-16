/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Iban_LabelInputs */

const en_settings_iban_label = /** @type {(inputs: Settings_Iban_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IBAN`)
};

const fr_settings_iban_label = /** @type {(inputs: Settings_Iban_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`IBAN`)
};

/**
* | output |
* | --- |
* | "IBAN" |
*
* @param {Settings_Iban_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_iban_label = /** @type {((inputs?: Settings_Iban_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Iban_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_iban_label(inputs)
	return en_settings_iban_label(inputs)
});