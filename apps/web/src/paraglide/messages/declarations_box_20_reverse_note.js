/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Declarations_Box_20_Reverse_NoteInputs */

const en_declarations_box_20_reverse_note = /** @type {(inputs: Declarations_Box_20_Reverse_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`of which ${i?.amount} reverse charged`)
};

const fr_declarations_box_20_reverse_note = /** @type {(inputs: Declarations_Box_20_Reverse_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`dont ${i?.amount} autoliquidés`)
};

/**
* | output |
* | --- |
* | "of which {amount} reverse charged" |
*
* @param {Declarations_Box_20_Reverse_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_box_20_reverse_note = /** @type {((inputs: Declarations_Box_20_Reverse_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Box_20_Reverse_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_box_20_reverse_note(inputs)
	return en_declarations_box_20_reverse_note(inputs)
});