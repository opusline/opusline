/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Sync_Error_UnavailableInputs */

const en_bank_sync_error_unavailable = /** @type {(inputs: Bank_Sync_Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The last sync failed: the bank could not be reached.`)
};

const fr_bank_sync_error_unavailable = /** @type {(inputs: Bank_Sync_Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La dernière synchronisation a échoué : la banque était injoignable.`)
};

/**
* | output |
* | --- |
* | "The last sync failed: the bank could not be reached." |
*
* @param {Bank_Sync_Error_UnavailableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_sync_error_unavailable = /** @type {((inputs?: Bank_Sync_Error_UnavailableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Sync_Error_UnavailableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_sync_error_unavailable(inputs)
	return en_bank_sync_error_unavailable(inputs)
});