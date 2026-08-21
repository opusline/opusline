/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Invoices_Add_Over_NoteInputs */

const en_invoices_add_over_note = /** @type {(inputs: Invoices_Add_Over_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`This amount goes ${i?.amount} past what is left to invoice on the fixed price.`)
};

const fr_invoices_add_over_note = /** @type {(inputs: Invoices_Add_Over_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ce montant dépasse de ${i?.amount} ce qu'il reste à facturer sur le forfait.`)
};

/**
* | output |
* | --- |
* | "This amount goes {amount} past what is left to invoice on the fixed price." |
*
* @param {Invoices_Add_Over_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_over_note = /** @type {((inputs: Invoices_Add_Over_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_Over_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_over_note(inputs)
	return en_invoices_add_over_note(inputs)
});