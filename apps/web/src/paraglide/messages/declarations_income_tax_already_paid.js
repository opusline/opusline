/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Declarations_Income_Tax_Already_PaidInputs */

const en_declarations_income_tax_already_paid = /** @type {(inputs: Declarations_Income_Tax_Already_PaidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tax already paid · versement libératoire ${i?.year}`)
};

const fr_declarations_income_tax_already_paid = /** @type {(inputs: Declarations_Income_Tax_Already_PaidInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Impôt déjà réglé · versement libératoire ${i?.year}`)
};

/**
* | output |
* | --- |
* | "Tax already paid · versement libératoire {year}" |
*
* @param {Declarations_Income_Tax_Already_PaidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_already_paid = /** @type {((inputs: Declarations_Income_Tax_Already_PaidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_Already_PaidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_already_paid(inputs)
	return en_declarations_income_tax_already_paid(inputs)
});