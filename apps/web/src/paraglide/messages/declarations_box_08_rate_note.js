/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Declarations_Box_08_Rate_NoteInputs */

const en_declarations_box_08_rate_note = /** @type {(inputs: Declarations_Box_08_Rate_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`billed at ${i?.rate}: line 9B or 09 of the form`)
};

const fr_declarations_box_08_rate_note = /** @type {(inputs: Declarations_Box_08_Rate_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`facturé à ${i?.rate} : ligne 9B ou 09 du formulaire`)
};

/**
* | output |
* | --- |
* | "billed at {rate}: line 9B or 09 of the form" |
*
* @param {Declarations_Box_08_Rate_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_box_08_rate_note = /** @type {((inputs: Declarations_Box_08_Rate_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Box_08_Rate_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_box_08_rate_note(inputs)
	return en_declarations_box_08_rate_note(inputs)
});