/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Contributions_ScaleInputs */

const en_declarations_contributions_scale = /** @type {(inputs: Declarations_Contributions_ScaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`current rates`)
};

const fr_declarations_contributions_scale = /** @type {(inputs: Declarations_Contributions_ScaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`taux en vigueur`)
};

/**
* | output |
* | --- |
* | "current rates" |
*
* @param {Declarations_Contributions_ScaleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_contributions_scale = /** @type {((inputs?: Declarations_Contributions_ScaleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Contributions_ScaleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_contributions_scale(inputs)
	return en_declarations_contributions_scale(inputs)
});