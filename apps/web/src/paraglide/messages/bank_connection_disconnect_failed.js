/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Disconnect_FailedInputs */



/**
* | output |
* | --- |
* | "The bank could not be disconnected." |
*
* @param {Bank_Connection_Disconnect_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_disconnect_failed = /** @type {((inputs?: Bank_Connection_Disconnect_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Disconnect_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("La banque n'a pas pu être déconnectée.")
	return /** @type {LocalizedString} */ ("The bank could not be disconnected.")
});