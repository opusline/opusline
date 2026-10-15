/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Box_08_Mixed_NoteInputs */



/**
* | output |
* | --- |
* | "several rates this month: split across lines 08, 9B and 09" |
*
* @param {Declarations_Box_08_Mixed_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_box_08_mixed_note = /** @type {((inputs?: Declarations_Box_08_Mixed_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Box_08_Mixed_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("plusieurs taux ce mois : ventilez sur les lignes 08, 9B et 09")
	return /** @type {LocalizedString} */ ("several rates this month: split across lines 08, 9B and 09")
});