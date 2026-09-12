/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown> }} Expenses_Regularisation_NoteInputs */

const en_expenses_regularisation_note = /** @type {(inputs: Expenses_Regularisation_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`changed after filing → box 21, CA3 ${i?.month}`)
};

const fr_expenses_regularisation_note = /** @type {(inputs: Expenses_Regularisation_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`modifiée après déclaration → case 21, CA3 ${i?.month}`)
};

/**
* | output |
* | --- |
* | "changed after filing → box 21, CA3 {month}" |
*
* @param {Expenses_Regularisation_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_regularisation_note = /** @type {((inputs: Expenses_Regularisation_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Regularisation_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_regularisation_note(inputs)
	return en_expenses_regularisation_note(inputs)
});