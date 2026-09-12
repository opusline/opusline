/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Declarations_Income_Tax_DescriptionInputs */

const en_declarations_income_tax_description = /** @type {(inputs: Declarations_Income_Tax_DescriptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Income tax return · micro-BNC · ${i?.year} income`)
};

const fr_declarations_income_tax_description = /** @type {(inputs: Declarations_Income_Tax_DescriptionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Déclaration de revenus · BNC micro · revenus ${i?.year}`)
};

/**
* | output |
* | --- |
* | "Income tax return · micro-BNC · {year} income" |
*
* @param {Declarations_Income_Tax_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_description = /** @type {((inputs: Declarations_Income_Tax_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_description(inputs)
	return en_declarations_income_tax_description(inputs)
});