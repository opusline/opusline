/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Terms_NoteInputs */

const en_invoicing_terms_note = /** @type {(inputs: Invoicing_Terms_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`« End of month »: the due date runs from the last day of the month of issue. A client's own term, set on its record, wins over this one.`)
};

const fr_invoicing_terms_note = /** @type {(inputs: Invoicing_Terms_NoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`« Fin de mois » : l'échéance part du dernier jour du mois d'émission. Le délai d'un client, renseigné sur sa fiche, l'emporte sur celui-ci.`)
};

/**
* | output |
* | --- |
* | "« End of month »: the due date runs from the last day of the month of issue. A client's own term, set on its record, wins over this one." |
*
* @param {Invoicing_Terms_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_terms_note = /** @type {((inputs?: Invoicing_Terms_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Terms_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_terms_note(inputs)
	return en_invoicing_terms_note(inputs)
});