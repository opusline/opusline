/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_PlaceholderInputs */

const en_treasury_placeholder = /** @type {(inputs: Treasury_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The transfer calculator lands here — VAT and URSSAF provisions deducted.`)
};

const fr_treasury_placeholder = /** @type {(inputs: Treasury_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le calculateur de virement arrive ici — provisions TVA et URSSAF déduites.`)
};

/**
* | output |
* | --- |
* | "The transfer calculator lands here — VAT and URSSAF provisions deducted." |
*
* @param {Treasury_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_placeholder = /** @type {((inputs?: Treasury_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_placeholder(inputs)
	return en_treasury_placeholder(inputs)
});