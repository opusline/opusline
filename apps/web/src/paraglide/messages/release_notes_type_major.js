/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_Type_MajorInputs */

const en_release_notes_type_major = /** @type {(inputs: Release_Notes_Type_MajorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`major`)
};

const fr_release_notes_type_major = /** @type {(inputs: Release_Notes_Type_MajorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`majeure`)
};

/**
* | output |
* | --- |
* | "major" |
*
* @param {Release_Notes_Type_MajorInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_type_major = /** @type {((inputs?: Release_Notes_Type_MajorInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Type_MajorInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_type_major(inputs)
	return en_release_notes_type_major(inputs)
});