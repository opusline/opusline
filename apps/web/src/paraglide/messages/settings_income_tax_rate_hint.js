/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Income_Tax_Rate_HintInputs */

const en_settings_income_tax_rate_hint = /** @type {(inputs: Settings_Income_Tax_Rate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The personal rate on the avis: it prices the income tax set aside while the versement libératoire is off.`)
};

const fr_settings_income_tax_rate_hint = /** @type {(inputs: Settings_Income_Tax_Rate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le taux personnalisé de l'avis : il chiffre l'impôt mis de côté quand le versement libératoire est désactivé.`)
};

/**
* | output |
* | --- |
* | "The personal rate on the avis: it prices the income tax set aside while the versement libératoire is off." |
*
* @param {Settings_Income_Tax_Rate_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_income_tax_rate_hint = /** @type {((inputs?: Settings_Income_Tax_Rate_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Income_Tax_Rate_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_income_tax_rate_hint(inputs)
	return en_settings_income_tax_rate_hint(inputs)
});