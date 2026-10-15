/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Cfe_Sub_EstimateInputs */

const en_deadlines_cfe_sub_estimate = /** @type {(inputs: Deadlines_Cfe_Sub_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimate — notice available in November on your espace professionnel`)
};

const fr_deadlines_cfe_sub_estimate = /** @type {(inputs: Deadlines_Cfe_Sub_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimation — avis disponible en novembre sur votre espace professionnel`)
};

/**
* | output |
* | --- |
* | "Estimate — notice available in November on your espace professionnel" |
*
* @param {Deadlines_Cfe_Sub_EstimateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_cfe_sub_estimate = /** @type {((inputs?: Deadlines_Cfe_Sub_EstimateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Cfe_Sub_EstimateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_cfe_sub_estimate(inputs)
	return en_deadlines_cfe_sub_estimate(inputs)
});