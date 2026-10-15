/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Step_ReviewInputs */

const en_cra_step_review = /** @type {(inputs: Cra_Step_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Review`)
};

const fr_cra_step_review = /** @type {(inputs: Cra_Step_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vérifier`)
};

/**
* | output |
* | --- |
* | "Review" |
*
* @param {Cra_Step_ReviewInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_step_review = /** @type {((inputs?: Cra_Step_ReviewInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Step_ReviewInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_step_review(inputs)
	return en_cra_step_review(inputs)
});