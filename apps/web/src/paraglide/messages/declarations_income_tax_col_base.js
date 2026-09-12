/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Income_Tax_Col_BaseInputs */

const en_declarations_income_tax_col_base = /** @type {(inputs: Declarations_Income_Tax_Col_BaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revenue`)
};

const fr_declarations_income_tax_col_base = /** @type {(inputs: Declarations_Income_Tax_Col_BaseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA`)
};

/**
* | output |
* | --- |
* | "Revenue" |
*
* @param {Declarations_Income_Tax_Col_BaseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_col_base = /** @type {((inputs?: Declarations_Income_Tax_Col_BaseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_Col_BaseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_col_base(inputs)
	return en_declarations_income_tax_col_base(inputs)
});