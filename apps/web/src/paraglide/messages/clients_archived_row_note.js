/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Archived_Row_NoteInputs */



/**
* | output |
* | --- |
* | "Archived client — reactivate it to add a mission." |
*
* @param {Clients_Archived_Row_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_archived_row_note = /** @type {((inputs?: Clients_Archived_Row_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Archived_Row_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Client archivé — réactivez-le pour ajouter une mission.")
	return /** @type {LocalizedString} */ ("Archived client — reactivate it to add a mission.")
});