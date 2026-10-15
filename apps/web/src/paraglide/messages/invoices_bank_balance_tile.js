/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Bank_Balance_TileInputs */

const en_invoices_bank_balance_tile = /** @type {(inputs: Invoices_Bank_Balance_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business account balance`)
};

const fr_invoices_bank_balance_tile = /** @type {(inputs: Invoices_Bank_Balance_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solde compte pro`)
};

/**
* | output |
* | --- |
* | "Business account balance" |
*
* @param {Invoices_Bank_Balance_TileInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_bank_balance_tile = /** @type {((inputs?: Invoices_Bank_Balance_TileInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Bank_Balance_TileInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_bank_balance_tile(inputs)
	return en_invoices_bank_balance_tile(inputs)
});