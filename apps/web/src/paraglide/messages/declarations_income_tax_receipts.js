/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Declarations_Income_Tax_ReceiptsInputs */

const en_declarations_income_tax_receipts = /** @type {(inputs: Declarations_Income_Tax_ReceiptsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Gross receipts collected in ${i?.year}`)
};

const fr_declarations_income_tax_receipts = /** @type {(inputs: Declarations_Income_Tax_ReceiptsInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Recettes brutes encaissées ${i?.year}`)
};

/**
* | output |
* | --- |
* | "Gross receipts collected in {year}" |
*
* @param {Declarations_Income_Tax_ReceiptsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_income_tax_receipts = /** @type {((inputs: Declarations_Income_Tax_ReceiptsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Income_Tax_ReceiptsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_income_tax_receipts(inputs)
	return en_declarations_income_tax_receipts(inputs)
});