/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_Without_OptionInputs */

const en_declarations_income_tax_without_option = /** @type {(inputs: Declarations_Income_Tax_Without_OptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Without the option: box 5HQ.`)
};

const fr_declarations_income_tax_without_option = /** @type {(inputs: Declarations_Income_Tax_Without_OptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sans option : case 5HQ.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_without_option(inputs)
	return en_declarations_income_tax_without_option(inputs)
});