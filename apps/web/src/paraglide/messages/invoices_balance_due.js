/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Invoices_Balance_DueInputs */

const en_invoices_balance_due = /** @type {(inputs: Invoices_Balance_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Balance due ${i?.amount}`)
};

const fr_invoices_balance_due = /** @type {(inputs: Invoices_Balance_DueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reste à payer ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "Balance due {amount}" |
*
* @param {Invoices_Balance_DueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_balance_due = /** @type {((inputs: Invoices_Balance_DueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Balance_DueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_balance_due(inputs)
	return en_invoices_balance_due(inputs)
});