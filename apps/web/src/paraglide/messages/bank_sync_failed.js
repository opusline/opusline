/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Sync_FailedInputs */

const en_bank_sync_failed = /** @type {(inputs: Bank_Sync_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The sync failed.`)
};

const fr_bank_sync_failed = /** @type {(inputs: Bank_Sync_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La synchronisation a échoué.`)
};

/**
* | output |
* | --- |
* | "The sync failed." |
*
* @param {Bank_Sync_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_sync_failed = /** @type {((inputs?: Bank_Sync_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Sync_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_sync_failed(inputs)
	return en_bank_sync_failed(inputs)
});