/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Reference_Tax_Income_LabelInputs */

const en_settings_reference_tax_income_label = /** @type {(inputs: Settings_Reference_Tax_Income_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenu fiscal de référence`)
};

const fr_settings_reference_tax_income_label = /** @type {(inputs: Settings_Reference_Tax_Income_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenu fiscal de référence`)
};

/**
* | output |
* | --- |
* | "Revenu fiscal de référence" |
*
* @param {Settings_Reference_Tax_Income_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_reference_tax_income_label = /** @type {((inputs?: Settings_Reference_Tax_Income_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Reference_Tax_Income_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_reference_tax_income_label(inputs)
	return en_settings_reference_tax_income_label(inputs)
});