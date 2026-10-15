/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_Needs_LoginInputs */

const en_session_lock_needs_login = /** @type {(inputs: Session_Lock_Needs_LoginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your session ended for good. Signing you in again…`)
};

const fr_session_lock_needs_login = /** @type {(inputs: Session_Lock_Needs_LoginInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre session est définitivement close. Reconnexion…`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_session_lock_needs_login(inputs)
	return en_session_lock_needs_login(inputs)
});