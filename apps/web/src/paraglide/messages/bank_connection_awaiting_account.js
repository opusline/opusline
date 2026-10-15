/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Awaiting_AccountInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Choisissez le compte à synchroniser.")
	return /** @type {LocalizedString} */ ("Choose the account to sync.")
});