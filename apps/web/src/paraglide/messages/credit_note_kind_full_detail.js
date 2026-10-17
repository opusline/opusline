/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Kind_Full_DetailInputs */

const en_credit_note_kind_full_detail = /** @type {(inputs: Credit_Note_Kind_Full_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancels the invoice in full. It becomes « Cancelled ».`)
};

const fr_credit_note_kind_full_detail = /** @type {(inputs: Credit_Note_Kind_Full_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annule la facture en totalité. Elle passe en « Annulée ».`)
};

/**
* | output |
* | --- |
* | "Cancels the invoice in full. It becomes « Cancelled »." |
*
* @param {Credit_Note_Kind_Full_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_kind_full_detail = /** @type {((inputs?: Credit_Note_Kind_Full_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Kind_Full_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_kind_full_detail(inputs)
	return en_credit_note_kind_full_detail(inputs)
});