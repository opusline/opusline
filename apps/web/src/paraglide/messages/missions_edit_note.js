/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Edit_NoteInputs */

const en_missions_edit_note = /** @type {(inputs: Missions_Edit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Past entries are not affected`)
};

const fr_missions_edit_note = /** @type {(inputs: Missions_Edit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les entrées passées ne sont pas affectées`)
};

/**
* | output |
* | --- |
* | "Past entries are not affected" |
*
* @param {Missions_Edit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_edit_note = /** @type {((inputs?: Missions_Edit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Edit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_edit_note(inputs)
	return en_missions_edit_note(inputs)
});