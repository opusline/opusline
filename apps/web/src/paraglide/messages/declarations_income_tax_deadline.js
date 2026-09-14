/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Declarations_Income_Tax_DeadlineInputs */

const en_declarations_income_tax_deadline = /** @type {(inputs: Declarations_Income_Tax_DeadlineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Before ${i?.date} (estimated date)`)
};

const fr_declarations_income_tax_deadline = /** @type {(inputs: Declarations_Income_Tax_DeadlineInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Avant le ${i?.date} (date estimée)`)
};

/**
* | output |
* | --- |
* | "Before {date} (estimated date)" |
*
* @param {Declarations_Income_Tax_DeadlineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_deadline = /** @type {((inputs: Declarations_Income_Tax_DeadlineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_DeadlineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_deadline(inputs)
	return en_declarations_income_tax_deadline(inputs)
});