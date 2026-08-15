/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Eu_Vat_LabelInputs */

const en_settings_eu_vat_label = /** @type {(inputs: Settings_Eu_Vat_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Intra-community VAT number`)
};

const fr_settings_eu_vat_label = /** @type {(inputs: Settings_Eu_Vat_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA intracommunautaire`)
};

/**
* | output |
* | --- |
* | "Intra-community VAT number" |
*
* @param {Settings_Eu_Vat_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_eu_vat_label = /** @type {((inputs?: Settings_Eu_Vat_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Eu_Vat_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_eu_vat_label(inputs)
	return en_settings_eu_vat_label(inputs)
});