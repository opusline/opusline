/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_Without_OptionInputs */



/**
* | output |
* | --- |
* | "Without the option: box 5HQ." |
*
* @param {Declarations_Income_Tax_Without_OptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_without_option = /** @type {((inputs?: Declarations_Income_Tax_Without_OptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_Without_OptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Sans option : case 5HQ.")
	return /** @type {LocalizedString} */ ("Without the option: box 5HQ.")
});