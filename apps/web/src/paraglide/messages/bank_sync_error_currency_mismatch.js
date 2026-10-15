/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Sync_Error_Currency_MismatchInputs */

const en_bank_sync_error_currency_mismatch = /** @type {(inputs: Bank_Sync_Error_Currency_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The bank account is not in the account currency.`)
};

const fr_bank_sync_error_currency_mismatch = /** @type {(inputs: Bank_Sync_Error_Currency_MismatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le compte bancaire n'est pas dans la devise du compte.`)
};

/**
* | output |
* | --- |
* | "The bank account is not in the account currency." |
*
* @param {Bank_Sync_Error_Currency_MismatchInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_sync_error_currency_mismatch = /** @type {((inputs?: Bank_Sync_Error_Currency_MismatchInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Sync_Error_Currency_MismatchInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_sync_error_currency_mismatch(inputs)
	return en_bank_sync_error_currency_mismatch(inputs)
});