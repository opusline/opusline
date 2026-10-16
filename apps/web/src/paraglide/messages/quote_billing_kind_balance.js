/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Billing_Kind_BalanceInputs */

const en_quote_billing_kind_balance = /** @type {(inputs: Quote_Billing_Kind_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Balance`)
};

const fr_quote_billing_kind_balance = /** @type {(inputs: Quote_Billing_Kind_BalanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solde`)
};

/**
* | output |
* | --- |
* | "Balance" |
*
* @param {Quote_Billing_Kind_BalanceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_billing_kind_balance = /** @type {((inputs?: Quote_Billing_Kind_BalanceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Billing_Kind_BalanceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_billing_kind_balance(inputs)
	return en_quote_billing_kind_balance(inputs)
});