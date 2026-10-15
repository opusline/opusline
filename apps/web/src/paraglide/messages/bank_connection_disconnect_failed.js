/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_Disconnect_FailedInputs */

const en_bank_connection_disconnect_failed = /** @type {(inputs: Bank_Connection_Disconnect_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The bank could not be disconnected.`)
};

const fr_bank_connection_disconnect_failed = /** @type {(inputs: Bank_Connection_Disconnect_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La banque n'a pas pu être déconnectée.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_disconnect_failed(inputs)
	return en_bank_connection_disconnect_failed(inputs)
});