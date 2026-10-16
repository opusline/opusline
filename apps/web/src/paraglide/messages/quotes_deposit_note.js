/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Quotes_Deposit_NoteInputs */

const en_quotes_deposit_note = /** @type {(inputs: Quotes_Deposit_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`deposit ${i?.amount}`)
};

const fr_quotes_deposit_note = /** @type {(inputs: Quotes_Deposit_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`acompte ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "deposit {amount}" |
*
* @param {Quotes_Deposit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_deposit_note = /** @type {((inputs: Quotes_Deposit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Deposit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_deposit_note(inputs)
	return en_quotes_deposit_note(inputs)
});