/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_Repo_NoteInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Historique complet et notes de migration dans le dépôt.")
	return /** @type {LocalizedString} */ ("Full history and migration notes in the repository.")
});