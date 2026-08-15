/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Forfait_NoteInputs */

const en_missions_forfait_note = /** @type {(inputs: Missions_Forfait_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On a fixed price, time is tracked for your margin but does not enter the billed amount.`)
};

const fr_missions_forfait_note = /** @type {(inputs: Missions_Forfait_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Au forfait, le temps est suivi pour votre marge mais n'entre pas dans le montant facturé.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_forfait_note(inputs)
	return en_missions_forfait_note(inputs)
});