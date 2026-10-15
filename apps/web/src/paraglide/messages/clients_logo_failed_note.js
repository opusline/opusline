/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Logo_Failed_NoteInputs */

const en_clients_logo_failed_note = /** @type {(inputs: Clients_Logo_Failed_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The client was created, but the logo upload failed. Retry it from “Edit”.`)
};

const fr_clients_logo_failed_note = /** @type {(inputs: Clients_Logo_Failed_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le client a bien été créé, mais l'envoi du logo a échoué. Reprenez-le depuis « Modifier ».`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_logo_failed_note(inputs)
	return en_clients_logo_failed_note(inputs)
});