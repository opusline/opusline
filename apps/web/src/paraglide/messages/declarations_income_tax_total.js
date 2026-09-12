/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_TotalInputs */

const en_declarations_income_tax_total = /** @type {(inputs: Declarations_Income_Tax_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total`)
};

const fr_declarations_income_tax_total = /** @type {(inputs: Declarations_Income_Tax_TotalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Total`)
};

/**
* | output |
* | --- |
* | "Total" |
*
* @param {Declarations_Income_Tax_TotalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_total = /** @type {((inputs?: Declarations_Income_Tax_TotalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_TotalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_total(inputs)
	return en_declarations_income_tax_total(inputs)
});