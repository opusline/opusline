/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_TitleInputs */

const en_release_notes_title = /** @type {(inputs: Release_Notes_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Release notes`)
};

const fr_release_notes_title = /** @type {(inputs: Release_Notes_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notes de version`)
};

/**
* | output |
* | --- |
* | "Release notes" |
*
* @param {Release_Notes_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_title = /** @type {((inputs?: Release_Notes_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_title(inputs)
	return en_release_notes_title(inputs)
});