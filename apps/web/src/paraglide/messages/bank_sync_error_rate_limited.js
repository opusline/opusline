/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Sync_Error_Rate_LimitedInputs */



/**
* | output |
* | --- |
* | "The bank is limiting reads: the next sync will try again." |
*
* @param {Bank_Sync_Error_Rate_LimitedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_sync_error_rate_limited = /** @type {((inputs?: Bank_Sync_Error_Rate_LimitedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Sync_Error_Rate_LimitedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("La banque limite les lectures : la prochaine synchronisation réessaiera.")
	return /** @type {LocalizedString} */ ("The bank is limiting reads: the next sync will try again.")
});