/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Invoices_Add_Fill_BalanceInputs */

const en_invoices_add_fill_balance = /** @type {(inputs: Invoices_Add_Fill_BalanceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Balance · ${i?.amount}`)
};

const fr_invoices_add_fill_balance = /** @type {(inputs: Invoices_Add_Fill_BalanceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Solde · ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "Balance · {amount}" |
*
* @param {Invoices_Add_Fill_BalanceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_fill_balance = /** @type {((inputs: Invoices_Add_Fill_BalanceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Fill_BalanceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_fill_balance(inputs)
	return en_invoices_add_fill_balance(inputs)
});