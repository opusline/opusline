/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_Type_PatchInputs */

const en_release_notes_type_patch = /** @type {(inputs: Release_Notes_Type_PatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`patch`)
};

const fr_release_notes_type_patch = /** @type {(inputs: Release_Notes_Type_PatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`corrective`)
};

/**
* | output |
* | --- |
* | "patch" |
*
* @param {Release_Notes_Type_PatchInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_type_patch = /** @type {((inputs?: Release_Notes_Type_PatchInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Type_PatchInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_type_patch(inputs)
	return en_release_notes_type_patch(inputs)
});