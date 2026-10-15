/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_Kind_ImprovedInputs */

const en_release_notes_kind_improved = /** @type {(inputs: Release_Notes_Kind_ImprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Improved`)
};

const fr_release_notes_kind_improved = /** @type {(inputs: Release_Notes_Kind_ImprovedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amélioré`)
};

/**
* | output |
* | --- |
* | "Improved" |
*
* @param {Release_Notes_Kind_ImprovedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_kind_improved = /** @type {((inputs?: Release_Notes_Kind_ImprovedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Kind_ImprovedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_kind_improved(inputs)
	return en_release_notes_kind_improved(inputs)
});