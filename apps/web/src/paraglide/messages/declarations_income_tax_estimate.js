/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_EstimateInputs */

const en_declarations_income_tax_estimate = /** @type {(inputs: Declarations_Income_Tax_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimate`)
};

const fr_declarations_income_tax_estimate = /** @type {(inputs: Declarations_Income_Tax_EstimateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estimation`)
};

/**
* | output |
* | --- |
* | "Estimate" |
*
* @param {Declarations_Income_Tax_EstimateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_estimate = /** @type {((inputs?: Declarations_Income_Tax_EstimateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_EstimateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_estimate(inputs)
	return en_declarations_income_tax_estimate(inputs)
});