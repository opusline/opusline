/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_ExpiredInputs */

const en_bank_connection_expired = /** @type {(inputs: Bank_Connection_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The access to the bank has expired. Reconnect it to resume syncing.`)
};

const fr_bank_connection_expired = /** @type {(inputs: Bank_Connection_ExpiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'accès à la banque a expiré. Reconnectez-la pour reprendre la synchronisation.`)
};

/**
* | output |
* | --- |
* | "The access to the bank has expired. Reconnect it to resume syncing." |
*
* @param {Bank_Connection_ExpiredInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_expired = /** @type {((inputs?: Bank_Connection_ExpiredInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_ExpiredInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_expired(inputs)
	return en_bank_connection_expired(inputs)
});