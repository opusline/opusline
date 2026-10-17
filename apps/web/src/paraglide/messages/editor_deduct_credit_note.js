/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown>, amount: NonNullable<unknown>, invoice: NonNullable<unknown> }} Editor_Deduct_Credit_NoteInputs */

const en_editor_deduct_credit_note = /** @type {(inputs: Editor_Deduct_Credit_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Deduct ${i?.number} (${i?.amount}, invoice ${i?.invoice})`)
};

const fr_editor_deduct_credit_note = /** @type {(inputs: Editor_Deduct_Credit_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Déduire ${i?.number} (${i?.amount}, facture ${i?.invoice})`)
};

/**
* | output |
* | --- |
* | "Deduct {number} ({amount}, invoice {invoice})" |
*
* @param {Editor_Deduct_Credit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_deduct_credit_note = /** @type {((inputs: Editor_Deduct_Credit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Deduct_Credit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_deduct_credit_note(inputs)
	return en_editor_deduct_credit_note(inputs)
});