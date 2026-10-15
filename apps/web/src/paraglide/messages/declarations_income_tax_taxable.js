/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_TaxableInputs */

const en_declarations_income_tax_taxable = /** @type {(inputs: Declarations_Income_Tax_TaxableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taxable income after the 34 % abatement`)
};

const fr_declarations_income_tax_taxable = /** @type {(inputs: Declarations_Income_Tax_TaxableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenu imposable après abattement 34 %`)
};

/**
* | output |
* | --- |
* | "Taxable income after the 34 % abatement" |
*
* @param {Declarations_Income_Tax_TaxableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_taxable = /** @type {((inputs?: Declarations_Income_Tax_TaxableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_TaxableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_taxable(inputs)
	return en_declarations_income_tax_taxable(inputs)
});