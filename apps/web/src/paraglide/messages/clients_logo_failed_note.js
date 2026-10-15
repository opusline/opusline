/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Logo_Failed_NoteInputs */



/**
* | output |
* | --- |
* | "The client was created, but the logo upload failed. Retry it from “Edit”." |
*
* @param {Clients_Logo_Failed_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_logo_failed_note = /** @type {((inputs?: Clients_Logo_Failed_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Logo_Failed_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Le client a bien été créé, mais l'envoi du logo a échoué. Reprenez-le depuis « Modifier ».")
	return /** @type {LocalizedString} */ ("The client was created, but the logo upload failed. Retry it from “Edit”.")
});