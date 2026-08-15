/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Edit_NoteInputs */

const en_clients_edit_note = /** @type {(inputs: Clients_Edit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Issued invoices keep the old details`)
};

const fr_clients_edit_note = /** @type {(inputs: Clients_Edit_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les factures émises gardent les anciennes coordonnées`)
};

/**
* | output |
* | --- |
* | "Issued invoices keep the old details" |
*
* @param {Clients_Edit_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_edit_note = /** @type {((inputs?: Clients_Edit_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Edit_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_edit_note(inputs)
	return en_clients_edit_note(inputs)
});