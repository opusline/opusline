/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Unpaid_NoteInputs */

const en_credit_note_unpaid_note = /** @type {(inputs: Credit_Note_Unpaid_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The invoice is not paid in full: the credit note reduces what is due, or cancels it.`)
};

const fr_credit_note_unpaid_note = /** @type {(inputs: Credit_Note_Unpaid_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La facture n'est pas réglée en totalité : l'avoir réduit le solde à payer, ou l'annule.`)
};

/**
* | output |
* | --- |
* | "The invoice is not paid in full: the credit note reduces what is due, or cancels it." |
*
* @param {Credit_Note_Unpaid_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_unpaid_note = /** @type {((inputs?: Credit_Note_Unpaid_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Unpaid_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_unpaid_note(inputs)
	return en_credit_note_unpaid_note(inputs)
});