/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_InstalledInputs */

const en_release_notes_installed = /** @type {(inputs: Release_Notes_InstalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`installed`)
};

const fr_release_notes_installed = /** @type {(inputs: Release_Notes_InstalledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`installée`)
};

/**
* | output |
* | --- |
* | "installed" |
*
* @param {Release_Notes_InstalledInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_installed = /** @type {((inputs?: Release_Notes_InstalledInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_InstalledInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_installed(inputs)
	return en_release_notes_installed(inputs)
});