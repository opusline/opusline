/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_FailedInputs */

const en_session_lock_failed = /** @type {(inputs: Session_Lock_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not unlock. Try again.`)
};

const fr_session_lock_failed = /** @type {(inputs: Session_Lock_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déverrouillage impossible. Réessayez.`)
};

/**
* | output |
* | --- |
* | "Could not unlock. Try again." |
*
* @param {Session_Lock_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const session_lock_failed = /** @type {((inputs?: Session_Lock_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Session_Lock_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_session_lock_failed(inputs)
	return en_session_lock_failed(inputs)
});