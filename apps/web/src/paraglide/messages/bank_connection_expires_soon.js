/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Bank_Connection_Expires_SoonInputs */

const en_bank_connection_expires_soon = /** @type {(inputs: Bank_Connection_Expires_SoonInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Access ends on ${i?.date}: reconnect the bank to keep syncing.`)
};

const fr_bank_connection_expires_soon = /** @type {(inputs: Bank_Connection_Expires_SoonInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`L'accès expire le ${i?.date} : reconnectez la banque pour continuer.`)
};

/**
* | output |
* | --- |
* | "Access ends on {date}: reconnect the bank to keep syncing." |
*
* @param {Bank_Connection_Expires_SoonInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_expires_soon = /** @type {((inputs: Bank_Connection_Expires_SoonInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_Expires_SoonInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_expires_soon(inputs)
	return en_bank_connection_expires_soon(inputs)
});