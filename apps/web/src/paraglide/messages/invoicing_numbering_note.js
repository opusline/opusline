/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Numbering_NoteInputs */

const en_invoicing_numbering_note = /** @type {(inputs: Invoicing_Numbering_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One continuous sequence per year, assigned on validation. A deleted draft leaves no gap, and the series carries on from the last number, whichever tool issued it.`)
};

const fr_invoicing_numbering_note = /** @type {(inputs: Invoicing_Numbering_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Séquence continue par année, attribuée à la validation. Un brouillon supprimé ne laisse pas de trou, et la série reprend au dernier numéro, quel que soit l'outil qui l'a émis.`)
};

/**
* | output |
* | --- |
* | "One continuous sequence per year, assigned on validation. A deleted draft leaves no gap, and the series carries on from the last number, whichever tool issue..." |
*
* @param {Invoicing_Numbering_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_numbering_note = /** @type {((inputs?: Invoicing_Numbering_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Numbering_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_numbering_note(inputs)
	return en_invoicing_numbering_note(inputs)
});