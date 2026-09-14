/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Unknown_NoteInputs */

const en_declarations_cfe_unknown_note = /** @type {(inputs: Declarations_Cfe_Unknown_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no estimate possible for this year · enter the notice as soon as it is online`)
};

const fr_declarations_cfe_unknown_note = /** @type {(inputs: Declarations_Cfe_Unknown_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucune estimation possible pour cette année · saisissez l'avis dès qu'il est en ligne`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_unknown_note(inputs)
	return en_declarations_cfe_unknown_note(inputs)
});