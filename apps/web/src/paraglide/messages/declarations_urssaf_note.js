/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Urssaf_NoteInputs */

const en_declarations_urssaf_note = /** @type {(inputs: Declarations_Urssaf_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No spaces and no cents, the way the form expects it.`)
};

const fr_declarations_urssaf_note = /** @type {(inputs: Declarations_Urssaf_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sans espace ni centimes, comme attendu par le formulaire.`)
};

/**
* | output |
* | --- |
* | "No spaces and no cents, the way the form expects it." |
*
* @param {Declarations_Urssaf_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_urssaf_note = /** @type {((inputs?: Declarations_Urssaf_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Urssaf_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_urssaf_note(inputs)
	return en_declarations_urssaf_note(inputs)
});