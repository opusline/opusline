/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_Repo_NoteInputs */

const en_release_notes_repo_note = /** @type {(inputs: Release_Notes_Repo_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Full history and migration notes in the repository.`)
};

const fr_release_notes_repo_note = /** @type {(inputs: Release_Notes_Repo_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Historique complet et notes de migration dans le dépôt.`)
};

/**
* | output |
* | --- |
* | "Full history and migration notes in the repository." |
*
* @param {Release_Notes_Repo_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_repo_note = /** @type {((inputs?: Release_Notes_Repo_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Repo_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_repo_note(inputs)
	return en_release_notes_repo_note(inputs)
});