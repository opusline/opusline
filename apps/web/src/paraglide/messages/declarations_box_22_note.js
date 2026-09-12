/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown> }} Declarations_Box_22_NoteInputs */

const en_declarations_box_22_note = /** @type {(inputs: Declarations_Box_22_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`TVA credit of ${i?.month} (box 25)`)
};

const fr_declarations_box_22_note = /** @type {(inputs: Declarations_Box_22_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`crédit de TVA de ${i?.month} (case 25)`)
};

/**
* | output |
* | --- |
* | "TVA credit of {month} (box 25)" |
*
* @param {Declarations_Box_22_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_box_22_note = /** @type {((inputs: Declarations_Box_22_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Box_22_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_box_22_note(inputs)
	return en_declarations_box_22_note(inputs)
});