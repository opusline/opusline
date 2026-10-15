/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Sync_Error_Credentials_RejectedInputs */



/**
* | output |
* | --- |
* | "Enable Banking refused your application key." |
*
* @param {Bank_Sync_Error_Credentials_RejectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_sync_error_credentials_rejected = /** @type {((inputs?: Bank_Sync_Error_Credentials_RejectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Sync_Error_Credentials_RejectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Enable Banking a refusé la clé de votre application.")
	return /** @type {LocalizedString} */ ("Enable Banking refused your application key.")
});