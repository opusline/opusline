/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Release_Notes_Kind_FixedInputs */

const en_release_notes_kind_fixed = /** @type {(inputs: Release_Notes_Kind_FixedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed`)
};

const fr_release_notes_kind_fixed = /** @type {(inputs: Release_Notes_Kind_FixedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Corrigé`)
};

/**
* | output |
* | --- |
* | "Fixed" |
*
* @param {Release_Notes_Kind_FixedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const release_notes_kind_fixed = /** @type {((inputs?: Release_Notes_Kind_FixedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Release_Notes_Kind_FixedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_release_notes_kind_fixed(inputs)
	return en_release_notes_kind_fixed(inputs)
});