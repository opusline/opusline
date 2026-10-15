/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_Mark_ReadInputs */

const en_release_notes_mark_read = /** @type {(inputs: Release_Notes_Mark_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as read`)
};

const fr_release_notes_mark_read = /** @type {(inputs: Release_Notes_Mark_ReadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer comme lu`)
};

/**
* | output |
* | --- |
* | "Mark as read" |
*
* @param {Release_Notes_Mark_ReadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_mark_read = /** @type {((inputs?: Release_Notes_Mark_ReadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Mark_ReadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_mark_read(inputs)
	return en_release_notes_mark_read(inputs)
});