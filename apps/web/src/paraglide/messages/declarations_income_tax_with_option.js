/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_With_OptionInputs */



/**
* | output |
* | --- |
* | "With the versement libératoire: box 5TE." |
*
* @param {Declarations_Income_Tax_With_OptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_with_option = /** @type {((inputs?: Declarations_Income_Tax_With_OptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_With_OptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Avec le versement libératoire : case 5TE.")
	return /** @type {LocalizedString} */ ("With the versement libératoire: box 5TE.")
});