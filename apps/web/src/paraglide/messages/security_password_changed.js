/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Password_ChangedInputs */



/**
* | output |
* | --- |
* | "Password changed. Your other sessions are signed out and your trusted browsers forgotten." |
*
* @param {Security_Password_ChangedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_password_changed = /** @type {((inputs?: Security_Password_ChangedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Password_ChangedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Mot de passe modifié. Vos autres sessions sont déconnectées et vos navigateurs de confiance oubliés.")
	return /** @type {LocalizedString} */ ("Password changed. Your other sessions are signed out and your trusted browsers forgotten.")
});