/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Connection_DisconnectedInputs */



/**
* | output |
* | --- |
* | "Your Enable Banking application is ready: connect your bank." |
*
* @param {Bank_Connection_DisconnectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_connection_disconnected = /** @type {((inputs?: Bank_Connection_DisconnectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Connection_DisconnectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Votre application Enable Banking est prête : connectez votre banque.")
	return /** @type {LocalizedString} */ ("Your Enable Banking application is ready: connect your bank.")
});