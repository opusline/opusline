/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Awaiting_AccountInputs */

const en_bank_connection_awaiting_account = /** @type {(inputs: Bank_Connection_Awaiting_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose the account to sync.`)
};

const fr_bank_connection_awaiting_account = /** @type {(inputs: Bank_Connection_Awaiting_AccountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez le compte à synchroniser.`)
};

/**
* | output |
* | --- |
* | "Choose the account to sync." |
*
* @param {Bank_Connection_Awaiting_AccountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_awaiting_account = /** @type {((inputs?: Bank_Connection_Awaiting_AccountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Awaiting_AccountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_awaiting_account(inputs)
	return en_bank_connection_awaiting_account(inputs)
});