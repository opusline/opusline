/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Lines_FullInputs */

const en_credit_note_lines_full = /** @type {(inputs: Credit_Note_Lines_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taken from the invoice, at the same VAT rates. They cannot be changed for a full credit note.`)
};

const fr_credit_note_lines_full = /** @type {(inputs: Credit_Note_Lines_FullInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reprises de la facture, au même taux de TVA. Non modifiables pour un avoir total.`)
};

/**
* | output |
* | --- |
* | "Taken from the invoice, at the same VAT rates. They cannot be changed for a full credit note." |
*
* @param {Credit_Note_Lines_FullInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_lines_full = /** @type {((inputs?: Credit_Note_Lines_FullInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Lines_FullInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_lines_full(inputs)
	return en_credit_note_lines_full(inputs)
});