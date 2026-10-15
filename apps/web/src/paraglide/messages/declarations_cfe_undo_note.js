/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Undo_NoteInputs */



/**
* | output |
* | --- |
* | "The « Taxes » expense stays in the journal." |
*
* @param {Declarations_Cfe_Undo_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_undo_note = /** @type {((inputs?: Declarations_Cfe_Undo_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Undo_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("La dépense « Taxes » reste dans le journal.")
	return /** @type {LocalizedString} */ ("The « Taxes » expense stays in the journal.")
});