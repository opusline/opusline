/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_CancelledInputs */

const en_bank_connection_cancelled = /** @type {(inputs: Bank_Connection_CancelledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bank connection cancelled.`)
};

const fr_bank_connection_cancelled = /** @type {(inputs: Bank_Connection_CancelledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connexion à la banque annulée.`)
};

/**
* | output |
* | --- |
* | "Bank connection cancelled." |
*
* @param {Bank_Connection_CancelledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_cancelled = /** @type {((inputs?: Bank_Connection_CancelledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_CancelledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_connection_cancelled(inputs)
	return en_bank_connection_cancelled(inputs)
});