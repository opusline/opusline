/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_SavedInputs */

const en_beta_saved = /** @type {(inputs: Beta_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Early-access choice saved`)
};

const fr_beta_saved = /** @type {(inputs: Beta_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choix d'avant-première enregistré`)
};

/**
* | output |
* | --- |
* | "Early-access choice saved" |
*
* @param {Beta_SavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_saved = /** @type {((inputs?: Beta_SavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_SavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_saved(inputs)
	return en_beta_saved(inputs)
});