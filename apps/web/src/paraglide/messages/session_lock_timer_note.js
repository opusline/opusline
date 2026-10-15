/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Session_Lock_Timer_NoteInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Votre suivi a continué pendant le verrouillage.")
	return /** @type {LocalizedString} */ ("Your timer kept running while Opusline was locked.")
});