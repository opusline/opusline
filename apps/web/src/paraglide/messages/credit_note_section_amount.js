/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Section_AmountInputs */

const en_credit_note_section_amount = /** @type {(inputs: Credit_Note_Section_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The amount`)
};

const fr_credit_note_section_amount = /** @type {(inputs: Credit_Note_Section_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le montant`)
};

/**
* | output |
* | --- |
* | "The amount" |
*
* @param {Credit_Note_Section_AmountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_section_amount = /** @type {((inputs?: Credit_Note_Section_AmountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Section_AmountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_section_amount(inputs)
	return en_credit_note_section_amount(inputs)
});