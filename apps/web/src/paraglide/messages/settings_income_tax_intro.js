/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Income_Tax_IntroInputs */

const en_settings_income_tax_intro = /** @type {(inputs: Settings_Income_Tax_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy them from your latest avis d'imposition. They tell when the versement libératoire is no longer allowed and, without it, how much to set aside for income tax.`)
};

const fr_settings_income_tax_intro = /** @type {(inputs: Settings_Income_Tax_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recopiez-les depuis votre dernier avis d'imposition. Ils disent quand le versement libératoire n'est plus permis et, sans lui, combien mettre de côté pour l'impôt sur le revenu.`)
};

/**
* | output |
* | --- |
* | "Copy them from your latest avis d'imposition. They tell when the versement libératoire is no longer allowed and, without it, how much to set aside for income..." |
*
* @param {Settings_Income_Tax_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_income_tax_intro = /** @type {((inputs?: Settings_Income_Tax_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Income_Tax_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_income_tax_intro(inputs)
	return en_settings_income_tax_intro(inputs)
});