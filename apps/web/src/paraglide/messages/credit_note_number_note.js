/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Credit_Note_Number_NoteInputs */

const en_credit_note_number_note = /** @type {(inputs: Credit_Note_Number_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Number ${i?.number} will be assigned on issue. Credit notes have their own continuous series, and an issued credit note cannot be deleted.`)
};

const fr_credit_note_number_note = /** @type {(inputs: Credit_Note_Number_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le numéro ${i?.number} sera attribué à l'émission. Les avoirs ont leur propre série, continue et sans trou. Un avoir émis ne se supprime pas.`)
};

/**
* | output |
* | --- |
* | "Number {number} will be assigned on issue. Credit notes have their own continuous series, and an issued credit note cannot be deleted." |
*
* @param {Credit_Note_Number_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_number_note = /** @type {((inputs: Credit_Note_Number_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Number_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_number_note(inputs)
	return en_credit_note_number_note(inputs)
});