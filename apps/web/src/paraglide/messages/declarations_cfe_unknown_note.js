/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Unknown_NoteInputs */



/**
* | output |
* | --- |
* | "no estimate possible for this year · enter the notice as soon as it is online" |
*
* @param {Declarations_Cfe_Unknown_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_unknown_note = /** @type {((inputs?: Declarations_Cfe_Unknown_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Unknown_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("aucune estimation possible pour cette année · saisissez l'avis dès qu'il est en ligne")
	return /** @type {LocalizedString} */ ("no estimate possible for this year · enter the notice as soon as it is online")
});