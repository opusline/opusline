/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Forfait_Drafts_NoteInputs */

const en_forfait_drafts_note = /** @type {(inputs: Forfait_Drafts_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Plus ${i?.count} drafts not counted here.`)
};

const fr_forfait_drafts_note = /** @type {(inputs: Forfait_Drafts_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Plus ${i?.count} brouillons non comptés ici.`)
};

/**
* | output |
* | --- |
* | "Plus {count} drafts not counted here." |
*
* @param {Forfait_Drafts_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const forfait_drafts_note = /** @type {((inputs: Forfait_Drafts_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forfait_Drafts_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_forfait_drafts_note(inputs)
	return en_forfait_drafts_note(inputs)
});