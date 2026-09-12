/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Declarations_Income_Tax_Sheet_TitleInputs */

const en_declarations_income_tax_sheet_title = /** @type {(inputs: Declarations_Income_Tax_Sheet_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`2042-C PRO · ${i?.year} income`)
};

const fr_declarations_income_tax_sheet_title = /** @type {(inputs: Declarations_Income_Tax_Sheet_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`2042-C PRO · revenus ${i?.year}`)
};

/**
* | output |
* | --- |
* | "2042-C PRO · {year} income" |
*
* @param {Declarations_Income_Tax_Sheet_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_sheet_title = /** @type {((inputs: Declarations_Income_Tax_Sheet_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_Sheet_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_sheet_title(inputs)
	return en_declarations_income_tax_sheet_title(inputs)
});