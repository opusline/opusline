/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Unbillable_NoteInputs */

const en_missions_unbillable_note = /** @type {(inputs: Missions_Unbillable_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non-billable mission: time is tracked to measure effort, with no rate or invoice.`)
};

const fr_missions_unbillable_note = /** @type {(inputs: Missions_Unbillable_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mission non facturable : le temps est suivi pour mesurer l'effort, sans tarif ni facture.`)
};

/**
* | output |
* | --- |
* | "Non-billable mission: time is tracked to measure effort, with no rate or invoice." |
*
* @param {Missions_Unbillable_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_unbillable_note = /** @type {((inputs?: Missions_Unbillable_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Unbillable_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_unbillable_note(inputs)
	return en_missions_unbillable_note(inputs)
});