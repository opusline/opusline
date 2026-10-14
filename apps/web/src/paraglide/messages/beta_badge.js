/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_BadgeInputs */

const en_beta_badge = /** @type {(inputs: Beta_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Beta`)
};

const fr_beta_badge = /** @type {(inputs: Beta_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bêta`)
};

/**
* | output |
* | --- |
* | "Beta" |
*
* @param {Beta_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_badge = /** @type {((inputs?: Beta_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_badge(inputs)
	return en_beta_badge(inputs)
});