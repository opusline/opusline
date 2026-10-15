/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_Kind_NewInputs */

const en_release_notes_kind_new = /** @type {(inputs: Release_Notes_Kind_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New`)
};

const fr_release_notes_kind_new = /** @type {(inputs: Release_Notes_Kind_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau`)
};

/**
* | output |
* | --- |
* | "New" |
*
* @param {Release_Notes_Kind_NewInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_kind_new = /** @type {((inputs?: Release_Notes_Kind_NewInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Kind_NewInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_kind_new(inputs)
	return en_release_notes_kind_new(inputs)
});