/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Column_AmountInputs */

const en_invoices_column_amount = /** @type {(inputs: Invoices_Column_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount`)
};

const fr_invoices_column_amount = /** @type {(inputs: Invoices_Column_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant`)
};

/**
* | output |
* | --- |
* | "Amount" |
*
* @param {Invoices_Column_AmountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_column_amount = /** @type {((inputs?: Invoices_Column_AmountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Column_AmountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_column_amount(inputs)
	return en_invoices_column_amount(inputs)
});