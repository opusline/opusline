/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_Type_MinorInputs */

const en_release_notes_type_minor = /** @type {(inputs: Release_Notes_Type_MinorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`minor`)
};

const fr_release_notes_type_minor = /** @type {(inputs: Release_Notes_Type_MinorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`mineure`)
};

/**
* | output |
* | --- |
* | "minor" |
*
* @param {Release_Notes_Type_MinorInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_type_minor = /** @type {((inputs?: Release_Notes_Type_MinorInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Type_MinorInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_type_minor(inputs)
	return en_release_notes_type_minor(inputs)
});