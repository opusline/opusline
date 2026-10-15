/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Archived_Row_NoteInputs */

const en_clients_archived_row_note = /** @type {(inputs: Clients_Archived_Row_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Archived client — reactivate it to add a mission.`)
};

const fr_clients_archived_row_note = /** @type {(inputs: Clients_Archived_Row_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Client archivé — réactivez-le pour ajouter une mission.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_archived_row_note(inputs)
	return en_clients_archived_row_note(inputs)
});