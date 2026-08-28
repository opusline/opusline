/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Declarations_Ca3_Computed_NoteInputs */

const en_declarations_ca3_computed_note = /** @type {(inputs: Declarations_Ca3_Computed_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The form computes the rest: ${i?.amount} of tax due, then totals 16, 23, 28 and 32.`)
};

const fr_declarations_ca3_computed_note = /** @type {(inputs: Declarations_Ca3_Computed_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le formulaire calcule le reste : taxe due ${i?.amount}, puis les totaux 16, 23, 28 et 32.`)
};

/**
* | output |
* | --- |
* | "The form computes the rest: {amount} of tax due, then totals 16, 23, 28 and 32." |
*
* @param {Declarations_Ca3_Computed_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_ca3_computed_note = /** @type {((inputs: Declarations_Ca3_Computed_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Ca3_Computed_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_ca3_computed_note(inputs)
	return en_declarations_ca3_computed_note(inputs)
});