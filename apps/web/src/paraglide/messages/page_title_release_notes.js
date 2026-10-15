/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Page_Title_Release_NotesInputs */

const en_page_title_release_notes = /** @type {(inputs: Page_Title_Release_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Release notes`)
};

const fr_page_title_release_notes = /** @type {(inputs: Page_Title_Release_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notes de version`)
};

/**
* | output |
* | --- |
* | "Release notes" |
*
* @param {Page_Title_Release_NotesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const page_title_release_notes = /** @type {((inputs?: Page_Title_Release_NotesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Page_Title_Release_NotesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_page_title_release_notes(inputs)
	return en_page_title_release_notes(inputs)
});