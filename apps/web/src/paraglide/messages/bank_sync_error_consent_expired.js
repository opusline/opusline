/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Sync_Error_Consent_ExpiredInputs */

const en_bank_sync_error_consent_expired = /** @type {(inputs: Bank_Sync_Error_Consent_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The access to the bank has expired.`)
};

const fr_bank_sync_error_consent_expired = /** @type {(inputs: Bank_Sync_Error_Consent_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'accès à la banque a expiré.`)
};

/**
* | output |
* | --- |
* | "The access to the bank has expired." |
*
* @param {Bank_Sync_Error_Consent_ExpiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_sync_error_consent_expired = /** @type {((inputs?: Bank_Sync_Error_Consent_ExpiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Sync_Error_Consent_ExpiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_sync_error_consent_expired(inputs)
	return en_bank_sync_error_consent_expired(inputs)
});