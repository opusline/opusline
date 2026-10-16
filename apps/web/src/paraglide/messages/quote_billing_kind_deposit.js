/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Billing_Kind_DepositInputs */

const en_quote_billing_kind_deposit = /** @type {(inputs: Quote_Billing_Kind_DepositInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deposit`)
};

const fr_quote_billing_kind_deposit = /** @type {(inputs: Quote_Billing_Kind_DepositInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acompte`)
};

/**
* | output |
* | --- |
* | "Deposit" |
*
* @param {Quote_Billing_Kind_DepositInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_billing_kind_deposit = /** @type {((inputs?: Quote_Billing_Kind_DepositInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Billing_Kind_DepositInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_billing_kind_deposit(inputs)
	return en_quote_billing_kind_deposit(inputs)
});