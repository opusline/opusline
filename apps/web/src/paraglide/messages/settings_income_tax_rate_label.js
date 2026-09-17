/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Income_Tax_Rate_LabelInputs */

const en_settings_income_tax_rate_label = /** @type {(inputs: Settings_Income_Tax_Rate_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Withholding tax rate`)
};

const fr_settings_income_tax_rate_label = /** @type {(inputs: Settings_Income_Tax_Rate_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux de prélèvement à la source`)
};

/**
* | output |
* | --- |
* | "Withholding tax rate" |
*
* @param {Settings_Income_Tax_Rate_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_income_tax_rate_label = /** @type {((inputs?: Settings_Income_Tax_Rate_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Income_Tax_Rate_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_income_tax_rate_label(inputs)
	return en_settings_income_tax_rate_label(inputs)
});