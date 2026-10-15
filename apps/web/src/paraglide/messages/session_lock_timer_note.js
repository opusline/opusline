/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_Timer_NoteInputs */

const en_session_lock_timer_note = /** @type {(inputs: Session_Lock_Timer_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your timer kept running while Opusline was locked.`)
};

const fr_session_lock_timer_note = /** @type {(inputs: Session_Lock_Timer_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre suivi a continué pendant le verrouillage.`)
};

/**
* | output |
* | --- |
* | "Your timer kept running while Opusline was locked." |
*
* @param {Session_Lock_Timer_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const session_lock_timer_note = /** @type {((inputs?: Session_Lock_Timer_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Session_Lock_Timer_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_session_lock_timer_note(inputs)
	return en_session_lock_timer_note(inputs)
});