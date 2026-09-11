/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_TitleInputs */

const en_session_lock_title = /** @type {(inputs: Session_Lock_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Locked`)
};

const fr_session_lock_title = /** @type {(inputs: Session_Lock_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verrouillé`)
};

/**
* | output |
* | --- |
* | "Locked" |
*
* @param {Session_Lock_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const session_lock_title = /** @type {((inputs?: Session_Lock_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Session_Lock_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_session_lock_title(inputs)
	return en_session_lock_title(inputs)
});