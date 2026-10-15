/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_Unread_BadgeInputs */

const en_release_notes_unread_badge = /** @type {(inputs: Release_Notes_Unread_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unread`)
};

const fr_release_notes_unread_badge = /** @type {(inputs: Release_Notes_Unread_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non lu`)
};

/**
* | output |
* | --- |
* | "Unread" |
*
* @param {Release_Notes_Unread_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_unread_badge = /** @type {((inputs?: Release_Notes_Unread_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Unread_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_unread_badge(inputs)
	return en_release_notes_unread_badge(inputs)
});