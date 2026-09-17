/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Income_Tax_TitleInputs */

const en_settings_income_tax_title = /** @type {(inputs: Settings_Income_Tax_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Income tax`)
};

const fr_settings_income_tax_title = /** @type {(inputs: Settings_Income_Tax_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impôt sur le revenu`)
};

/**
* | output |
* | --- |
* | "Income tax" |
*
* @param {Settings_Income_Tax_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_income_tax_title = /** @type {((inputs?: Settings_Income_Tax_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Income_Tax_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_income_tax_title(inputs)
	return en_settings_income_tax_title(inputs)
});