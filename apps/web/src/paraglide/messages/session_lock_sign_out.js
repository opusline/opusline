/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_Sign_OutInputs */

const en_session_lock_sign_out = /** @type {(inputs: Session_Lock_Sign_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sign out completely`)
};

const fr_session_lock_sign_out = /** @type {(inputs: Session_Lock_Sign_OutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se déconnecter complètement`)
};

/**
* | output |
* | --- |
* | "Sign out completely" |
*
* @param {Session_Lock_Sign_OutInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const session_lock_sign_out = /** @type {((inputs?: Session_Lock_Sign_OutInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Session_Lock_Sign_OutInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_session_lock_sign_out(inputs)
	return en_session_lock_sign_out(inputs)
});