/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Liberating_Needs_IncomeInputs */

const en_declarations_liberating_needs_income = /** @type {(inputs: Declarations_Liberating_Needs_IncomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copy the revenu fiscal de référence from your latest avis d'imposition: Opusline will tell you whether the versement libératoire can go on.`)
};

const fr_declarations_liberating_needs_income = /** @type {(inputs: Declarations_Liberating_Needs_IncomeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recopiez le revenu fiscal de référence de votre dernier avis d'imposition : Opusline vous dira si le versement libératoire peut continuer.`)
};

/**
* | output |
* | --- |
* | "Copy the revenu fiscal de référence from your latest avis d'imposition: Opusline will tell you whether the versement libératoire can go on." |
*
* @param {Declarations_Liberating_Needs_IncomeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_liberating_needs_income = /** @type {((inputs?: Declarations_Liberating_Needs_IncomeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Liberating_Needs_IncomeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_liberating_needs_income(inputs)
	return en_declarations_liberating_needs_income(inputs)
});