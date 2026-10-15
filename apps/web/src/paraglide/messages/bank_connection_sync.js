/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_SyncInputs */

const en_bank_connection_sync = /** @type {(inputs: Bank_Connection_SyncInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sync`)
};

const fr_bank_connection_sync = /** @type {(inputs: Bank_Connection_SyncInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Synchroniser`)
};

/**
* | output |
* | --- |
* | "Sync" |
*
* @param {Bank_Connection_SyncInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_sync = /** @type {((inputs?: Bank_Connection_SyncInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_SyncInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_sync(inputs)
	return en_bank_connection_sync(inputs)
});