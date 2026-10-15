/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Forfait_NoteInputs */



/**
* | output |
* | --- |
* | "On a fixed price, time is tracked for your margin but does not enter the billed amount." |
*
* @param {Missions_Forfait_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_forfait_note = /** @type {((inputs?: Missions_Forfait_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Forfait_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Au forfait, le temps est suivi pour votre marge mais n'entre pas dans le montant facturé.")
	return /** @type {LocalizedString} */ ("On a fixed price, time is tracked for your margin but does not enter the billed amount.")
});