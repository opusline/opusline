/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Reference_Tax_Income_HintInputs */

const en_settings_reference_tax_income_hint = /** @type {(inputs: Settings_Reference_Tax_Income_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`0 if you had no taxable income in France that year — for instance while living abroad.`)
};

const fr_settings_reference_tax_income_hint = /** @type {(inputs: Settings_Reference_Tax_Income_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`0 si vous n'aviez aucun revenu imposable en France cette année-là, par exemple en vivant à l'étranger.`)
};

/**
* | output |
* | --- |
* | "0 if you had no taxable income in France that year — for instance while living abroad." |
*
* @param {Settings_Reference_Tax_Income_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_reference_tax_income_hint = /** @type {((inputs?: Settings_Reference_Tax_Income_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Reference_Tax_Income_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_reference_tax_income_hint(inputs)
	return en_settings_reference_tax_income_hint(inputs)
});