/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Cfe_Sub_EstimateInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Estimation — avis disponible en novembre sur votre espace professionnel")
	return /** @type {LocalizedString} */ ("Estimate — notice available in November on your espace professionnel")
});