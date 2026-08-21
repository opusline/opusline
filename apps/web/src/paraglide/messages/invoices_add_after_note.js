/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Invoices_Add_After_NoteInputs */

const en_invoices_add_after_note = /** @type {(inputs: Invoices_Add_After_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`After this invoice, ${i?.amount} is left to invoice on the fixed price.`)
};

const fr_invoices_add_after_note = /** @type {(inputs: Invoices_Add_After_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Après cette facture, il restera ${i?.amount} à facturer sur le forfait.`)
};

/**
* | output |
* | --- |
* | "After this invoice, {amount} is left to invoice on the fixed price." |
*
* @param {Invoices_Add_After_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_after_note = /** @type {((inputs: Invoices_Add_After_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_After_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_add_after_note(inputs)
	return en_invoices_add_after_note(inputs)
});