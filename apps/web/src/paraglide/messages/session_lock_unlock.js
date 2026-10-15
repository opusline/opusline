/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_UnlockInputs */

const en_session_lock_unlock = /** @type {(inputs: Session_Lock_UnlockInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unlock`)
};

const fr_session_lock_unlock = /** @type {(inputs: Session_Lock_UnlockInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déverrouiller`)
};

/**
* | output |
* | --- |
* | "Unlock" |
*
* @param {Session_Lock_UnlockInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const session_lock_unlock = /** @type {((inputs?: Session_Lock_UnlockInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Session_Lock_UnlockInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_session_lock_unlock(inputs)
	return en_session_lock_unlock(inputs)
});