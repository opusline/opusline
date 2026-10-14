/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_DescriptionInputs */

const en_beta_description = /** @type {(inputs: Beta_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Try what is coming before everyone else. These features may still change, and your feedback is welcome.`)
};

const fr_beta_description = /** @type {(inputs: Beta_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Essayez ce qui arrive avant tout le monde. Ces fonctionnalités peuvent encore changer, et vos retours sont les bienvenus.`)
};

/**
* | output |
* | --- |
* | "Try what is coming before everyone else. These features may still change, and your feedback is welcome." |
*
* @param {Beta_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_description = /** @type {((inputs?: Beta_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_description(inputs)
	return en_beta_description(inputs)
});