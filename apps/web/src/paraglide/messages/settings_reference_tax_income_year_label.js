/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Reference_Tax_Income_Year_LabelInputs */



/**
* | output |
* | --- |
* | "Income of" |
*
* @param {Settings_Reference_Tax_Income_Year_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_reference_tax_income_year_label = /** @type {((inputs?: Settings_Reference_Tax_Income_Year_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Reference_Tax_Income_Year_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Revenus de l'année")
	return /** @type {LocalizedString} */ ("Income of")
});