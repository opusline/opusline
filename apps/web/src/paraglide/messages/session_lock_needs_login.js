/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_Needs_LoginInputs */



/**
* | output |
* | --- |
* | "Your session ended for good. Signing you in again…" |
*
* @param {Session_Lock_Needs_LoginInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const session_lock_needs_login = /** @type {((inputs?: Session_Lock_Needs_LoginInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Session_Lock_Needs_LoginInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Votre session est définitivement close. Reconnexion…")
	return /** @type {LocalizedString} */ ("Your session ended for good. Signing you in again…")
});