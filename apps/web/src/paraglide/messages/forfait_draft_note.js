/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Forfait_Draft_NoteInputs */

const en_forfait_draft_note = /** @type {(inputs: Forfait_Draft_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Plus ${i?.count} draft not counted here.`)
};

const fr_forfait_draft_note = /** @type {(inputs: Forfait_Draft_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Plus ${i?.count} brouillon non compté ici.`)
};

/**
* | output |
* | --- |
* | "Plus {count} draft not counted here." |
*
* @param {Forfait_Draft_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const forfait_draft_note = /** @type {((inputs: Forfait_Draft_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forfait_Draft_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_forfait_draft_note(inputs)
	return en_forfait_draft_note(inputs)
});