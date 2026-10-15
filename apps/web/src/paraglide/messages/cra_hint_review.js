/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Hint_ReviewInputs */

const en_cra_hint_review = /** @type {(inputs: Cra_Hint_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Review before sending`)
};

const fr_cra_hint_review = /** @type {(inputs: Cra_Hint_ReviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vérifiez avant d'envoyer`)
};

/**
* | output |
* | --- |
* | "Review before sending" |
*
* @param {Cra_Hint_ReviewInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_hint_review = /** @type {((inputs?: Cra_Hint_ReviewInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Hint_ReviewInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_hint_review(inputs)
	return en_cra_hint_review(inputs)
});