/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ credit: NonNullable<unknown>, month: NonNullable<unknown>, gross: NonNullable<unknown>, due: NonNullable<unknown> }} Declarations_Used_Credit_NoteInputs */

const en_declarations_used_credit_note = /** @type {(inputs: Declarations_Used_Credit_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The ${i?.credit} credit carried from ${i?.month} lowers the TVA to pay: ${i?.gross} − ${i?.credit} = ${i?.due}.`)
};

const fr_declarations_used_credit_note = /** @type {(inputs: Declarations_Used_Credit_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le crédit de ${i?.credit} reporté de ${i?.month} réduit la TVA à payer : ${i?.gross} − ${i?.credit} = ${i?.due}.`)
};

/**
* | output |
* | --- |
* | "The {credit} credit carried from {month} lowers the TVA to pay: {gross} − {credit} = {due}." |
*
* @param {Declarations_Used_Credit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_used_credit_note = /** @type {((inputs: Declarations_Used_Credit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Used_Credit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_used_credit_note(inputs)
	return en_declarations_used_credit_note(inputs)
});