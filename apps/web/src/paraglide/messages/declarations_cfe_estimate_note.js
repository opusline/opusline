/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Cfe_Estimate_NoteInputs */

const en_declarations_cfe_estimate_note = /** @type {(inputs: Declarations_Cfe_Estimate_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`estimated from last year or the commune's scale · enter the notice as soon as it is online`)
};

const fr_declarations_cfe_estimate_note = /** @type {(inputs: Declarations_Cfe_Estimate_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`estimation d'après l'an dernier ou le barème de la commune · saisissez l'avis dès qu'il est en ligne`)
};

/**
* | output |
* | --- |
* | "estimated from last year or the commune's scale · enter the notice as soon as it is online" |
*
* @param {Declarations_Cfe_Estimate_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_estimate_note = /** @type {((inputs?: Declarations_Cfe_Estimate_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Estimate_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_estimate_note(inputs)
	return en_declarations_cfe_estimate_note(inputs)
});